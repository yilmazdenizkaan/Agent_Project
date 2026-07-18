import type { ModelProvider } from "./modelProvider";

export class MockModelProvider implements ModelProvider {
  private readonly responses: string[];

  constructor(response: string | string[] = "Mock model response.") {
    this.responses = Array.isArray(response) ? response : [response];
  }

  async generate(_input: Parameters<ModelProvider["generate"]>[0]): Promise<string> {
    return this.responses.shift() ?? "Mock model response.";
  }
}
