import os
import difflib
import subprocess
import json

class PatchApplyError(Exception):
    pass


# -------------------------
# Patch Engine
# -------------------------

def apply_patch(base_path: str, patch: dict):
    """
    Patch format supports:
    {
        "path": "file",
        "find": "...",
        "replace": "...",
        "mode": "replace" | "append" | "delete" (optional)
    }
    """

    path = patch.get("path")
    find = patch.get("find", "")
    replace = patch.get("replace", "")
    mode = patch.get("mode", "replace")

    if not path:
        raise PatchApplyError(f"Patch missing path: {patch}")

    full_path = os.path.join(base_path, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # ------------------
    # New file
    # ------------------
    if not os.path.exists(full_path):
        if not replace.strip():
            raise PatchApplyError(f"Refusing to create empty file: {path}")

        print(f"[Executor] Creating new file: {path}")
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(replace.strip() + "\n")
        return

    with open(full_path, "r", encoding="utf-8") as f:
        original = f.read()

    updated = original

    # ------------------
    # Replace
    # ------------------
    if mode == "replace":
        if not find:
            raise PatchApplyError("Replace mode requires 'find'")

        if find not in original:
            raise PatchApplyError(
                f"Find block not found in {path}. Refusing blind replace."
            )

        updated = original.replace(find, replace, 1)

    # ------------------
    # Append
    # ------------------
    elif mode == "append":
        if replace.strip() in original:
            print(f"[Executor] Skipping duplicate append in {path}")
            return

        updated = original.rstrip() + "\n\n" + replace.strip() + "\n"

    # ------------------
    # Delete
    # ------------------
    elif mode == "delete":
        if find not in original:
            print(f"[Executor] Nothing to delete in {path}")
            return

        updated = original.replace(find, "", 1)

    else:
        raise PatchApplyError(f"Unknown patch mode: {mode}")

    # ------------------
    # Validate structured files
    # ------------------
    validate_file(path, updated)

    # ------------------
    # Show diff
    # ------------------
    show_diff(original, updated, path)

    # ------------------
    # Write file
    # ------------------
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"[Executor] Patched: {path}")


# -------------------------
# Validators
# -------------------------

def validate_file(path: str, content: str):
    """Prevent agent from breaking config files"""

    if path.endswith(".json"):
        try:
            json.loads(content)
        except Exception as e:
            raise PatchApplyError(f"Invalid JSON after patch in {path}: {e}")

    if path.endswith("pubspec.yaml"):
        if content.count("dependencies:") > 1:
            raise PatchApplyError("Duplicate dependencies block detected")

    if path.endswith("package.json"):
        if content.count('"test"') > 1:
            raise PatchApplyError("Multiple test scripts detected")


# -------------------------
# Executor
# -------------------------

def execute_plan(plan: dict, repo_path: str):
    print("\n[Executor] Applying patches...")

    applied = []
    patches = plan.get("patches", [])

    for patch in patches:
        try:
            apply_patch(repo_path, patch)
            applied.append(patch["path"])
        except PatchApplyError as e:
            print(f"[Executor] ❌ Patch rejected: {e}")
            raise  # propagate to orchestrator retry loop

    tests = plan.get("tests")

    if not tests:
        print("[Executor] No tests to add.")
        return applied

    if isinstance(tests, dict):
        print(f"[Executor] Test strategy: {tests.get('strategy')}")
        return applied

    if isinstance(tests, list):
        for test in tests:
            path = os.path.join(repo_path, test["path"])
            os.makedirs(os.path.dirname(path), exist_ok=True)

            with open(path, "w", encoding="utf-8") as f:
                f.write(test["content"])

            print(f"[Executor] Created test: {path}")
            applied.append(test["path"])

    return applied

# -------------------------
# Diff printer
# -------------------------

def show_diff(old, new, path):
    print(f"\n[Executor] Diff for {path}:\n")
    diff = difflib.unified_diff(
        old.splitlines(),
        new.splitlines(),
        fromfile="before",
        tofile="after",
        lineterm=""
    )
    for line in diff:
        print(line)


# -------------------------
# Git commit
# -------------------------

def git_commit(repo_path: str, message: str):
    try:
        status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=repo_path,
            capture_output=True,
            text=True
        )

        if not status.stdout.strip():
            print("[Executor] No changes detected, skipping commit")
            return

        subprocess.run(["git", "add", "."], cwd=repo_path, check=True)
        subprocess.run(["git", "commit", "-m", message], cwd=repo_path, check=True)

        print("[Executor] Git commit created")

    except Exception as e:
        print("[Executor] Git commit skipped:", e)
