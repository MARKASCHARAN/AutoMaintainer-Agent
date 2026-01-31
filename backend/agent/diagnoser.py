from agent.gemini_client import ask_gemini

def diagnose_issue(context):
    print("[Diagnoser] Sending summarized context to Gemini...")

    summary = context["summary"]  

    prompt = f"""
You are a senior software engineer debugging a repository.

Repository summary:
{summary}

Your task:
1. Identify the most likely root cause of failure
2. Identify the file(s) responsible
3. Explain the issue technically and clearly

Be concise but precise.
"""

    result = ask_gemini(prompt)

    print("[Diagnoser] Gemini response received.")
    return result
