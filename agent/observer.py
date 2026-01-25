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
    collected = {}

    for root, dirs, files in os.walk(repo_path):
        # Skip .git and node_modules and build folders
        dirs[:] = [
    d for d in dirs
    if d not in {
        ".git", "node_modules", "dist", "build", "target",
        ".dart_tool", ".idea", ".vscode", "__pycache__"
    }
]


        for file in files:
            if file.endswith(ALLOWED_EXTENSIONS):
                full_path = os.path.join(root, file)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                        # Trim huge files
                        if len(content) > MAX_FILE_SIZE:
                            content = content[:MAX_FILE_SIZE] + "\n... [TRUNCATED]"

                        relative = os.path.relpath(full_path, repo_path)
                        collected[relative] = content

                except Exception as e:
                    print(f"[Observer] Skipped {full_path}: {e}")

    return collected


def observe_repo(repo_url: str):
    print("[Observer] Observing repo:", repo_url)

    os.makedirs(BASE_DIR, exist_ok=True)

    repo_name = repo_url.rstrip("/").split("/")[-1]
    local_path = os.path.join(BASE_DIR, repo_name)

    clone_repo(repo_url, local_path)
    files = collect_files(local_path)

    print(f"[Observer] Collected {len(files)} source files")

    summary = summarize_repo(files)
    return {
    "repo": repo_url,
    "file_count": len(files),
    "summary": summary,
    "local_path": local_path
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
