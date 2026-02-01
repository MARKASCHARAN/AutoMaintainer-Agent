import os
import subprocess
import requests
import time
from urllib.parse import urlparse

# =========================
# ENV
# =========================

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")

if not GITHUB_TOKEN or not GITHUB_USERNAME:
    raise RuntimeError("❌ Set GITHUB_TOKEN and GITHUB_USERNAME in environment")

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# =========================
# Utils
# =========================

def parse_repo(repo_url: str):
    path = urlparse(repo_url).path.strip("/")
    owner, repo = path.split("/")
    return owner, repo.replace(".git", "")


def run_git(cmd, cwd):
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.stderr:
        print(result.stderr.strip())
    if result.returncode != 0:
        raise RuntimeError(f"Git failed: {' '.join(cmd)}")
    return result


def configure_git_identity(repo_path: str):
    name = os.getenv("GIT_AUTHOR_NAME", "AutoMaintainer")
    email = os.getenv("GIT_AUTHOR_EMAIL", "bot@automaintainer.ai")

    run_git(["git", "config", "user.name", name], cwd=repo_path)
    run_git(["git", "config", "user.email", email], cwd=repo_path)

    print(f"[GitHub] Git identity set: {name} <{email}>")

# =========================
# GitHub API
# =========================

def repo_exists(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    return requests.get(url, headers=HEADERS).status_code == 200


def fork_repo(owner, repo):
    print(f"[GitHub] Forking {owner}/{repo}")
    url = f"https://api.github.com/repos/{owner}/{repo}/forks"
    res = requests.post(url, headers=HEADERS)
    if res.status_code not in (201, 202):
        raise RuntimeError(f"Fork failed: {res.text}")
    time.sleep(4)


def get_default_branch(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        raise RuntimeError(res.text)
    return res.json()["default_branch"]


# =========================
# Git Operations
# =========================

def ensure_fork_and_remote(repo_url, repo_path):
    owner, repo = parse_repo(repo_url)

    configure_git_identity(repo_path)

    if owner != GITHUB_USERNAME:
        if not repo_exists(GITHUB_USERNAME, repo):
            fork_repo(owner, repo)

        # 🔐 AUTHENTICATED fork remote
        fork_url = f"https://{GITHUB_TOKEN}@github.com/{GITHUB_USERNAME}/{repo}.git"
        upstream_url = f"https://github.com/{owner}/{repo}.git"

        run_git(["git", "remote", "set-url", "origin", fork_url], cwd=repo_path)

        remotes = run_git(["git", "remote"], cwd=repo_path).stdout or ""
        if "upstream" not in remotes:
            run_git(["git", "remote", "add", "upstream", upstream_url], cwd=repo_path)

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


# =========================
# Pull Request
# =========================

def create_pull_request(repo_url, branch, title, body):
    owner, repo = parse_repo(repo_url)
    base = get_default_branch(owner, repo)

    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

    payload = {
        "title": title,
        "body": body,
        "head": f"{GITHUB_USERNAME}:{branch}",
        "base": base
    }

    res = requests.post(url, headers=HEADERS, json=payload)
    if res.status_code != 201:
        raise RuntimeError(f"PR creation failed: {res.text}")

    pr_url = res.json()["html_url"]
    print(f"[GitHub] PR created: {pr_url}")
    return pr_url
