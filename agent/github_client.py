import os
import subprocess
import requests
import uuid


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")


def create_branch(repo_path: str) -> str:
    branch = f"automaintainer/{uuid.uuid4().hex[:8]}"

    subprocess.run(["git", "checkout", "-b", branch], cwd=repo_path, check=True)
    subprocess.run(["git", "push", "-u", "origin", branch], cwd=repo_path, check=True)

    print(f"[GitHub] Created branch: {branch}")
    return branch


def push_changes(repo_path: str):
    subprocess.run(["git", "push"], cwd=repo_path, check=True)
    print("[GitHub] Changes pushed")


def create_pull_request(repo_url: str, branch: str, title: str, body: str):
    if not GITHUB_TOKEN:
        raise RuntimeError("❌ GITHUB_TOKEN missing")

    owner, repo = repo_url.rstrip("/").split("/")[-2:]

    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    payload = {
        "title": title,
        "body": body,
        "head": branch,
        "base": "main"
    }

    res = requests.post(url, headers=headers, json=payload)

    if res.status_code not in (200, 201):
        raise RuntimeError(f"PR creation failed: {res.status_code} {res.text}")

    pr_url = res.json()["html_url"]
    print(f"[GitHub] PR created: {pr_url}")
    return pr_url
