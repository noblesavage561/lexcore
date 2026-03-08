"""Research endpoints — triggers AI research agents."""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.research import ResearchRequest, ResearchBriefOut
from app.routers.deps import get_current_user
from app.models.user import User
from app.services.research_service import ResearchService

router = APIRouter()


@router.post("/", response_model=ResearchBriefOut, status_code=202)
async def submit_research(
    payload: ResearchRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session_id = str(uuid.uuid4())
    service = ResearchService(db)
    brief = await service.initiate_research(
        request=payload,
        session_id=session_id,
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
    )
    return brief
