"""Audit log endpoints — read-only."""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.audit import AuditEvent
from app.routers.deps import require_roles
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/")
async def list_audit_events(
    matter_id: Optional[str] = Query(None),
    agent_id: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF, UserRole.ADMIN])),
):
    stmt = select(AuditEvent).where(AuditEvent.tenant_id == current_user.tenant_id)
    if matter_id:
        stmt = stmt.where(AuditEvent.matter_id == matter_id)
    if agent_id:
        stmt = stmt.where(AuditEvent.agent_id == agent_id)
    stmt = stmt.order_by(AuditEvent.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    events = result.scalars().all()
    return {"events": events, "total": len(events)}
