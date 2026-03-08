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

    # Domain keyword mappings — ordered by specificity (most specific first)
    DOMAIN_KEYWORDS: dict[str, tuple[str, ...]] = {
        "tax":            ("tax", "irs", "income", "withholding", "treaty", "irc", "revenue"),
        "real_estate":    ("property", "deed", "zoning", "title", "lien", "mortgage", "parcel", "apn"),
        "consumer_credit":("credit", "fcra", "fdcpa", "dispute", "bureau", "collection", "tila", "ecoa"),
        "political":      ("bill", "congress", "legislature", "regulation", "rulemaking", "lobbying"),
        "heritage":       ("genealogy", "heritage", "ancestry", "census", "probate", "yamasee", "indigenous"),
        "business":       ("contract", "compliance", "entity", "corporate", "vendor", "due diligence"),
        "international":  ("treaty", "import", "export", "sanctions", "ofac", "beps", "vat", "gst"),
    }

    # High-risk action keywords — any of these escalate to HIGH
    HIGH_RISK_KEYWORDS: tuple[str, ...] = ("file", "filing", "submit", "payment", "irs", "court")
    MEDIUM_RISK_KEYWORDS: tuple[str, ...] = ("email", "send", "communicate", "notify", "letter")

    def classify(self, content: str, channel: str = "portal", client_id: str | None = None) -> dict[str, Any]:
        """
        Classify inbound content and produce an IntakeClassification JSON.
        Phase 1: rule-based classifier — Phase 2 adds Claude-powered classification.
        """
        domain = self._infer_domain(content)
        risk = self._score_risk(content)
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
        for domain, keywords in self.DOMAIN_KEYWORDS.items():
            if any(k in content_lower for k in keywords):
                return domain
        return "legal"

    def _score_risk(self, content: str) -> str:
        content_lower = content.lower()
        if any(k in content_lower for k in self.HIGH_RISK_KEYWORDS):
            return "HIGH"
        if any(k in content_lower for k in self.MEDIUM_RISK_KEYWORDS):
            return "MEDIUM"
        return "LOW"
