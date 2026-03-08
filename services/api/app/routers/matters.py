"""Matter management endpoints."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.matter import Matter
from app.schemas.matter import MatterCreate, MatterUpdate, MatterOut
from app.routers.deps import get_current_user, require_roles
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/", response_model=List[MatterOut])
async def list_matters(
    status: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Matter).where(Matter.tenant_id == current_user.tenant_id)
    if current_user.role not in (UserRole.STAFF, UserRole.ADMIN):
        stmt = stmt.where(Matter.owner_id == current_user.id)
    if status:
        stmt = stmt.where(Matter.status == status)
    if domain:
        stmt = stmt.where(Matter.domain == domain)
    result = await db.execute(stmt.order_by(Matter.updated_at.desc()))
    return result.scalars().all()


@router.post("/", response_model=MatterOut, status_code=status.HTTP_201_CREATED)
async def create_matter(
    payload: MatterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    matter = Matter(
        **payload.model_dump(),
        tenant_id=current_user.tenant_id,
        owner_id=current_user.id,
    )
    db.add(matter)
    await db.flush()
    return matter


@router.get("/{matter_id}", response_model=MatterOut)
async def get_matter(
    matter_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Matter).where(Matter.id == matter_id, Matter.tenant_id == current_user.tenant_id)
    )
    matter = result.scalar_one_or_none()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    return matter


@router.patch("/{matter_id}", response_model=MatterOut)
async def update_matter(
    matter_id: str,
    payload: MatterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Matter).where(Matter.id == matter_id, Matter.tenant_id == current_user.tenant_id)
    )
    matter = result.scalar_one_or_none()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(matter, field, value)
    return matter
