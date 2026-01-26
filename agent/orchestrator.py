from agent.observer import collect_files, observe_repo
from agent.diagnoser import diagnose_issue
from agent.planner import plan_fix
from agent.executor import execute_plan, git_commit
from agent.verifier import verify_fix

from agent.github_client import (
    ensure_fork_and_remote,
    create_branch,
    push_changes,
    create_pull_request
)

MAX_ATTEMPTS = 3


def run_agent(repo_url: str):
    print("\n=== AutoMaintainer Agent Started ===")

    # Step 1: Clone + observe repo
    context = observe_repo(repo_url)
    repo_path = context["local_path"]

    # Step 2: Initial diagnosis
    diagnosis = diagnose_issue(context)
    last_feedback = None

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n--- Attempt {attempt}/{MAX_ATTEMPTS} ---")

        # ✅ Always reload real repo state
        files = collect_files(repo_path)

        # Step 3: Ask planner for patch
        plan = plan_fix(
            diagnosis=diagnosis,
            files=files,
            last_feedback=last_feedback
        )

        if not isinstance(plan, dict) or "patches" not in plan:
            print("❌ Invalid plan format")
            last_feedback = f"Planner returned invalid plan: {plan}"
            continue

        # Step 4: Validate plan quality
        if not validate_plan(plan, last_feedback or ""):
            print("⚠️ Rejected low-quality plan")
            last_feedback = (
                "Your previous fix avoided the real issue. "
                "Fix the actual error shown in logs. "
                "Do NOT add fake tests, dummy scripts, or random dependency changes."
            )
            continue

        # Step 5: Try applying patches
        try:
            applied = execute_plan(plan, repo_path)
        except Exception as e:
            print("❌ Patch failed, retrying...")
            last_feedback = str(e)
            continue

        # Step 6: Verify project
        result = verify_fix(plan, repo_path)

        # Step 7: Success path
        if result.success:
            print("✅ Tests passed")

            if applied:
                git_commit(repo_path, f"AutoMaintainer fix in {attempt} attempt(s)")

                ensure_fork_and_remote(repo_url, repo_path)
                branch = create_branch(repo_path)
                push_changes(repo_path)

                pr_url = create_pull_request(
                    repo_url=repo_url,
                    branch=branch,
                    title=f"AutoMaintainer Fix ({attempt} attempt)",
                    body=plan.get("summary", "Automated fix by AI agent")
                )

                return {
                    "status": "success",
                    "attempts": attempt,
                    "applied": applied,
                    "pr": pr_url,
                    "output": result.output[-2000:]
                }

            return {
                "status": "success",
                "attempts": attempt,
                "applied": [],
                "output": result.output[-2000:]
            }

        # Step 8: Failure path → retry with logs
        print("❌ Tests failed, retrying...")
        last_feedback = result.output[-4000:]

    # Step 9: Total failure
    return {
        "status": "failed",
        "attempts": MAX_ATTEMPTS,
        "last_output": last_feedback
    }


# --------------------------------------------------
# PLAN VALIDATOR — critical to prevent garbage fixes
# --------------------------------------------------

def validate_plan(plan: dict, error_log: str) -> bool:
    """
    Reject plans that:
    - Add fake test scripts
    - Randomly change dependencies
    - Spam duplicate config
    - Avoid root cause
    """

    suspicious_files = {"package.json", "pubspec.yaml", "requirements.txt"}

    for patch in plan.get("patches", []):
        path = patch.get("path", "")
        replace = patch.get("replace", "")

        # 1. Block fake npm test workaround
        if path == "package.json":
            if "test" in replace and "Missing script" in error_log:
                print("[Validator] Rejected fake npm test workaround")
                return False

        # 2. Block random dependency edits
        if path in suspicious_files:
            if "dependency" not in error_log.lower() and "version" not in error_log.lower():
                print(f"[Validator] Rejected random dependency edit in {path}")
                return False

        # 3. Block duplication spam (url_launcher, etc.)
        if replace.count("url_launcher") > 1:
            print("[Validator] Rejected duplicate dependency spam")
            return False

        # 4. Block empty/no-op patches
        if not replace.strip():
            print("[Validator] Rejected empty patch")
            return False

    return True
