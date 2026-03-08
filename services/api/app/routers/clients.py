"""Client management endpoints (admin only)."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserOut
from app.routers.deps import require_roles

router = APIRouter()


@router.get("/", response_model=List[UserOut])
async def list_clients(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF, UserRole.ADMIN])),
):
    result = await db.execute(
        select(User).where(User.role.in_([UserRole.INDIVIDUAL, UserRole.BUSINESS_OWNER, UserRole.BUSINESS_USER]))
        .order_by(User.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{client_id}", response_model=UserOut)
async def get_client(
    client_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF, UserRole.ADMIN])),
):
    result = await db.execute(select(User).where(User.id == client_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Client not found")
    return user
