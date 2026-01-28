from fastapi import APIRouter
from backend.schemas.request import RunAgentRequest
from backend.services.agent_service import run_agent_service

router = APIRouter()

@router.post("/run-agent")
def run_agent(req: RunAgentRequest):
    result = run_agent_service(req.repo_url)
    return {"message": "Agent executed", "result": result}



# End of backend/routes/agent.py