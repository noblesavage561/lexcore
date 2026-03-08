/**
 * Schema Grader
 * Validates agent output payloads against canonical JSON schemas.
 * CI gates — fails if any required field is missing.
 */

function gradeIntakeClassification(payload) {
  const required = ["thread_id", "channel", "domain", "urgency", "risk_level",
                    "requires_human_review", "key_entities", "extracted_deadlines",
                    "source_refs", "classified_at"];
  const missing = required.filter(f => !(f in payload));
  return {
    passed: missing.length === 0,
    missing_fields: missing,
    reason: missing.length > 0 ? `Missing fields: ${missing.join(", ")}` : "Schema valid",
  };
}

function gradeResearchBrief(payload) {
  const required = ["brief_id", "matter_id", "session_id", "domain", "query",
                    "findings", "statutes_cited", "cases_cited", "confidence_score",
                    "open_questions", "source_citations"];
  const missing = required.filter(f => !(f in payload));
  const confValid = typeof payload.confidence_score === "number"
    && payload.confidence_score >= 0
    && payload.confidence_score <= 1;
  return {
    passed: missing.length === 0 && confValid,
    missing_fields: missing,
    confidence_valid: confValid,
    reason: missing.length > 0
      ? `Missing fields: ${missing.join(", ")}`
      : !confValid ? "confidence_score must be 0–1"
      : "Schema valid",
  };
}

// Self-tests
const testIntake = {
  thread_id: "abc", channel: "portal", domain: "legal", urgency: "high",
  risk_level: "LOW", requires_human_review: false, key_entities: [],
  extracted_deadlines: [], source_refs: [], classified_at: new Date().toISOString(),
};
const intakeResult = gradeIntakeClassification(testIntake);
if (!intakeResult.passed) { console.error("Schema grader FAILED:", intakeResult); process.exit(1); }
console.log("✅ IntakeClassification schema grade passed");

const testBrief = {
  brief_id: "1", matter_id: "2", session_id: "3", domain: "legal", query: "test",
  findings: [], statutes_cited: [], cases_cited: [], confidence_score: 0.5,
  open_questions: [], source_citations: [],
};
const briefResult = gradeResearchBrief(testBrief);
if (!briefResult.passed) { console.error("Schema grader FAILED:", briefResult); process.exit(1); }
console.log("✅ ResearchBrief schema grade passed");

module.exports = { gradeIntakeClassification, gradeResearchBrief };
