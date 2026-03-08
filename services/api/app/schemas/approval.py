from typing import Optional, Any, List
from datetime import datetime
from pydantic import BaseModel


class ApprovalCreate(BaseModel):
    matter_id: str
    scope: str
    action_summary: str
    risk_score: str = "MEDIUM"
    proposed_action: dict
    artifacts: List[dict] = []


class ApprovalDecision(BaseModel):
    decision: str  # approved | denied | returned
    note: Optional[str] = None


class ApprovalOut(BaseModel):
    id: str
    matter_id: str
    tenant_id: str
    scope: str
    action_summary: str
    risk_score: str
    proposed_action: dict
    artifacts: list
    status: str
    approver_id: Optional[str]
    approver_note: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
