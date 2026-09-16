"""
Minimal FastAPI backend for KrunchMate landing site.

Frontend-only ecommerce scope, but the following endpoints are wired to
MongoDB so lead-capture submissions (newsletter, contact, pre-order) are
actually retrievable:

  GET  /api/health
  POST /api/subscribe        — newsletter capture
  POST /api/contact          — contact-form submissions (persisted)
  POST /api/preorder         — soft-launch pre-order lead capture (persisted)
  GET  /api/admin/submissions — read-back for a quick manual smoke test
"""
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
import os

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, field_validator

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

app = FastAPI(title="KrunchMate API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_client: Optional[AsyncIOMotorClient] = None


def db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URL)
    return _client[DB_NAME]


# ---------- Schemas ---------------------------------------------------------

class Subscriber(BaseModel):
    email: EmailStr


class ContactSubmission(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=5, max_length=4000)


class PreOrderItem(BaseModel):
    flavour: str  # 'salt-vinegar' | 'peanut-butter'
    pack: str     # '1' | '3' | '6'
    qty: int = Field(ge=1, le=99)

    @field_validator("flavour")
    @classmethod
    def _check_flavour(cls, v: str) -> str:
        if v not in {"salt-vinegar", "peanut-butter"}:
            raise ValueError("flavour must be 'salt-vinegar' or 'peanut-butter'")
        return v

    @field_validator("pack")
    @classmethod
    def _check_pack(cls, v: str) -> str:
        if v not in {"1", "3", "6"}:
            raise ValueError("pack must be '1', '3' or '6'")
        return v


class PreOrder(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    items: List[PreOrderItem] = Field(min_length=1)
    total_pouches: int = Field(ge=1)
    total_price: float = Field(ge=0)
    notes: Optional[str] = Field(default=None, max_length=500)


# ---------- Routes ----------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "krunchmate"}


@app.post("/api/subscribe")
async def subscribe(payload: Subscriber):
    doc = {
        "email": payload.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db().subscribers.insert_one(doc)
    return {"status": "subscribed", "email": payload.email}


@app.post("/api/contact")
async def contact(payload: ContactSubmission):
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db().contact_submissions.insert_one(doc)
    return {"status": "received", "id": str(result.inserted_id)}


@app.post("/api/preorder")
async def preorder(payload: PreOrder):
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["ship_wave"] = "second-week-october"
    result = await db().preorders.insert_one(doc)
    return {"status": "reserved", "id": str(result.inserted_id)}


@app.get("/api/admin/submissions")
async def submissions():
    """Manual smoke test: returns the last 20 rows of each collection."""
    async def tail(coll):
        cursor = db()[coll].find().sort("_id", -1).limit(20)
        return [
            {**d, "_id": str(d["_id"])}
            async for d in cursor
        ]

    return {
        "subscribers": await tail("subscribers"),
        "contact_submissions": await tail("contact_submissions"),
        "preorders": await tail("preorders"),
    }
