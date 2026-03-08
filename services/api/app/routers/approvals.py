"""Approval queue endpoints."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.approval import Approval, ApprovalStatus
from app.schemas.approval import ApprovalCreate, ApprovalDecision, ApprovalOut
from app.routers.deps import get_current_user, require_roles
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/", response_model=List[ApprovalOut])
async def list_approvals(
    status_filter: Optional[str] = Query(None, alias="status"),
    risk: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Approval).where(Approval.tenant_id == current_user.tenant_id)
    if status_filter:
        stmt = stmt.where(Approval.status == status_filter)
    if risk:
        stmt = stmt.where(Approval.risk_score == risk)
    result = await db.execute(stmt.order_by(Approval.created_at.desc()))
    return result.scalars().all()


@router.post("/", response_model=ApprovalOut, status_code=status.HTTP_201_CREATED)
async def create_approval(
    payload: ApprovalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    approval = Approval(
        **payload.model_dump(),
        tenant_id=current_user.tenant_id,
        requested_by=current_user.id,
        status=ApprovalStatus.PENDING,
    )
    db.add(approval)
    await db.flush()
    return approval


@router.post("/{approval_id}/decide", response_model=ApprovalOut)
async def decide_approval(
    approval_id: str,
    payload: ApprovalDecision,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF, UserRole.ADMIN])),
):
    result = await db.execute(
        select(Approval).where(Approval.id == approval_id, Approval.tenant_id == current_user.tenant_id)
    )
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Approval already resolved — immutable")

    approval.status = payload.decision
    approval.approver_id = current_user.id
    approval.approver_note = payload.note
    return approval
