import OpenAI from "openai";
import type { ModelProvider } from "./modelProvider";

export interface OpenAiCompatibleProviderOptions {
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export class OpenAiCompatibleProvider implements ModelProvider {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(options: OpenAiCompatibleProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://api.openai.com/v1";
    this.model = options.model;
  }

  getSafeMetadata() {
    return {
      baseUrl: this.baseUrl,
      model: this.model,
      hasApiKey: Boolean(this.apiKey),
    };
  }

  async generate(input: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAiCompatibleProvider requires an apiKey before generate() can be used.");
    }

    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
    });

    const completion = await client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: input.userPrompt },
      ],
      temperature: input.temperature ?? 0,
    });

    return completion.choices[0]?.message.content ?? "";
  }
}
