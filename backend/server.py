"""
Minimal FastAPI backend for KrunchMate landing site.
Frontend-only scope per user brief — backend exists only to satisfy platform
routing (all /api/* traffic must resolve) and to accept the newsletter
capture as a no-op stub.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="KrunchMate API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Subscriber(BaseModel):
    email: EmailStr


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "krunchmate"}


@app.post("/api/subscribe")
async def subscribe(payload: Subscriber):
    # Frontend-only build — we simply echo back a success response.
    return {"status": "subscribed", "email": payload.email}
