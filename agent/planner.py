from agent.gemini_client import ask_gemini
import json
import re


# -----------------------------
# Robust JSON extraction
# -----------------------------

def extract_json(raw: str) -> dict:
    """
    Safely extract the first valid JSON object from LLM output.
    Repairs common JSON issues.
    """
    # 1. Extract first {...} block
    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        raise ValueError("No JSON found in model output")

    text = match.group(0)

    # 2. Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Repair unescaped quotes inside summary
    def escape_inner_quotes(match):
        prefix = match.group(1)
        content = match.group(2)
        suffix = match.group(3)
        content = content.replace('"', '\\"')
        return prefix + content + suffix

    repaired = re.sub(
        r'("summary"\s*:\s*")(.*?)(")',
        escape_inner_quotes,
        text,
        flags=re.DOTALL
    )

    try:
        return json.loads(repaired)
    except Exception:
        print("\n[Planner] ❌ JSON parse failed")
        print("\n--- RAW ---\n", raw)
        print("\n--- EXTRACTED ---\n", text)
        print("\n--- REPAIRED ---\n", repaired)
        raise


# -----------------------------
# Validation
# -----------------------------

def validate_plan(plan: dict, files: list) -> None:
    """
    Raises exception if plan is unsafe or malformed.
    """
    if not isinstance(plan, dict):
        raise ValueError("Plan must be a dict")

    if "patches" not in plan:
        raise ValueError("Plan missing 'patches'")

    if not isinstance(plan["patches"], list):
        raise ValueError("'patches' must be a list")

    # Build lookup for file contents
    file_map = {f["path"]: f["content"] for f in files}

    for patch in plan["patches"]:
        if "path" not in patch or "find" not in patch or "replace" not in patch:
            raise ValueError(f"Invalid patch format: {patch}")

        path = patch["path"]
        find = patch["find"]

        if path not in file_map:
            raise ValueError(f"Patch targets unknown file: {path}")

        if find not in file_map[path]:
            raise ValueError(
                f"Find block does NOT exist in {path}. Refusing hallucinated patch."
            )


# -----------------------------
# Planner
# -----------------------------

def plan_fix(diagnosis, files, last_feedback=None):
    file_dump = ""
    for f in files:
        file_dump += f"\n### FILE: {f['path']}\n{f['content']}\n"

    prompt = f"""
You are an autonomous senior software repair agent.

You are given real files. You MUST obey these rules:
- Only propose patches where "find" is an EXACT substring of the file.
- Copy the "find" text exactly from the file.
- If unsure, return empty patches.
- Never invent dependencies.
- Never add fake tests to bypass failures.
- Do not modify package.json/pubspec.yaml unless the error explicitly requires it.

Files:
{file_dump}

Diagnosis:
{diagnosis}

Previous failure:
{last_feedback or "None"}

Return ONLY valid JSON:
{{
  "summary": "short explanation",
  "patches": [
    {{
      "path": "relative/path",
      "find": "exact original text",
      "replace": "updated text"
    }}
  ]
}}
"""

    raw = ask_gemini(prompt)

    plan = extract_json(raw)

    # Validate safety
    validate_plan(plan, files)

    print("[Planner] Plan generated successfully.")
    return plan
