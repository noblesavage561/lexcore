"""Research service — orchestrates AI research requests."""
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.research import ResearchRequest, ResearchBriefOut


class ResearchService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def initiate_research(
        self,
        request: ResearchRequest,
        session_id: str,
        tenant_id: str,
        user_id: str,
    ) -> ResearchBriefOut:
        """Initiate a research request — dispatches to orchestrator/LangGraph."""
        # Phase 1: Return structured stub — full AI integration in Phase 2
        brief_id = str(uuid.uuid4())
        return ResearchBriefOut(
            brief_id=brief_id,
            matter_id=request.matter_id,
            session_id=session_id,
            domain=request.domain,
            query=request.query,
            findings=[],
            statutes_cited=[],
            cases_cited=[],
            confidence_score=0.0,
            open_questions=["Research in progress — results will appear when complete."],
            source_citations=[],
            next_steps=["Await agent completion", "Review findings in matter dashboard"],
            requires_human_review=True,
            created_at=datetime.now(timezone.utc),
        )
