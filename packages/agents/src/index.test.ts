import { describe, expect, it } from "vitest";
import {
  clerkPrompt,
  defensePrompt,
  expertWitnessPrompt,
  judgePrompt,
  judgeVerdict,
  LocalEvidenceProvider,
  MockModelProvider,
  OpenAiCompatibleProvider,
  prosecutorPrompt,
  reporterSummary,
  runCourtroomFlow,
  runExpertWitnessAgent
} from "./index";
import type { CourtCase, StaticFinding } from "@bugcourt-ai/shared";
import type { EvidenceItem } from "./evidence/evidenceProvider";

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

const evidenceItem: EvidenceItem = {
  id: "evidence-001",
  caseId: courtCase.caseId,
  filePath: "src/routes/admin.ts",
  lineStart: 42,
  lineEnd: 61,
  codeSnippet: "const userRole = request.body.role;",
  ruleId: "auth-bypass",
  summary: "The admin route reads role data from the request body.",
  remediation: "Use trusted token claims for authorization."
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

  it("MockModelProvider returns deterministic responses", async () => {
    const provider = new MockModelProvider(["first response", "second response"]);

    await expect(provider.generate({ systemPrompt: "system", userPrompt: "user" })).resolves.toBe("first response");
    await expect(provider.generate({ systemPrompt: "system", userPrompt: "user" })).resolves.toBe("second response");
    await expect(provider.generate({ systemPrompt: "system", userPrompt: "user" })).resolves.toBe("Mock model response.");
  });

  it("OpenAiCompatibleProvider does not require environment variables until generate is called", async () => {
    const provider = new OpenAiCompatibleProvider({ model: "later-configured-model" });

    await expect(provider.generate({ systemPrompt: "system", userPrompt: "user" })).rejects.toThrow("apiKey");
  });

  it("LocalEvidenceProvider retrieves evidence by case, file, rule id, and query text", async () => {
    const provider = new LocalEvidenceProvider([
      evidenceItem,
      {
        ...evidenceItem,
        id: "evidence-002",
        caseId: "CASE-OTHER",
        filePath: "src/routes/other.ts",
        ruleId: "other-rule"
      }
    ]);

    const byCaseAndFile = await provider.retrieve({
      caseId: courtCase.caseId,
      query: "request body",
      filePath: courtCase.file,
      lineStart: courtCase.lineStart,
      lineEnd: courtCase.lineEnd
    });
    expect(byCaseAndFile).toEqual([evidenceItem]);

    const byRuleId = await provider.retrieve({ query: "auth-bypass" });
    expect(byRuleId).toEqual([evidenceItem]);
  });

  it("runExpertWitnessAgent grounds its response in retrieved evidence refs", async () => {
    const evidenceProvider = new LocalEvidenceProvider([evidenceItem]);
    const modelProvider = new MockModelProvider("Evidence checked.");

    const output = await runExpertWitnessAgent({ courtCase, finding }, evidenceProvider, modelProvider);

    expect(output.role).toBe("Expert Witness");
    expect(output.evidenceRefs).toContain("src/routes/admin.ts:42-61");
    expect(output.message).toContain("src/routes/admin.ts:42-61");
    expect(output.message).not.toContain("src/unrelated.ts");
    expect(output.confidence).toBeGreaterThanOrEqual(0);
    expect(output.confidence).toBeLessThanOrEqual(1);
  });

  it("runExpertWitnessAgent safely asks for more evidence when none is found", async () => {
    const evidenceProvider = new LocalEvidenceProvider([]);

    const output = await runExpertWitnessAgent({ courtCase, finding }, evidenceProvider);

    expect(output.role).toBe("Expert Witness");
    expect(output.message).toContain("Needs More Evidence");
    expect(output.evidenceRefs).toEqual([]);
  });

  it("runCourtroomFlow returns the expected deterministic debate result", async () => {
    const evidenceProvider = new LocalEvidenceProvider([evidenceItem]);
    const modelProvider = new MockModelProvider([
      "Clerk opened the case.",
      "Prosecutor argues from visible evidence.",
      "Defense asks for surrounding middleware context.",
      "Expert reviewed retrieved evidence.",
      "Judge reviewed the arguments."
    ]);

    const result = await runCourtroomFlow({
      courtCase,
      finding,
      evidenceProvider,
      modelProvider
    });

    expect(result.caseId).toBe(courtCase.caseId);
    expect(result.messages.map((message) => message.role)).toEqual([
      "Clerk",
      "Prosecutor",
      "Defense",
      "Expert Witness",
      "Judge",
      "Reporter"
    ]);
    expect(result.verdict?.status).toBe("Guilty");
    expect(result.verdict?.confidence).toBeGreaterThanOrEqual(0);
    expect(result.verdict?.confidence).toBeLessThanOrEqual(1);
    expect(result.messages[3].evidenceRefs).toContain("src/routes/admin.ts:42-61");
    expect(result.reportMarkdown).toContain(`# ${courtCase.title}`);
    expect(result.reportMarkdown).toContain(`**Severity:** ${courtCase.severity}`);
    expect(result.reportMarkdown).toContain(`**Verdict:** ${result.verdict?.status}`);
    expect(result.reportMarkdown).toContain(`- ${courtCase.evidence[0]}`);
    expect(result.reportMarkdown).toContain(`**Recommended Fix:** ${courtCase.recommendedFix}`);
  });
});
