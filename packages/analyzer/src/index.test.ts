import { describe, expect, it } from "vitest";
import { convertFindingToCourtCase, scanProject } from "./index";
import type { StaticFinding } from "@bugcourt-ai/shared";

describe("analyzer package", () => {
  it("scanProject returns a placeholder finding", () => {
    const findings = scanProject("/tmp/demo-repo");

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      id: "FINDING-001",
      file: "src/routes/admin.ts",
      lineStart: 42,
      lineEnd: 61,
      severity: "High"
    });
  });

  it("convertFindingToCourtCase maps a StaticFinding to a CourtCase", () => {
    const finding: StaticFinding = {
      id: "FINDING-123",
      file: "src/example.ts",
      lineStart: 10,
      lineEnd: 20,
      description: "Example static finding.",
      severity: "Medium"
    };

    const courtCase = convertFindingToCourtCase(finding);

    expect(courtCase.caseId).toBe("CASE-FINDING-123");
    expect(courtCase.title).toBeTruthy();
    expect(courtCase.file).toBe(finding.file);
    expect(courtCase.lineStart).toBe(finding.lineStart);
    expect(courtCase.lineEnd).toBe(finding.lineEnd);
    expect(courtCase.severity).toBe(finding.severity);
    expect(courtCase.evidence).toBeInstanceOf(Array);
    expect(courtCase.evidence.length).toBeGreaterThan(0);
    expect(courtCase.file).not.toContain("unrelated");
  });
});
