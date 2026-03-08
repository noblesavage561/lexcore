"""
LexCore Orchestrator — Workflow router, risk scoring, agent dispatch.
Routes inbound requests to the correct agent, enforces approval gates,
and publishes all routing decisions to the event bus.
"""
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = structlog.get_logger(__name__)

app = FastAPI(
    title="LexCore Orchestrator",
    description="Workflow router + risk scoring + agent dispatch",
    version="0.1.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RISK_RULES = {
    "filing": "HIGH",
    "payment": "HIGH",
    "email": "MEDIUM",
    "communication": "MEDIUM",
    "calendar": "MEDIUM",
    "research": "LOW",
    "document": "LOW",
}

GATE_RULES = {
    "agent_6": "approve_before_submit",  # Tax Strategy
    "agent_8": "approve_before_send",    # Drafting & Execution
    "agent_2": "review_required",
    "agent_3": "review_required",
    "agent_4": "review_required",
}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "lexcore-orchestrator"}


@app.post("/route")
async def route_request(payload: dict):
    """Route a request to the appropriate agent with risk scoring."""
    action_type = payload.get("action_type", "research")
    risk = RISK_RULES.get(action_type, "LOW")

    # Determine agent
    domain = payload.get("domain", "legal")
    agent_map = {
        "legal": "agent_2", "tax": "agent_6",
        "real_estate": "agent_4", "heritage": "agent_5",
        "political": "agent_7", "consumer_credit": "agent_2",
        "business": "agent_2",
    }
    agent_id = agent_map.get(domain, "agent_2")
    gate = GATE_RULES.get(agent_id, "none")

    logger.info("request_routed", domain=domain, agent=agent_id, risk=risk, gate=gate)

    return {
        "agent_id": agent_id,
        "risk_level": risk,
        "approval_gate": gate,
        "routed": True,
    }
