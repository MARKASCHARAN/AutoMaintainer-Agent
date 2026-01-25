import subprocess
import os

def detect_project_type(repo_path):
    if os.path.exists(f"{repo_path}/pubspec.yaml"):
        return "flutter"
    if os.path.exists(f"{repo_path}/requirements.txt"):
        return "python"
    if os.path.exists(f"{repo_path}/package.json"):
        return "node"
    return "unknown"


def run_tests(repo_path):
    project = detect_project_type(repo_path)

    if project == "flutter":
        return subprocess.run(["flutter", "test"], cwd=repo_path)
    elif project == "python":
        return subprocess.run(["pytest"], cwd=repo_path)
    elif project == "node":
        return subprocess.run(["npm", "test"], cwd=repo_path)
    else:
        raise Exception("Unknown project type")
