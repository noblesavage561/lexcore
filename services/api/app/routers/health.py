"""Health check endpoints."""
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "lexcore-api", "timestamp": datetime.now(timezone.utc).isoformat()}


@router.get("/health/ready")
async def readiness_check():
    return {"status": "ready"}
