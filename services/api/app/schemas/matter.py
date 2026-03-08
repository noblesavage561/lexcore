from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class MatterCreate(BaseModel):
    title: str
    description: Optional[str] = None
    domain: str
    jurisdiction: Optional[str] = None


class MatterUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    next_action: Optional[str] = None


class MatterOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    domain: str
    jurisdiction: Optional[str]
    next_action: Optional[str]
    tenant_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
