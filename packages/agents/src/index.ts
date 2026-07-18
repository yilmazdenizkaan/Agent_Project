import { AgentOutput, CourtCase, Verdict, StaticFinding } from "@bugcourt-ai/shared";
import type { EvidenceProvider } from "./evidence/evidenceProvider";
import type { ModelProvider } from "./providers/modelProvider";

export * from "./evidence/evidenceProvider";
export * from "./evidence/localEvidenceProvider";
export * from "./providers/modelProvider";
export * from "./providers/mockModelProvider";
export * from "./providers/openAiCompatibleProvider";
export * from "./providers/modelProviderFactory";

export function clerkPrompt(finding: StaticFinding) {
  return `Clerk: Review the finding at ${finding.file}:${finding.lineStart}-${finding.lineEnd} and present the case with the supporting file, line range, and evidence. Ensure the case is grounded in the visible code evidence only.`;
}

export function prosecutorPrompt(courtCase: CourtCase) {
  return `Prosecutor: Build an argument based on the evidence in ${courtCase.file}:${courtCase.lineStart}-${courtCase.lineEnd}. Focus on the risk shown by the visible code.`;
}

export function defensePrompt(courtCase: CourtCase) {
  return `Defense: Offer a counterpoint that asks for more context or explains why the evidence may not prove a vulnerability on its own. Stay grounded in the visible finding.`;
}

export function expertWitnessPrompt(courtCase: CourtCase) {
  return `Expert Witness: Evaluate the case facts and point out whether the visible code supports the claim. Do not invent additional code paths or capabilities.`;
}

export async function runExpertWitnessAgent(
  input: {
    courtCase: CourtCase;
    finding?: StaticFinding;
  },
  evidenceProvider: EvidenceProvider,
  modelProvider?: ModelProvider
): Promise<AgentOutput> {
  const { courtCase, finding } = input;
  const evidence = await evidenceProvider.retrieve({
    caseId: courtCase.caseId,
    query: finding?.description ?? courtCase.charge,
    filePath: courtCase.file,
    lineStart: courtCase.lineStart,
    lineEnd: courtCase.lineEnd,
  });

  if (evidence.length === 0) {
    return {
      role: "Expert Witness",
      message: `Needs More Evidence: No local evidence was found for ${courtCase.file}:${courtCase.lineStart}-${courtCase.lineEnd}.`,
      evidenceRefs: [],
      confidence: 0.2,
    };
  }

  const evidenceRefs = evidence.map(
    (item) => `${item.filePath}:${item.lineStart}-${item.lineEnd}`
  );
  const evidenceSummary = evidence
    .map((item) => `${item.summary} (${item.filePath}:${item.lineStart}-${item.lineEnd})`)
    .join(" ");

  const modelText = modelProvider
    ? await modelProvider.generate({
        systemPrompt: "You are the Expert Witness. Stay grounded in retrieved local evidence only.",
        userPrompt: `${expertWitnessPrompt(courtCase)} Evidence: ${evidenceSummary}`,
        temperature: 0,
      })
    : "";

  const modelNote = modelText ? ` Model note: ${modelText}` : "";

  return {
    role: "Expert Witness",
    message: `The retrieved local evidence supports review of ${courtCase.file}:${courtCase.lineStart}-${courtCase.lineEnd}. ${evidenceSummary}${modelNote}`,
    evidenceRefs,
    confidence: 0.8,
  };
}

export function judgePrompt(courtCase: CourtCase) {
  return `Judge: Render a verdict from the available evidence and provide a confidence score between 0 and 1. Verdicts must be one of Guilty, Not Guilty, or Needs More Evidence.`;
}

export function judgeVerdict(courtCase: CourtCase): Verdict {
  return {
    status: courtCase.verdict.status,
    reasoning: `Based on evidence from ${courtCase.file}:${courtCase.lineStart}-${courtCase.lineEnd}, the case summary supports ${courtCase.verdict.status.toLowerCase()}.`, 
    confidence: Math.min(1, Math.max(0, courtCase.verdict.confidence))
  };
}

export function reporterSummary(courtCase: CourtCase, verdict: Verdict): string {
  return `# ${courtCase.title}

**Severity:** ${courtCase.severity}

**Verdict:** ${verdict.status}

**Confidence:** ${verdict.confidence}

**Evidence:**
${courtCase.evidence.map((item) => `- ${item}`).join("\n")}

**Recommended Fix:** ${courtCase.recommendedFix}`;
}

export const agentRules = [
  "Do not invent vulnerabilities without evidence.",
  "Ground every argument in static findings or visible code evidence.",
  "Do not execute imported code or rely on runtime behavior.",
  "Keep the debate focused on the Case, evidence list, and severity.",
];

export * from "./orchestrator";
