import os
import subprocess
import requests
import time
from urllib.parse import urlparse

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")

if not GITHUB_TOKEN or not GITHUB_USERNAME:
    raise RuntimeError("❌ Set GITHUB_TOKEN and GITHUB_USERNAME in .env")

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}


# -------------------------
# Utils
# -------------------------

def get_default_branch(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    res = requests.get(url, headers=HEADERS)

    if res.status_code != 200:
        raise RuntimeError(f"Failed to fetch repo info: {res.text}")

    data = res.json()
    return data["default_branch"]


def parse_repo(repo_url: str):
    path = urlparse(repo_url).path.strip("/")
    owner, repo = path.split("/")
    return owner, repo.replace(".git", "")


def run(cmd, cwd):
    return subprocess.run(cmd, cwd=cwd, check=True, capture_output=True, text=True)


# -------------------------
# GitHub API
# -------------------------

def fork_repo(owner, repo):
    print(f"[GitHub] Forking {owner}/{repo} → {GITHUB_USERNAME}/{repo}")
    url = f"https://api.github.com/repos/{owner}/{repo}/forks"
    res = requests.post(url, headers=HEADERS)

    if res.status_code not in (202, 201):
        raise RuntimeError(f"Fork failed: {res.text}")

    # GitHub needs a few seconds to finish fork
    time.sleep(4)


def repo_exists(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    res = requests.get(url, headers=HEADERS)
    return res.status_code == 200


def create_pull_request(repo_url, branch, title, body):
    owner, repo = parse_repo(repo_url)

    # Step 1: Get upstream default branch
    upstream_default = get_default_branch(owner, repo)

    print(f"[GitHub] Upstream default branch: {upstream_default}")

    # Step 2: Verify branch actually exists on upstream
    check_url = f"https://api.github.com/repos/{owner}/{repo}/branches/{upstream_default}"
    check = requests.get(check_url, headers=HEADERS)

    if check.status_code != 200:
        raise RuntimeError(
            f"Base branch '{upstream_default}' does not exist on upstream repo."
        )

    # Step 3: Create PR
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

    payload = {
        "title": title,
        "body": body,
        "head": f"{GITHUB_USERNAME}:{branch}",
        "base": upstream_default
    }

    res = requests.post(url, headers=HEADERS, json=payload)

    if res.status_code != 201:
        raise RuntimeError(f"PR creation failed: {res.text}")

    pr_url = res.json()["html_url"]
    print(f"[GitHub] PR created: {pr_url}")
    return pr_url

# -------------------------
# Git Operations
# -------------------------

def run_git(cmd, cwd):
    try:
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
        if result.stdout and result.stdout.strip():
            print(result.stdout.strip())
        if result.stderr and result.stderr.strip():
            print(result.stderr.strip())
        
        if result.returncode != 0:
            raise RuntimeError(f"Git command failed: {' '.join(cmd)}\n{result.stderr}")
        return result
    except Exception as e:
        raise RuntimeError(f"Git execution error: {e}")

def ensure_fork_and_remote(repo_url, repo_path):
    owner, repo = parse_repo(repo_url)

    if owner != GITHUB_USERNAME:
        if not repo_exists(GITHUB_USERNAME, repo):
            fork_repo(owner, repo)

        fork_url = f"https://github.com/{GITHUB_USERNAME}/{repo}.git"
        upstream_url = f"https://github.com/{owner}/{repo}.git"

        print(f"[GitHub] Setting origin → {fork_url}")
        run_git(["git", "remote", "set-url", "origin", fork_url], cwd=repo_path)

        # Add upstream remote if missing
        remotes = run_git(["git", "remote"], cwd=repo_path).stdout

        if "upstream" not in remotes:
            run_git(["git", "remote", "add", "upstream", upstream_url], cwd=repo_path)

        # Sync fork with upstream
        print("[GitHub] Syncing fork with upstream...")
        run_git(["git", "fetch", "upstream"], cwd=repo_path)

        default_branch = get_default_branch(owner, repo)

        run_git(["git", "checkout", default_branch], cwd=repo_path)

        run_git(["git", "merge", f"upstream/{default_branch}"], cwd=repo_path)


def create_branch(repo_path):
    branch = f"automaintainer/{os.urandom(4).hex()}"
    run_git(["git", "checkout", "-b", branch], cwd=repo_path)
    print(f"[GitHub] Created branch: {branch}")
    return branch


def push_changes(repo_path):
    run_git(["git", "push", "-u", "origin", "HEAD"], cwd=repo_path)
    print("[GitHub] Changes pushed")
