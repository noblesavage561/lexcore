"""Agent status and registry endpoints."""
from fastapi import APIRouter, Depends
from app.routers.deps import require_roles
from app.models.user import User, UserRole

router = APIRouter()

AGENT_REGISTRY = [
    {"id": "agent_1", "name": "Intake Classifier", "domain": "intake", "gate": "none", "status": "active"},
    {"id": "agent_2", "name": "Legal Research", "domain": "legal", "gate": "review_required", "status": "active"},
    {"id": "agent_3", "name": "Document Intelligence", "domain": "documents", "gate": "review_required", "status": "active"},
    {"id": "agent_4", "name": "Real Estate Analyst", "domain": "real_estate", "gate": "review_required", "status": "active"},
    {"id": "agent_5", "name": "Heritage Research", "domain": "heritage", "gate": "none", "status": "active"},
    {"id": "agent_6", "name": "Tax Strategy", "domain": "tax", "gate": "approve_before_submit", "status": "active"},
    {"id": "agent_7", "name": "Political Intelligence", "domain": "political", "gate": "none", "status": "active"},
    {"id": "agent_8", "name": "Drafting & Execution", "domain": "drafting", "gate": "approve_before_send", "status": "active"},
]


@router.get("/")
async def list_agents(
    current_user: User = Depends(require_roles([UserRole.STAFF, UserRole.ADMIN])),
):
    return {"agents": AGENT_REGISTRY, "total": len(AGENT_REGISTRY)}
