/**
 * Citation Grader
 * Validates that research brief outputs include required citation fields.
 * CI blocks merges when citation coverage drops below threshold.
 */

const CITATION_THRESHOLD = 0.8; // 80% of findings must have citations

function gradeCitations(researchBrief) {
  const findings = researchBrief.findings || [];
  if (findings.length === 0) return { score: 0, passed: false, reason: "No findings" };

  const withCitations = findings.filter(f => f.citations && f.citations.length > 0);
  const score = withCitations.length / findings.length;

  return {
    score,
    passed: score >= CITATION_THRESHOLD,
    coverage: `${withCitations.length}/${findings.length}`,
    reason: score < CITATION_THRESHOLD
      ? `Citation coverage ${(score * 100).toFixed(0)}% below threshold ${(CITATION_THRESHOLD * 100).toFixed(0)}%`
      : "Citation coverage sufficient",
  };
}

function gradeSourceDiversity(researchBrief) {
  const citations = researchBrief.source_citations || [];
  const uniqueSources = new Set(citations.map(c => c.source)).size;
  return {
    unique_sources: uniqueSources,
    passed: uniqueSources >= 2 || researchBrief.confidence_score === 0,
    reason: uniqueSources < 2 ? "Insufficient source diversity" : "Source diversity acceptable",
  };
}

// Self-test
const testBrief = {
  findings: [
    { finding_id: "1", summary: "Test", citations: ["26 U.S.C. § 61"], confidence: 0.9 },
    { finding_id: "2", summary: "Test 2", citations: [], confidence: 0.0 },
  ],
  source_citations: [
    { source: "U.S. Code", retrieved_at: "2025-01-01T00:00:00Z" },
    { source: "CFR", retrieved_at: "2025-01-01T00:00:00Z" },
  ],
  confidence_score: 0.5,
};

const result = gradeCitations(testBrief);
console.log("Citation grader result:", result);
// 1/2 = 0.5, below 0.8 threshold — expected fail
if (result.score !== 0.5) {
  console.error("Citation grader self-test FAILED");
  process.exit(1);
}
console.log("✅ Citation grader self-test passed");
module.exports = { gradeCitations, gradeSourceDiversity };
