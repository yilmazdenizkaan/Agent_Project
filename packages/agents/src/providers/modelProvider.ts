export interface ModelProvider {
  generate(input: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
  }): Promise<string>;
}
