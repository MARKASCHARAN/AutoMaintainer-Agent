


import os
import subprocess
import shutil

BASE_DIR = "/tmp/automaintainer"
MAX_FILE_SIZE = 8000  # characters per file (safe for tokens)
ALLOWED_EXTENSIONS = (
    # Backend / general
    ".py", ".js", ".ts", ".java", ".go", ".rs", ".cpp", ".c", ".cs",

    # Flutter / mobile
    ".dart",
    ".yaml",
    ".yml",
    ".json",

    # Config / build
    ".gradle",
    ".xml",
    ".toml",
    ".ini",
    ".env",
    ".md"
)

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", "target",
    ".dart_tool", ".idea", ".vscode", "__pycache__"
}



def clone_repo(repo_url: str, dest: str):
    if os.path.exists(dest):
        shutil.rmtree(dest)

    print(f"[Observer] Cloning repo into {dest}")
    subprocess.run(
        ["git", "clone", "--depth=1", repo_url, dest],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def collect_files(repo_path: str):
    collected = []

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for file in files:
            if file.endswith(ALLOWED_EXTENSIONS):
                full_path = os.path.join(root, file)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                        if len(content) > MAX_FILE_SIZE:
                            content = content[:MAX_FILE_SIZE] + "\n... [TRUNCATED]"

                        relative = os.path.relpath(full_path, repo_path)

                        collected.append({
                            "path": relative,
                            "content": content
                        })

                except Exception as e:
                    print(f"[Observer] Skipped {full_path}: {e}")

    return collected


def observe_repo(repo_url: str):
    print("[Observer] Observing repo:", repo_url)

    os.makedirs(BASE_DIR, exist_ok=True)

    repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
    local_path = os.path.join(BASE_DIR, repo_name)

    clone_repo(repo_url, local_path)

    files = collect_files(local_path)

    print(f"[Observer] Collected {len(files)} source files")

    # ✅ Build structured summary for Diagnoser
    summary = {
        "file_tree": [f["path"] for f in files],
        "important_files": {
            f["path"]: f["content"][:2000]
            for f in files
            if f["path"].endswith((
                "package.json",
                "tsconfig.json",
                "pubspec.yaml",
                "pyproject.toml",
                "requirements.txt"
            ))
        }
    }

    return {
        "repo": repo_url,
        "local_path": local_path,
        "files": files,     # for planner
        "summary": summary  # for diagnoser ✅
    }


def summarize_repo(files: dict):
    summary = {
        "file_tree": list(files.keys()),
        "important_files": {}
    }

    for path, content in files.items():
        if path.endswith((
            "package.json",
            "tsconfig.json",
            "pubspec.yaml",
            "pyproject.toml",
            "requirements.txt"
        )):
            summary["important_files"][path] = content[:2000]

    return summary


