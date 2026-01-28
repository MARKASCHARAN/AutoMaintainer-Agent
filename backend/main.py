from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.agent import router as agent_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoMaintainer Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)

@app.get("/")
def root():
    return {"status": "AutoMaintainer Agent backend running"}
