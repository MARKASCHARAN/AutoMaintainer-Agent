import os
import json
import hashlib
from dotenv import load_dotenv, find_dotenv
from google import genai
from google.genai.errors import ClientError

# ----------------------------
# Setup
# ----------------------------
load_dotenv(find_dotenv())

USE_MOCK = os.getenv("USE_MOCK_LLM", "false").lower() == "true"
CACHE_DIR = ".llm_cache"
MODEL = "gemini-2.5-flash-lite"

api_key = os.getenv("GOOGLE_API_KEY")

if not USE_MOCK and not api_key:
    raise RuntimeError("❌ GOOGLE_API_KEY not found in .env")

client = genai.Client(api_key=api_key) if not USE_MOCK else None

os.makedirs(CACHE_DIR, exist_ok=True)


# ----------------------------
# Helpers
# ----------------------------
def cache_key(prompt: str) -> str:
    return hashlib.md5(prompt.encode()).hexdigest()


def load_cache(key: str):
    path = os.path.join(CACHE_DIR, key + ".txt")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None


def save_cache(key: str, value: str):
    path = os.path.join(CACHE_DIR, key + ".txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write(value)


# ----------------------------
# Mock fallback
# ----------------------------
def mock_response(prompt: str) -> str:
    print("[LLM] ⚠️ Using mock response")

    return json.dumps({
        "summary": "Mock fix plan (LLM disabled)",
        "patches": [],
        "tests": {
            "strategy": "No tests modified in mock mode"
        }
    })


# ----------------------------
# Main function (FIXED)
# ----------------------------
def ask_gemini(prompt: str, use_cache: bool = True) -> str:
    """
    use_cache=True  -> normal behavior
    use_cache=False -> forces fresh model call (used on retries)
    """

    key = cache_key(prompt)

    # 1. Cache hit (only if allowed)
    if use_cache:
        cached = load_cache(key)
        if cached:
            print("[LLM] Using cached response")
            return cached

    # 2. Mock mode forced
    if USE_MOCK:
        result = mock_response(prompt)
        save_cache(key, result)
        return result

    # 3. Real Gemini call
    try:
        print("[LLM] Calling Gemini...")

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        text = response.text.strip()

        # Save to cache only if enabled
        if use_cache:
            save_cache(key, text)

        return text

    # 4. API failure fallback
    except ClientError as e:
        print(f"[LLM] ⚠️ Gemini error: {e}")
        print("[LLM] Falling back to mock mode")

        result = mock_response(prompt)
        if use_cache:
            save_cache(key, result)
        return result

    except Exception as e:
        print(f"[LLM] ⚠️ Unexpected error: {e}")
        print("[LLM] Falling back to mock mode")

        result = mock_response(prompt)
        if use_cache:
            save_cache(key, result)
        return result
