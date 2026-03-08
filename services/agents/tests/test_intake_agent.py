"""Tests for Intake Classifier Agent."""
import pytest
from intake.agent import IntakeClassifierAgent


def test_domain_inference_tax():
    agent = IntakeClassifierAgent()
    result = agent.classify("I need help with IRS withholding requirements")
    assert result["domain"] == "tax"


def test_domain_inference_real_estate():
    agent = IntakeClassifierAgent()
    result = agent.classify("I need a chain of title analysis for my property deed")
    assert result["domain"] == "real_estate"


def test_domain_inference_consumer_credit():
    agent = IntakeClassifierAgent()
    result = agent.classify("I want to dispute an item on my credit bureau report under FCRA")
    assert result["domain"] == "consumer_credit"


def test_risk_scoring_high():
    agent = IntakeClassifierAgent()
    result = agent.classify("I need to file documents with the IRS")
    assert result["risk_level"] == "HIGH"


def test_risk_scoring_low():
    agent = IntakeClassifierAgent()
    result = agent.classify("Research the history of the 14th amendment")
    assert result["risk_level"] == "LOW"


def test_output_schema_fields():
    agent = IntakeClassifierAgent()
    result = agent.classify("Legal research needed", channel="portal")
    required_fields = ["thread_id", "channel", "domain", "urgency", "risk_level",
                       "requires_human_review", "key_entities", "extracted_deadlines",
                       "source_refs", "classified_at"]
    for field in required_fields:
        assert field in result, f"Missing required field: {field}"


def test_high_risk_requires_review():
    agent = IntakeClassifierAgent()
    result = agent.classify("Submit tax filing payment to IRS")
    assert result["requires_human_review"] is True
