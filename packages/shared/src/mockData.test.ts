import { describe, expect, it } from "vitest";
import { demoCourtCases, demoProject } from "./mockData";

describe("shared mock data", () => {
  it("demoCourtCases contains a valid CourtCase", () => {
    expect(demoCourtCases).toHaveLength(1);
    const courtCase = demoCourtCases[0];

    expect(courtCase.caseId).toBe("CASE-001");
    expect(courtCase.title).toBeTruthy();
    expect(courtCase.file).toBe("src/routes/admin.ts");
    expect(courtCase.lineStart).toBe(42);
    expect(courtCase.lineEnd).toBe(61);
    expect(courtCase.severity).toBe("High");
    expect(courtCase.evidence.length).toBeGreaterThan(0);
  });

  it("demo verdict confidence is in a valid range", () => {
    const confidence = demoCourtCases[0].verdict.confidence;
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });

  it("demoProject contains the expected project metadata", () => {
    expect(demoProject.id).toBe("project-001");
    expect(demoProject.cases).toBe(demoCourtCases);
    expect(demoProject.repositoryUrl).toContain("https://");
  });
});
