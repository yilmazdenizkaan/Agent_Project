import type { EvidenceItem, EvidenceProvider } from "./evidenceProvider";

export class LocalEvidenceProvider implements EvidenceProvider {
  constructor(private readonly evidenceItems: EvidenceItem[]) {}

  async retrieve(input: {
    caseId?: string;
    query: string;
    filePath?: string;
    lineStart?: number;
    lineEnd?: number;
  }): Promise<EvidenceItem[]> {
    const queryTokens = input.query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return this.evidenceItems.filter((item) => {
      if (input.caseId && item.caseId !== input.caseId) {
        return false;
      }

      if (input.filePath && item.filePath !== input.filePath) {
        return false;
      }

      if (input.lineStart !== undefined && item.lineEnd < input.lineStart) {
        return false;
      }

      if (input.lineEnd !== undefined && item.lineStart > input.lineEnd) {
        return false;
      }

      if (queryTokens.length === 0) {
        return true;
      }

      const searchableText = [
        item.id,
        item.caseId,
        item.filePath,
        item.ruleId,
        item.summary,
        item.remediation,
        item.codeSnippet,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return queryTokens.some((token) => searchableText.includes(token));
    });
  }
}
