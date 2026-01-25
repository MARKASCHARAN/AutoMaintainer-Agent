from pydantic import BaseModel

class RunAgentRequest(BaseModel):
    repo_url: str
