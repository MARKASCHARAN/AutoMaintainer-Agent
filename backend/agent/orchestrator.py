from agent.observer import collect_files, observe_repo
from agent.diagnoser import diagnose_issue
from agent.planner import plan_fix
from agent.executor import execute_plan, git_commit
from agent.verifier import verify_fix
from agent.pr_description import generate_pr_description

from agent.github_client import (
    ensure_fork_and_remote,
    create_branch,
    push_changes,
    create_pull_request
)

import hashlib

MAX_ATTEMPTS = 3


def fingerprint_plan(plan):
    return hashlib.md5(str(plan).encode()).hexdigest()


def run_agent(repo_url: str):
    print("\n=== AutoMaintainer Agent Started ===")

    context = observe_repo(repo_url)
    repo_path = context["local_path"]

    # 🔐 MUST be first: identity + authenticated remote
    ensure_fork_and_remote(repo_url, repo_path)

    # 🌿 Create branch ONCE per run
    branch = create_branch(repo_path)

    diagnosis = diagnose_issue(context)
    last_feedback = None
    previous_fingerprints = set()

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n--- Attempt {attempt}/{MAX_ATTEMPTS} ---")

        files = collect_files(repo_path)

        augmented_feedback = (
            f"Attempt {attempt}. Previous feedback:\n{last_feedback}"
            if last_feedback else None
        )

        plan = plan_fix(
            diagnosis=diagnosis,
            files=files,
            last_feedback=augmented_feedback
        )

        if not isinstance(plan, dict) or "patches" not in plan:
            last_feedback = f"Invalid plan format: {plan}"
            continue

        fp = fingerprint_plan(plan)
        if fp in previous_fingerprints:
            last_feedback = (
                "You repeated the same plan which failed. "
                "Produce a DIFFERENT fix."
            )
            continue
        previous_fingerprints.add(fp)

        if not validate_plan(plan, last_feedback or ""):
            last_feedback = "Plan rejected by validator."
            continue

        try:
            applied = execute_plan(plan, repo_path)
        except Exception as e:
            last_feedback = f"Patch failed: {e}"
            continue

        if not applied:
            last_feedback = "Patch made no effective changes."
            continue

        result = verify_fix(plan, repo_path)

        if not result.success:
            last_feedback = result.output[-4000:]
            continue

        print("✅ Verification passed")

        # ✅ Commit AFTER identity + branch exist
        committed = git_commit(
            repo_path,
            f"AutoMaintainer fix in {attempt} attempt(s)"
        )

        if not committed:
            raise RuntimeError("Git commit failed — aborting PR creation")

        # ✅ Push with authenticated remote
        push_changes(repo_path)

        pr_body = generate_pr_description(repo_path, plan, result)
        pr_title = f"AutoMaintainer Fix ({attempt} attempt)"

        pr_url = create_pull_request(
            repo_url=repo_url,
            branch=branch,
            title=pr_title,
            body=pr_body
        )

        files_changed = list(
            {p["path"] for p in plan.get("patches", [])}
        )

        return {
            "status": "success",
            "attempts": attempt,
            "applied": applied,
            "pr": pr_url,
            "files_changed": files_changed,
            "output": result.output[-2000:]
        }

    return {
        "status": "failed",
        "attempts": MAX_ATTEMPTS,
        "last_output": last_feedback
    }


# --------------------------------------------------
# PLAN VALIDATOR
# --------------------------------------------------

def validate_plan(plan: dict, error_log: str) -> bool:
    suspicious_files = {"package.json", "pubspec.yaml", "requirements.txt"}

    for patch in plan.get("patches", []):
        path = patch.get("path", "")
        replace = patch.get("replace", "")

        if not replace.strip():
            return False

        if path in suspicious_files:
            if not any(
                word in error_log.lower()
                for word in ("dependency", "version", "install")
            ):
                return False

    return True
