from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class ResearchRequest(BaseModel):
    matter_id: str
    query: str
    domain: str
    jurisdiction_scope: str = "federal_florida"
    output_format: str = "research_brief"
    prompt_template: Optional[str] = None


class ResearchBriefOut(BaseModel):
    brief_id: str
    matter_id: str
    session_id: str
    domain: str
    query: str
    findings: List[dict]
    statutes_cited: List[dict]
    cases_cited: List[dict]
    confidence_score: float
    open_questions: List[str]
    source_citations: List[dict]
    next_steps: List[str]
    requires_human_review: bool
    created_at: datetime
