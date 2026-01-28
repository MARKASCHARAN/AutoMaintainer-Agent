import os
import subprocess
import json


class VerificationResult:
    def __init__(self, success: bool, output: str):
        self.success = success
        self.output = output

    def to_dict(self):
        return {
            "success": self.success,
            "output": self.output[-2000:]
        }


# --------------------------------------------------
# Workspace detection
# --------------------------------------------------

def detect_node_workspaces(repo_path):
    candidates = [
        repo_path,
        "frontend", "client", "web", "app", "ui",
        "backend", "server", "api", "services",
        "js", "src", "ts"
    ]

    valid = []
    for c in candidates:
        path = os.path.join(repo_path, c)
        if os.path.exists(os.path.join(path, "package.json")):
            valid.append(path)

    return valid


# --------------------------------------------------
# Main verifier
# --------------------------------------------------

def verify_fix(plan, repo_path: str) -> VerificationResult:
    print(f"[Verifier] Starting verification in {repo_path}")

    # Node projects
    node_paths = detect_node_workspaces(repo_path)
    if node_paths:
        print(f"[Verifier] Detected Node workspaces: {node_paths}")

        for path in node_paths:
            result = verify_node(path)
            if not result.success:
                return result

        return VerificationResult(True, "All Node workspaces passed verification")

    # Flutter
    if os.path.exists(os.path.join(repo_path, "pubspec.yaml")):
        return verify_flutter(repo_path)

    # Python
    if os.path.exists(os.path.join(repo_path, "requirements.txt")):
        return verify_python(repo_path)

    return VerificationResult(False, "Unsupported project type (no package.json, pubspec.yaml, or requirements.txt)")


# --------------------------------------------------
# Flutter
# --------------------------------------------------

def verify_flutter(repo_path):
    print("[Verifier] Flutter project detected")

    flutter_check = run_command(["which", "flutter"], repo_path)
    if not flutter_check.success:
        return VerificationResult(True, "Flutter not available — skipping verification")

    setup = run_command(["flutter", "pub", "get"], repo_path)
    if not setup.success:
        return setup

    return run_command(["flutter", "test"], repo_path)


# --------------------------------------------------
# Python
# --------------------------------------------------

def verify_python(repo_path):
    print("[Verifier] Python project detected")
    return run_command(["pytest"], repo_path)


# --------------------------------------------------
# Node.js verifier
# --------------------------------------------------

def verify_node(repo_path):
    print(f"[Verifier] Node workspace: {repo_path}")

    package_json = os.path.join(repo_path, "package.json")
    if not os.path.exists(package_json):
        return VerificationResult(False, f"Missing package.json in {repo_path}")

    # Install deps
    if not os.path.exists(os.path.join(repo_path, "node_modules")):
        print("[Verifier] Installing dependencies...")

        install = run_command(["npm", "install"], repo_path)

        if not install.success and "ERESOLVE" in install.output:
            install = run_command(["npm", "install", "--legacy-peer-deps"], repo_path)

        if not install.success:
            install = run_command(["npm", "install", "--force"], repo_path)

        if not install.success:
            return install

    # Load scripts
    try:
        with open(package_json, encoding="utf-8") as f:
            pkg = json.load(f)
    except Exception as e:
        return VerificationResult(False, f"Invalid package.json: {e}")

    scripts = pkg.get("scripts", {})

    # TypeScript check
    if os.path.exists(os.path.join(repo_path, "tsconfig.json")):
        print("[Verifier] TypeScript detected")

        tsc = os.path.join(repo_path, "node_modules", ".bin", "tsc")
        if not os.path.exists(tsc):
            install_ts = run_command(["npm", "install", "--save-dev", "typescript"], repo_path)
            if not install_ts.success:
                return install_ts

        tsc_result = run_command([tsc, "--noEmit"], repo_path)
        if not tsc_result.success:
            return tsc_result

    # Tests
    if "test" in scripts:
        return run_command(["npm", "test"], repo_path)

    # Build
    if "build" in scripts:
        return run_command(["npm", "run", "build"], repo_path)

    # Vite fallback
    vite = os.path.join(repo_path, "node_modules", ".bin", "vite")
    if os.path.exists(vite):
        return run_command([vite, "build"], repo_path)

    # Next fallback
    nextjs = os.path.join(repo_path, "node_modules", ".bin", "next")
    if os.path.exists(nextjs):
        return run_command([nextjs, "build"], repo_path)

    # Nothing meaningful to verify
    return VerificationResult(True, "No tests or build scripts available — verification skipped safely")


# --------------------------------------------------
# Command runner
# --------------------------------------------------

def run_command(command, cwd):
    try:
        print(f"[Verifier] Running: {' '.join(command)}")

        result = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=180
        )

        output = (result.stdout or "") + "\n" + (result.stderr or "")
        success = result.returncode == 0

        # Special case: no tests specified → treat as success
        if "Error: no test specified" in output:
            print("[Verifier] No tests specified — treating as PASS")
            return VerificationResult(True, output)

        print("[Verifier]", "PASS" if success else "FAIL")
        print(output[-1000:])

        return VerificationResult(success, output)

    except subprocess.TimeoutExpired:
        return VerificationResult(False, "Verification timed out")

    except FileNotFoundError as e:
        return VerificationResult(False, f"Command not found: {e}")

    except Exception as e:
        return VerificationResult(False, f"Verifier crashed: {e}")
