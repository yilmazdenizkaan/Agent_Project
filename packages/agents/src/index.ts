import { CourtCase, Verdict, StaticFinding } from "@bugcourt-ai/shared";

export function clerkPrompt(finding: StaticFinding) {
  return `Clerk: Review the finding and present the case with the supporting file, line range, and evidence. Ensure the case is grounded in the visible code evidence only.`;
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

export function judgePrompt(courtCase: CourtCase) {
  return `Judge: Render a verdict from the available evidence and provide a confidence score between 0 and 1. Verdicts must be one of Guilty, Not Guilty, or Needs More Evidence.`;
}

export function reporterPrompt(courtCase: CourtCase, verdict: Verdict) {
  return `Reporter: Summarize the courtroom findings, evidence, and final verdict in a concise report.`;
}

export const agentRules = [
  "Do not invent vulnerabilities without evidence.",
  "Ground every argument in static findings or visible code evidence.",
  "Do not execute imported code or rely on runtime behavior.",
  "Keep the debate focused on the Case, evidence list, and severity.",
];
