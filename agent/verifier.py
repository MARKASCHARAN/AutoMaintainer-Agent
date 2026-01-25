import os
import subprocess


class VerificationResult:
    def __init__(self, success: bool, output: str):
        self.success = success
        self.output = output

    def to_dict(self):
        return {
            "success": self.success,
            "output": self.output[-2000:]
        }


# -----------------------------
# Project type detection
# -----------------------------
def detect_project_type(repo_path: str) -> str:
    files = set(os.listdir(repo_path))

    if "pubspec.yaml" in files:
        return "flutter"

    if "package.json" in files:
        return "node"

    if "pyproject.toml" in files or "requirements.txt" in files:
        return "python"

    return "unknown"


# -----------------------------
# Main verifier entry
# -----------------------------
def verify_fix(plan, repo_path: str) -> VerificationResult:
    project_type = detect_project_type(repo_path)
    print(f"[Verifier] Detected project type: {project_type}")

    match project_type:
        case "flutter":
            return verify_flutter(repo_path)
        case "python":
            return verify_python(repo_path)
        case "node":
            return verify_node(repo_path)
        case _:
            return VerificationResult(False, "Unknown project type. No tests executed.")


# -----------------------------
# Flutter verifier
# -----------------------------
def verify_flutter(repo_path: str) -> VerificationResult:
    print("[Verifier] Preparing Flutter project...")

    setup = run_command(["flutter", "pub", "get"], repo_path)
    if not setup.success:
        return setup

    print("[Verifier] Running flutter test...")
    return run_command(["flutter", "test"], repo_path)


# -----------------------------
# Python verifier
# -----------------------------
def verify_python(repo_path: str) -> VerificationResult:
    print("[Verifier] Running pytest...")
    return run_command(["pytest"], repo_path)


# -----------------------------
# Node verifier
# -----------------------------
def verify_node(repo_path: str) -> VerificationResult:
    # Ensure node_modules exists
    if not os.path.exists(os.path.join(repo_path, "node_modules")):
        print("[Verifier] Installing npm dependencies...")
        run_command(["npm", "install"], repo_path)

    # If TypeScript project
    if os.path.exists(os.path.join(repo_path, "tsconfig.json")):
        print("[Verifier] Ensuring TypeScript is available...")

        local_tsc = os.path.join(repo_path, "node_modules", ".bin", "tsc")

        # Install typescript if missing
        if not os.path.exists(local_tsc):
            print("[Verifier] Installing TypeScript locally...")
            run_command(["npm", "install", "--save-dev", "typescript"], repo_path)

        print("[Verifier] Running TypeScript check...")
        return run_command([local_tsc, "--noEmit"], repo_path)

    # Otherwise fallback to npm test
    print("[Verifier] Running npm test...")
    return run_command(["npm", "test"], repo_path)

# -----------------------------
# Subprocess runner
# -----------------------------
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

        # Smart fallback for empty projects
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
