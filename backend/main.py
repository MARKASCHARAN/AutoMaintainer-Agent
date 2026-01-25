from fastapi import FastAPI
from backend.routes.agent import router as agent_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoMaintainer Agent API")
app.include_router(agent_router)

@app.get("/")
def root():
    return {"status": "AutoMaintainer Agent backend running"}
