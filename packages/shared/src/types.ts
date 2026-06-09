export type Severity = "Low" | "Medium" | "High" | "Critical";
export type VerdictStatus = "Guilty" | "Not Guilty" | "Needs More Evidence";

export interface StaticFinding {
  id: string;
  file: string;
  lineStart: number;
  lineEnd: number;
  description: string;
  severity: Severity;
}

export interface AgentMessage {
  agent: "Clerk" | "Prosecutor" | "Defense" | "Expert Witness" | "Judge" | "Reporter";
  message: string;
  timestamp?: string;
}

export interface Verdict {
  status: VerdictStatus;
  reasoning: string;
  confidence: number;
}

export interface CourtCase {
  caseId: string;
  title: string;
  charge: string;
  file: string;
  lineStart: number;
  lineEnd: number;
  severity: Severity;
  evidence: string[];
  prosecutorArgument: string;
  defenseArgument: string;
  expertWitnessArgument: string;
  verdict: Verdict;
  recommendedFix: string;
}

export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  createdAt: string;
  cases: CourtCase[];
}
