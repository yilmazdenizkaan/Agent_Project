import { NextResponse } from "next/server";
import { createModelProvider, toSafeModelSettings } from "@bugcourt-ai/agents";
import type { ModelProviderType, ModelSettings } from "@bugcourt-ai/shared";

const providerTypes: ModelProviderType[] = ["mock", "openai", "groq", "ollama", "custom"];

function isModelProviderType(value: unknown): value is ModelProviderType {
  return typeof value === "string" && providerTypes.includes(value as ModelProviderType);
}

function readModelSettings(input: unknown): ModelSettings | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }

  const rawSettings = input as Partial<ModelSettings>;
  if (!isModelProviderType(rawSettings.provider) || typeof rawSettings.model !== "string") {
    return undefined;
  }

  return {
    provider: rawSettings.provider,
    model: rawSettings.model,
    apiKey: typeof rawSettings.apiKey === "string" ? rawSettings.apiKey : undefined,
    baseUrl: typeof rawSettings.baseUrl === "string" ? rawSettings.baseUrl : undefined,
    temperature: typeof rawSettings.temperature === "number" ? rawSettings.temperature : undefined,
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const settings = readModelSettings(body);

  if (!settings) {
    return NextResponse.json(
      { success: false, message: "Invalid model settings." },
      { status: 400 }
    );
  }

  const safeSettings = toSafeModelSettings(settings);
  const provider = createModelProvider(settings);

  if (settings.provider === "mock") {
    return NextResponse.json({
      success: true,
      message: "Mock provider is ready.",
      settings: safeSettings,
    });
  }

  try {
    await provider.generate({
      systemPrompt: "You are BugCourt AI. Reply with a short connection check.",
      userPrompt: "Return only: BugCourt model provider connected.",
      temperature: settings.temperature ?? 0.2,
    });

    return NextResponse.json({
      success: true,
      message: "Model provider responded.",
      settings: safeSettings,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Model provider test failed. Check provider settings.",
        settings: safeSettings,
      },
      { status: 400 }
    );
  }
}
