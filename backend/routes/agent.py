import sys
import threading
import queue
import json
import time
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from schemas.request import RunAgentRequest
from services.agent_service import run_agent_service


router = APIRouter()

class OutputCapture:
    def __init__(self, q):
        self.q = q

    def write(self, text):
        if text.strip():
            self.q.put(text)
    
    def flush(self):
        pass

def run_agent_worker(repo_url, q):
    capture = OutputCapture(q)
    original_stdout = sys.stdout
    sys.stdout = capture
    
    try:
        # Simulate initial connection log
        print(f"[System] Connected to backend. Starting agent for {repo_url}...")
        result = run_agent_service(repo_url)
        q.put("___RESULT___" + json.dumps(result))
    except Exception as e:
        q.put("___ERROR___" + str(e))
    finally:
        sys.stdout = original_stdout
        q.put(None) # Sentinel

@router.get("/stream-agent")
async def stream_agent(repo_url: str):
    q = queue.Queue()
    t = threading.Thread(target=run_agent_worker, args=(repo_url, q))
    t.start()

    def event_generator():
        while True:
            item = q.get()
            if item is None:
                break
            
            if item.startswith("___RESULT___"):
                data = item.replace("___RESULT___", "")
                yield f"event: result\ndata: {data}\n\n"
            elif item.startswith("___ERROR___"):
                data = item.replace("___ERROR___", "")
                yield f"event: error\ndata: {data}\n\n"
            else:
                # Sanitize for SSE - handle multi-line output (like diffs)
                clean_item = item.strip()
                if clean_item:
                    # Split into lines and prefix each with data:
                    for line in clean_item.split('\n'):
                        if line.strip():
                            yield f"data: {line}\n"
                    yield "\n" # End of event
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# Keep the POST route for backward compatibility / API usage
@router.post("/run-agent")
def run_agent(req: RunAgentRequest):
    result = run_agent_service(req.repo_url)
    return {"message": "Agent executed", "result": result}



# End of backend/routes/agent.py