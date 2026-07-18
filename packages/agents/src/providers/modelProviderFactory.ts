import type { ModelSettings, SafeModelSettings } from "@bugcourt-ai/shared";
import type { ModelProvider } from "./modelProvider";
import { MockModelProvider } from "./mockModelProvider";
import { OpenAiCompatibleProvider } from "./openAiCompatibleProvider";

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434/v1";

function trimOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function toSafeModelSettings(settings: ModelSettings): SafeModelSettings {
  return {
    provider: settings.provider,
    model: settings.model,
    baseUrl: trimOptional(settings.baseUrl),
    temperature: settings.temperature,
    hasApiKey: Boolean(trimOptional(settings.apiKey)),
  };
}

export function createModelProvider(settings: ModelSettings): ModelProvider {
  const model = trimOptional(settings.model) ?? "mock-courtroom-model";
  const apiKey = trimOptional(settings.apiKey);
  const baseUrl = trimOptional(settings.baseUrl);

  switch (settings.provider) {
    case "mock":
      return new MockModelProvider();
    case "openai":
      return new OpenAiCompatibleProvider({
        apiKey,
        baseUrl: baseUrl ?? DEFAULT_OPENAI_BASE_URL,
        model,
      });
    case "groq":
      return new OpenAiCompatibleProvider({
        apiKey,
        baseUrl: baseUrl ?? DEFAULT_GROQ_BASE_URL,
        model,
      });
    case "ollama":
      return new OpenAiCompatibleProvider({
        apiKey: apiKey ?? "ollama",
        baseUrl: baseUrl ?? DEFAULT_OLLAMA_BASE_URL,
        model,
      });
    case "custom":
      return baseUrl
        ? new OpenAiCompatibleProvider({ apiKey, baseUrl, model })
        : new MockModelProvider();
    default:
      return new MockModelProvider();
  }
}
