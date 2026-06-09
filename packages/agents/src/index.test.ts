import { describe, expect, it } from "vitest";
import {
  clerkPrompt,
  defensePrompt,
  expertWitnessPrompt,
  judgePrompt,
  judgeVerdict,
  prosecutorPrompt,
  reporterSummary
} from "./index";
import type { CourtCase, StaticFinding } from "@bugcourt-ai/shared";

const finding: StaticFinding = {
  id: "FINDING-001",
  file: "src/routes/admin.ts",
  lineStart: 42,
  lineEnd: 61,
  description: "Admin route may bypass trusted authentication.",
  severity: "High"
};

const courtCase: CourtCase = {
  caseId: "CASE-001",
  title: "Possible Authentication Bypass",
  charge: "Admin route may be reachable without trusted authentication.",
  file: "src/routes/admin.ts",
  lineStart: 42,
  lineEnd: 61,
  severity: "High",
  evidence: [
    "Admin route does not call authMiddleware directly.",
    "User role is read from request body."
  ],
  prosecutorArgument: "The route is risky because authorization appears to rely on user-controlled input.",
  defenseArgument: "More route-level or global middleware context may be needed to determine the true security posture.",
  expertWitnessArgument: "No direct auth middleware is visible in the shown route context.",
  verdict: {
    status: "Guilty",
    reasoning: "The evidence supports a high-risk authentication bypass due to direct role validation from request body.",
    confidence: 0.87
  },
  recommendedFix: "Apply authMiddleware and validate the role from trusted token claims instead of request body."
};

describe("agents package", () => {
  it("clerkPrompt returns a non-empty Clerk message grounded in the finding", () => {
    const message = clerkPrompt(finding);
    expect(message).toContain("Clerk");
    expect(message).toContain(finding.file);
    expect(message).toContain("visible code evidence");
  });

  it("prosecutorPrompt returns a non-empty Prosecutor message grounded in the case", () => {
    const message = prosecutorPrompt(courtCase);
    expect(message).toContain("Prosecutor");
    expect(message).toContain(courtCase.file);
    expect(message).toContain(`${courtCase.lineStart}-${courtCase.lineEnd}`);
  });

  it("defensePrompt returns a non-empty Defense message", () => {
    const message = defensePrompt(courtCase);
    expect(message).toContain("Defense");
    expect(message).toContain("grounded in the visible finding");
  });

  it("expertWitnessPrompt returns a non-empty Expert Witness message", () => {
    const message = expertWitnessPrompt(courtCase);
    expect(message).toContain("Expert Witness");
    expect(message).toContain("visible code supports the claim");
  });

  it("judgePrompt returns a prompt requesting a valid verdict", () => {
    const message = judgePrompt(courtCase);
    expect(message).toContain("Judge");
    expect(message).toContain("Guilty, Not Guilty, or Needs More Evidence");
  });

  it("judgeVerdict returns a valid verdict and acceptable confidence", () => {
    const verdict = judgeVerdict(courtCase);
    expect(["Guilty", "Not Guilty", "Needs More Evidence"]).toContain(verdict.status);
    expect(verdict.confidence).toBeGreaterThanOrEqual(0);
    expect(verdict.confidence).toBeLessThanOrEqual(1);
    expect(verdict.reasoning).toContain(courtCase.file);
  });

  it("reporterSummary returns markdown with the title, severity, verdict, evidence, and recommended fix", () => {
    const verdict = judgeVerdict(courtCase);
    const markdown = reporterSummary(courtCase, verdict);

    expect(markdown).toContain(`# ${courtCase.title}`);
    expect(markdown).toContain(`**Severity:** ${courtCase.severity}`);
    expect(markdown).toContain(`**Verdict:** ${verdict.status}`);
    expect(markdown).toContain(`- ${courtCase.evidence[0]}`);
    expect(markdown).toContain(`**Recommended Fix:** ${courtCase.recommendedFix}`);
  });
});
