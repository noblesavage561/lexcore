"""
Agent 1 — Intake Classifier
Email/webhook ingestion, thread normalization, risk scoring, domain routing.
Output: IntakeClassification JSON. Gate: none.
"""
import uuid
from datetime import datetime, timezone
from typing import Any


class IntakeClassifierAgent:
    agent_id = "agent_1"
    gate = "none"

    def classify(self, content: str, channel: str = "portal", client_id: str | None = None) -> dict[str, Any]:
        """
        Classify inbound content and produce an IntakeClassification JSON.
        Phase 1: rule-based stub — Phase 2 adds Claude-powered classification.
        """
        domain = self._infer_domain(content)
        risk = self._score_risk(content, domain)
        return {
            "thread_id": str(uuid.uuid4()),
            "channel": channel,
            "domain": domain,
            "urgency": "medium",
            "risk_level": risk,
            "requires_human_review": risk == "HIGH",
            "key_entities": [],
            "extracted_deadlines": [],
            "source_refs": [],
            "client_id": client_id,
            "classified_at": datetime.now(timezone.utc).isoformat(),
        }

    def _infer_domain(self, content: str) -> str:
        content_lower = content.lower()
        if any(k in content_lower for k in ("tax", "irs", "income", "withholding", "treaty")): return "tax"
        if any(k in content_lower for k in ("property", "deed", "zoning", "title", "lien")): return "real_estate"
        if any(k in content_lower for k in ("credit", "fcra", "fdcpa", "dispute", "bureau")): return "consumer_credit"
        if any(k in content_lower for k in ("bill", "congress", "legislature", "regulation")): return "political"
        if any(k in content_lower for k in ("genealogy", "heritage", "ancestry", "census")): return "heritage"
        if any(k in content_lower for k in ("contract", "compliance", "entity", "corporate")): return "business"
        return "legal"

    def _score_risk(self, content: str, domain: str) -> str:
        content_lower = content.lower()
        if any(k in content_lower for k in ("file", "filing", "submit", "payment", "irs")): return "HIGH"
        if any(k in content_lower for k in ("email", "send", "communicate")): return "MEDIUM"
        return "LOW"
