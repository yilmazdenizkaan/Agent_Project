import type { DebateResult, CourtCase, StaticFinding, AgentOutput } from "@bugcourt-ai/shared";
import type { EvidenceProvider } from "./evidence/evidenceProvider";
import type { ModelProvider } from "./providers/modelProvider";
import {
  clerkPrompt,
  defensePrompt,
  judgePrompt,
  judgeVerdict,
  prosecutorPrompt,
  reporterSummary,
  runExpertWitnessAgent,
} from "./index";

async function runPromptAgent(input: {
  role: AgentOutput["role"];
  prompt: string;
  modelProvider: ModelProvider;
  fallbackMessage: string;
  confidence?: number;
}): Promise<AgentOutput> {
  const message = await input.modelProvider.generate({
    systemPrompt: `You are the ${input.role} in BugCourt AI. Stay grounded in the supplied case.`,
    userPrompt: input.prompt,
    temperature: 0,
  });

  return {
    role: input.role,
    message: message || input.fallbackMessage,
    confidence: input.confidence,
  };
}

export async function runCourtroomFlow(input: {
  courtCase: CourtCase;
  finding: StaticFinding;
  evidenceProvider: EvidenceProvider;
  modelProvider: ModelProvider;
}): Promise<DebateResult> {
  const { courtCase, finding, evidenceProvider, modelProvider } = input;

  const clerk = await runPromptAgent({
    role: "Clerk",
    prompt: clerkPrompt(finding),
    modelProvider,
    fallbackMessage: `Clerk opened ${courtCase.caseId} for ${courtCase.file}:${courtCase.lineStart}-${courtCase.lineEnd}.`,
  });

  const prosecutor = await runPromptAgent({
    role: "Prosecutor",
    prompt: prosecutorPrompt(courtCase),
    modelProvider,
    fallbackMessage: courtCase.prosecutorArgument,
  });

  const defense = await runPromptAgent({
    role: "Defense",
    prompt: defensePrompt(courtCase),
    modelProvider,
    fallbackMessage: courtCase.defenseArgument,
  });

  const expertWitness = await runExpertWitnessAgent(
    { courtCase, finding },
    evidenceProvider,
    modelProvider
  );

  const judgePromptMessage = await runPromptAgent({
    role: "Judge",
    prompt: judgePrompt(courtCase),
    modelProvider,
    fallbackMessage: courtCase.verdict.reasoning,
  });
  const verdict = judgeVerdict(courtCase);
  const judge: AgentOutput = {
    ...judgePromptMessage,
    message: `${judgePromptMessage.message} Verdict: ${verdict.status}. ${verdict.reasoning}`,
    confidence: verdict.confidence,
  };

  const reportMarkdown = reporterSummary(courtCase, verdict);
  const reporter: AgentOutput = {
    role: "Reporter",
    message: reportMarkdown,
    evidenceRefs: expertWitness.evidenceRefs,
  };

  return {
    caseId: courtCase.caseId,
    messages: [clerk, prosecutor, defense, expertWitness, judge, reporter],
    verdict,
    reportMarkdown,
  };
}
