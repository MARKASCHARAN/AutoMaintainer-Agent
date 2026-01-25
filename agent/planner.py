from agent.gemini_client import ask_gemini
import json
import re


def safe_parse_json(raw: str) -> dict:
    """
    Attempts to safely extract and parse JSON from LLM output.
    Includes repair for common invalid JSON issues.
    """

    # 1. Extract first JSON block
    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        raise ValueError("No JSON object found in Gemini output")

    text = match.group(0)

    # 2. Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Repair common issue: unescaped quotes inside strings
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

    # 4. Try parsing again
    try:
        return json.loads(repaired)
    except Exception:
        print("[Planner] ❌ JSON repair failed")
        print("\n--- RAW OUTPUT ---")
        print(raw)
        print("\n--- EXTRACTED ---")
        print(text)
        print("\n--- REPAIRED ---")
        print(repaired)
        raise


def plan_fix(diagnosis: str, feedback: str = None):
    print("[Planner] Asking Gemini to create fix plan...")

    prompt = f"""
You are an expert autonomous software repair agent.

Based on this diagnosis:
{diagnosis}

Previous test feedback (if any):
{feedback}

Return ONLY valid JSON in this exact format:

{{
  "summary": "...",
  "patches": [
    {{
      "path": "relative/path/to/file.py",
      "find": "...",
      "replace": "..."
    }}
  ],
  "tests": {{
    "strategy": "what tests were added/updated"
  }}
}}

Rules:
- Output must be pure JSON
- No markdown
- No commentary
- No backticks
"""

    raw = ask_gemini(prompt)

    try:
        plan = extract_json(raw)

    except Exception as e:
        print("[Planner] ❌ Failed to parse plan")
        raise e

    print("[Planner] Plan generated successfully.")
    return plan

def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except:
        # Try to extract first {...} block
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON object found")

        return json.loads(match.group(0))