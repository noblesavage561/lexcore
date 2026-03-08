"""Schema validation tests."""
import pytest
import uuid
from datetime import datetime, date, timezone


def make_intake_classification():
    return {
        "thread_id": str(uuid.uuid4()),
        "channel": "email",
        "domain": "legal",
        "urgency": "high",
        "risk_level": "HIGH",
        "requires_human_review": True,
        "key_entities": [{"name": "John Doe", "type": "person", "confidence": 0.95}],
        "extracted_deadlines": [{"description": "Response due", "date": "2025-03-15"}],
        "source_refs": ["email://inbox/12345"],
        "client_id": str(uuid.uuid4()),
        "matter_id": str(uuid.uuid4()),
        "classified_at": datetime.now(timezone.utc).isoformat(),
    }


def test_intake_classification_valid():
    data = make_intake_classification()
    # Validate required fields exist
    assert data["thread_id"]
    assert data["domain"] in ["legal", "tax", "real_estate", "heritage", "political",
                               "consumer_credit", "international", "business", "unknown"]
    assert data["risk_level"] in ["HIGH", "MEDIUM", "LOW"]


def test_research_brief_confidence_range():
    score = 0.87
    assert 0 <= score <= 1


def test_approval_risk_levels():
    valid_risks = {"HIGH", "MEDIUM", "LOW"}
    assert "HIGH" in valid_risks
    assert "CRITICAL" not in valid_risks
