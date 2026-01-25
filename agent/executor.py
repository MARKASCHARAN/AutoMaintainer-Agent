import os
import difflib
import subprocess


class PatchApplyError(Exception):
    pass


def apply_patch(base_path: str, patch: dict):
    path = patch.get("path")
    find = patch.get("find")
    replace = patch.get("replace")

    if not path or find is None or replace is None:
        raise PatchApplyError(f"Invalid patch format: {patch}")

    full_path = os.path.join(base_path, path)

    if not os.path.exists(full_path):
        raise PatchApplyError(f"File not found: {full_path}")

    with open(full_path, "r", encoding="utf-8") as f:
        original = f.read()

    if find not in original:
        if replace in original:
            print(f"[Executor] Patch already applied for {path}, skipping.")
            return
        raise PatchApplyError(
            f"Find block not found in {path}\n\nExpected:\n{find[:300]}"
        )

    updated = original.replace(find, replace, 1)

    show_diff(original, updated, path)

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"[Executor] Patched: {path}")



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


def execute_plan(plan: dict, repo_path: str):
    print("\n[Executor] Applying patches...")

    applied = []

    patches = plan.get("patches", [])
    for patch in patches:
        apply_patch(repo_path, patch)
        applied.append(patch["path"])

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

    print("\n[Executor] Execution finished.")
    return applied


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
