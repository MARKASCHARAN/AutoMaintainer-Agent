from agent.gemini_client import ask_gemini
import json
import re
import difflib


# -----------------------------
# Utils
# -----------------------------

def normalize(text: str) -> str:
    """Normalize text for relaxed matching (removes whitespace noise)."""
    return "\n".join(
        line.strip()
        for line in text.replace("\r", "").split("\n")
        if line.strip()
    )


# -----------------------------
# Robust JSON extraction
# -----------------------------

def extract_json(raw: str) -> dict:
    """
    Safely extract the first valid JSON object from LLM output.
    Repairs common JSON issues.
    """
    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        raise ValueError("No JSON found in model output")

    text = match.group(0)

    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Repair common broken summary strings
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

    file_map = {f["path"]: f["content"] for f in files}

    for patch in plan["patches"]:
        if not all(k in patch for k in ("path", "find", "replace")):
            raise ValueError(f"Invalid patch format: {patch}")

        path = patch["path"]
        find = patch["find"]

        if path not in file_map:
            raise ValueError(f"Patch targets unknown file: {path}")

        content = file_map[path]

        # Strict match first
        if find in content:
            continue

        # Relaxed normalized match fallback
        if normalize(find) in normalize(content):
            continue

        # If still no match → fail safely
        closest = difflib.get_close_matches(find[:200], content.splitlines(), n=1)
        hint = f"\nClosest match: {closest[0]}" if closest else ""

        raise ValueError(
            f"Find block does NOT exist in {path}. Refusing hallucinated patch.{hint}"
        )


# -----------------------------
# Planner with self-healing
# -----------------------------

def plan_fix(diagnosis, files, last_feedback=None, max_attempts=3):
    file_dump = ""
    for f in files:
        file_dump += f"\n### FILE: {f['path']}\n{f['content']}\n"

    base_prompt = f"""
You are an autonomous senior software repair agent.

You are given REAL files. You MUST obey these rules:
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

    feedback = last_feedback

    for attempt in range(1, max_attempts + 1):
        print(f"[Planner] Attempt {attempt}/{max_attempts}")

        prompt = base_prompt
        if feedback:
            prompt += f"\nPrevious failure:\n{feedback}\nFix your mistakes."

        raw = ask_gemini(prompt)

        try:
            plan = extract_json(raw)
            validate_plan(plan, files)
            print("[Planner] ✅ Plan generated successfully.")
            return plan

        except Exception as e:
            print(f"[Planner] ❌ Validation failed: {e}")
            feedback = str(e)

    print("[Planner] ⚠️ All attempts failed. Returning safe empty plan.")
    return {
        "summary": "Model could not produce a safe grounded patch.",
        "patches": []
    }
