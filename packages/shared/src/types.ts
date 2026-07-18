export type Severity = "Low" | "Medium" | "High" | "Critical";
export type VerdictStatus = "Guilty" | "Not Guilty" | "Needs More Evidence";
export type ModelProviderType = "mock" | "openai" | "groq" | "ollama" | "custom";
export type AgentRole =
  | "Clerk"
  | "Prosecutor"
  | "Defense"
  | "Expert Witness"
  | "Judge"
  | "Reporter";

export interface StaticFinding {
  id: string;
  file: string;
  lineStart: number;
  lineEnd: number;
  description: string;
  severity: Severity;
}

export interface ModelSettings {
  provider: ModelProviderType;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
}

export interface SafeModelSettings {
  provider: ModelProviderType;
  model: string;
  baseUrl?: string;
  temperature?: number;
  hasApiKey: boolean;
}

export interface AgentMessage {
  agent: AgentRole;
  message: string;
  timestamp?: string;
}

export interface AgentOutput {
  role: AgentRole;
  message: string;
  evidenceRefs?: string[];
  confidence?: number;
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

export interface DebateResult {
  caseId: string;
  messages: AgentOutput[];
  verdict?: Verdict;
  reportMarkdown?: string;
}

export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  createdAt: string;
  cases: CourtCase[];
}
