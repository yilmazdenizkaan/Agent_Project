export interface EvidenceItem {
  id: string;
  caseId?: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  codeSnippet: string;
  ruleId?: string;
  summary: string;
  remediation?: string;
}

export interface EvidenceProvider {
  retrieve(input: {
    caseId?: string;
    query: string;
    filePath?: string;
    lineStart?: number;
    lineEnd?: number;
  }): Promise<EvidenceItem[]>;
}
