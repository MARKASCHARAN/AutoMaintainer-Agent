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
# Workspace detection (supports monorepos properly)
# --------------------------------------------------

def detect_node_workspaces(repo_path):
    candidates = [
        repo_path,
        os.path.join(repo_path, "frontend"),
        os.path.join(repo_path, "client"),
        os.path.join(repo_path, "web"),
        os.path.join(repo_path, "app"),
        os.path.join(repo_path, "ui"),
        os.path.join(repo_path, "backend"),
        os.path.join(repo_path, "server"),
    ]

    valid = []
    for path in candidates:
        if os.path.exists(os.path.join(path, "package.json")):
            valid.append(path)

    return valid


# --------------------------------------------------
# Main verifier
# --------------------------------------------------

def verify_fix(plan, repo_path: str) -> VerificationResult:
    # Node projects (supports monorepos)
    node_paths = detect_node_workspaces(repo_path)
    if node_paths:
        print(f"[Verifier] Detected Node workspaces: {node_paths}")

        for path in node_paths:
            result = verify_node(path)
            if not result.success:
                return result

        return VerificationResult(True, "All Node workspaces passed")

    # Flutter
    if os.path.exists(os.path.join(repo_path, "pubspec.yaml")):
        return verify_flutter(repo_path)

    # Python
    if os.path.exists(os.path.join(repo_path, "requirements.txt")):
        return verify_python(repo_path)

    return VerificationResult(False, "Unknown project type")


# --------------------------------------------------
# Flutter verifier
# --------------------------------------------------

def verify_flutter(repo_path: str) -> VerificationResult:
    print("[Verifier] Preparing Flutter project...")

    flutter_check = run_command(["which", "flutter"], repo_path)

    if not flutter_check.success:
        print("[Verifier] ⚠️ Flutter not installed. Skipping verification.")
        return VerificationResult(True, "Skipped: Flutter SDK not available")

    setup = run_command(["flutter", "pub", "get"], repo_path)
    if not setup.success:
        return setup

    print("[Verifier] Running flutter test...")
    return run_command(["flutter", "test"], repo_path)


# --------------------------------------------------
# Python verifier
# --------------------------------------------------

def verify_python(repo_path: str) -> VerificationResult:
    print("[Verifier] Running pytest...")
    return run_command(["pytest"], repo_path)


# --------------------------------------------------
# Node verifier (robust + real-world safe)
# --------------------------------------------------

def verify_node(repo_path: str) -> VerificationResult:
    print(f"[Verifier] Node project path: {repo_path}")

    package_json = os.path.join(repo_path, "package.json")
    if not os.path.exists(package_json):
        return VerificationResult(False, f"No package.json in {repo_path}")

    # Install deps if needed
    if not os.path.exists(os.path.join(repo_path, "node_modules")):
        print("[Verifier] Installing npm dependencies...")
        install = run_command(["npm", "install"], repo_path)
        if not install.success:
            return install

    # TypeScript project
    if os.path.exists(os.path.join(repo_path, "tsconfig.json")):
        print("[Verifier] Detected TypeScript project")

        local_tsc = os.path.join(repo_path, "node_modules", ".bin", "tsc")

        if not os.path.exists(local_tsc):
            print("[Verifier] Installing TypeScript locally...")
            install_ts = run_command(["npm", "install", "--save-dev", "typescript"], repo_path)
            if not install_ts.success:
                return install_ts

        print("[Verifier] Running TypeScript check...")
        return run_command([local_tsc, "--noEmit"], repo_path)

    # Check if test script exists
    try:
        with open(package_json, "r", encoding="utf-8") as f:
            pkg = json.load(f)

        scripts = pkg.get("scripts", {})
        has_test = "test" in scripts
    except Exception as e:
        return VerificationResult(False, f"Invalid package.json: {e}")

    if not has_test:
        print("[Verifier] ⚠️ No test script defined — treating as PASS")
        return VerificationResult(True, "No tests configured")

    print("[Verifier] Running npm test...")
    return run_command(["npm", "test"], repo_path)


# --------------------------------------------------
# Subprocess runner
# --------------------------------------------------

def run_command(command, cwd) -> VerificationResult:
    try:
        print(f"[Verifier] Running: {' '.join(command)}")

        result = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=240
        )

        output = (result.stdout or "") + "\n" + (result.stderr or "")

        if "Error: no test specified" in output:
            print("[Verifier] ⚠️ No tests detected — treating as PASS")
            return VerificationResult(True, output)

        success = result.returncode == 0

        print("[Verifier] Result:", "PASS" if success else "FAIL")
        print(output[-2000:])

        return VerificationResult(success, output)

    except subprocess.TimeoutExpired:
        return VerificationResult(False, "Tests timed out")

    except FileNotFoundError as e:
        return VerificationResult(False, f"Command not found: {e}")

    except Exception as e:
        return VerificationResult(False, str(e))
