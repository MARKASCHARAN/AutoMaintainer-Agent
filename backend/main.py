from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agent import router as agent_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AutoMaintainer Agent API")

# ✅ CORS: allow frontend + local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://auto-maintainer-agent.vercel.app/",  # 👈 replace with your real Vercel URL
    ],
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)

@app.get("/")
def root():
    return {"status": "AutoMaintainer Agent backend running"}

PORT = int(os.getenv("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=False
    )
