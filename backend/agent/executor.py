import os
import difflib
import subprocess
import json
import shutil
import tempfile

# =========================
# Errors
# =========================

class PatchApplyError(Exception):
    pass


# =========================
# Patch Engine
# =========================

def apply_patch(base_path: str, patch: dict):
    """
    Patch format:
    {
        "path": "file",
        "find": "...",
        "replace": "...",
        "mode": "replace" | "append" | "delete"
    }
    """

    path = patch.get("path")
    find = patch.get("find", "")
    replace = patch.get("replace", "")
    mode = patch.get("mode", "replace")

    if not path:
        raise PatchApplyError("Patch missing path")

    full_path = os.path.join(base_path, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # New file
    if not os.path.exists(full_path):
        if not replace.strip():
            raise PatchApplyError(f"Refusing to create empty file: {path}")

        print(f"[Executor] Creating new file: {path}")
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(replace.strip() + "\n")
        return True

    with open(full_path, "r", encoding="utf-8") as f:
        original = f.read()

    updated = original

    if mode == "replace":
        if not find or find not in original:
            raise PatchApplyError(f"Find block not found in {path}")
        updated = original.replace(find, replace, 1)

    elif mode == "append":
        if replace.strip() in original:
            raise PatchApplyError(f"Append no-op in {path}")
        updated = original.rstrip() + "\n\n" + replace.strip() + "\n"

    elif mode == "delete":
        if find not in original:
            raise PatchApplyError(f"Nothing to delete in {path}")
        updated = original.replace(find, "", 1)

    else:
        raise PatchApplyError(f"Unknown patch mode: {mode}")

    if updated == original:
        raise PatchApplyError(f"No-op patch for {path}")

    validate_file(path, updated)
    show_diff(original, updated, path)

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"[Executor] Patched: {path}")
    return True


# =========================
# Validators
# =========================

def validate_file(path: str, content: str):
    if path.endswith(".json"):
        json.loads(content)

    if path.endswith("package.json"):
        if content.count('"test"') > 1:
            raise PatchApplyError("Multiple test scripts detected")

    if path.endswith("pubspec.yaml"):
        if content.count("dependencies:") > 1:
            raise PatchApplyError("Duplicate dependencies block")


# =========================
# Transactional Executor
# =========================

def execute_plan(plan: dict, repo_path: str):
    print("\n[Executor] Applying patches...")

    patches = plan.get("patches", [])
    applied = []

    backup_dir = tempfile.mkdtemp(prefix="agent_backup_")

    try:
        # Backup
        for patch in patches:
            full = os.path.join(repo_path, patch["path"])
            if os.path.exists(full):
                os.makedirs(os.path.dirname(os.path.join(backup_dir, patch["path"])), exist_ok=True)
                shutil.copy2(full, os.path.join(backup_dir, patch["path"]))

        # Apply
        for patch in patches:
            if apply_patch(repo_path, patch):
                applied.append(patch["path"])

        tests = plan.get("tests")
        if not tests:
            print("[Executor] No tests to add.")
            return applied

        if isinstance(tests, list):
            for test in tests:
                path = os.path.join(repo_path, test["path"])
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(test["content"])
                applied.append(test["path"])

        return applied

    except Exception:
        print("[Executor] ❌ Patch failed. Rolling back...")
        for root, _, files in os.walk(backup_dir):
            for file in files:
                rel = os.path.relpath(os.path.join(root, file), backup_dir)
                shutil.copy2(os.path.join(root, file), os.path.join(repo_path, rel))
        raise

    finally:
        shutil.rmtree(backup_dir, ignore_errors=True)


# =========================
# Diff Printer
# =========================

def show_diff(old, new, path):
    print(f"\n[Executor] Diff for {path}:")
    diff = difflib.unified_diff(
        old.splitlines(),
        new.splitlines(),
        fromfile=f"{path} (before)",
        tofile=f"{path} (after)",
        lineterm=""
    )
    for line in diff:
        print(line)


# =========================
# Git Utilities
# =========================

def configure_git_identity(repo_path: str):
    name = os.getenv("GIT_AUTHOR_NAME", "AutoMaintainer")
    email = os.getenv("GIT_AUTHOR_EMAIL", "bot@automaintainer.ai")

    subprocess.run(["git", "config", "user.name", name], cwd=repo_path, check=True)
    subprocess.run(["git", "config", "user.email", email], cwd=repo_path, check=True)

    print(f"[Executor] Git identity set: {name} <{email}>")


def set_authenticated_remote(repo_path: str, repo_url: str):
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        raise RuntimeError("GITHUB_TOKEN not set")

    auth_url = repo_url.replace(
        "https://github.com/",
        f"https://{token}@github.com/"
    )

    subprocess.run(
        ["git", "remote", "set-url", "origin", auth_url],
        cwd=repo_path,
        check=True
    )

    print("[Executor] GitHub authenticated remote configured")


def git_commit(repo_path: str, message: str):
    configure_git_identity(repo_path)

    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repo_path,
        capture_output=True,
        text=True
    )

    if not status.stdout.strip():
        print("[Executor] No changes detected — skipping commit")
        return False

    subprocess.run(["git", "add", "."], cwd=repo_path, check=True)

    commit = subprocess.run(
        ["git", "commit", "-m", message],
        cwd=repo_path,
        check=True,
        capture_output=True,
        text=True
    )

    print(commit.stdout)
    print("[Executor] Git commit created")
    return True


def git_push(repo_path: str, repo_url: str, branch: str):
    set_authenticated_remote(repo_path, repo_url)

    subprocess.run(
        ["git", "push", "-u", "origin", branch],
        cwd=repo_path,
        check=True
    )

    print(f"[Executor] Branch pushed: {branch}")
