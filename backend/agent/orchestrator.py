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
    """Detect identical plans across retries to avoid infinite loops."""
    return hashlib.md5(str(plan).encode()).hexdigest()


def run_agent(repo_url: str):
    print("\n=== AutoMaintainer Agent Started ===")

    context = observe_repo(repo_url)
    repo_path = context["local_path"]

    diagnosis = diagnose_issue(context)
    last_feedback = None
    previous_fingerprints = set()

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n--- Attempt {attempt}/{MAX_ATTEMPTS} ---")

        files = collect_files(repo_path)

        # Force planner variability by injecting attempt #
        augmented_feedback = (
            f"Attempt {attempt}. "
            f"Previous feedback:\n{last_feedback}"
            if last_feedback else None
        )

        plan = plan_fix(
            diagnosis=diagnosis,
            files=files,
            last_feedback=augmented_feedback
        )

        if not isinstance(plan, dict) or "patches" not in plan:
            print("❌ Invalid plan format")
            last_feedback = f"Invalid plan structure: {plan}"
            continue

        # Detect repeated plans
        fp = fingerprint_plan(plan)
        if fp in previous_fingerprints:
            print("⚠️ Identical plan repeated — forcing failure")
            last_feedback = (
                "You repeated the same plan which failed. "
                "You must produce a DIFFERENT fix addressing the verifier error."
            )
            continue
        previous_fingerprints.add(fp)

        # Quality filter
        if not validate_plan(plan, last_feedback or ""):
            last_feedback = (
                "Your fix was rejected. Do NOT bypass errors. "
                "Fix the real bug revealed in logs."
            )
            continue

        # Apply patch
        try:
            applied = execute_plan(plan, repo_path)
        except Exception as e:
            last_feedback = f"Patch failed: {e}"
            continue

        # Block no-op patch
        if not applied:
            last_feedback = (
                "Your patch applied but made no effective changes. "
                "Propose a meaningful fix."
            )
            continue

        # Verify
        result = verify_fix(plan, repo_path)

        if result.success:
            print("✅ Verification passed")

            git_commit(repo_path, f"AutoMaintainer fix in {attempt} attempt(s)")

            ensure_fork_and_remote(repo_url, repo_path)
            branch = create_branch(repo_path)
            push_changes(repo_path)

            try:
                pr_body = generate_pr_description(repo_path, plan, result)
            except Exception:
                pr_body = plan.get("summary", "Automated fix by AutoMaintainer")

            pr_title = f"AutoMaintainer Fix ({attempt} attempt)"
            pr_url = create_pull_request(
                repo_url=repo_url,
                branch=branch,
                title=pr_title,
                body=pr_body
            )

            files_changed = list(set(p["path"] for p in plan.get("patches", [])))

            return {
                "status": "success",
                "attempts": attempt,
                "applied": applied,
                "pr": pr_url,
                "pr_title": pr_title,
                "files_changed": files_changed,
                "output": result.output[-2000:]
            }

        # Feed verifier output back
        print("❌ Verification failed")
        print(result.output[-1500:])
        last_feedback = (
            "Your fix failed verification.\n\n"
            "Verifier output:\n"
            f"{result.output[-4000:]}"
        )

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
            print("[Validator] Empty patch rejected")
            return False

        if path in suspicious_files:
            if not any(word in error_log.lower() for word in ["dependency", "version", "install"]):
                print(f"[Validator] Suspicious edit rejected: {path}")
                return False

        if replace.count("url_launcher") > 1:
            print("[Validator] Duplicate spam rejected")
            return False

    return True
