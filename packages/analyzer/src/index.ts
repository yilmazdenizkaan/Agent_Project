import { CourtCase, Project, StaticFinding } from "@bugcourt-ai/shared";

export function scanProject(projectPath: string): StaticFinding[] {
  // TODO: Replace this placeholder with Semgrep or other static analysis integration.
  return [
    {
      id: "FINDING-001",
      file: "src/routes/admin.ts",
      lineStart: 42,
      lineEnd: 61,
      description: "Admin route may bypass trusted authentication when role is taken from request body.",
      severity: "High"
    }
  ];
}

export function convertFindingToCourtCase(finding: StaticFinding): CourtCase {
  return {
    caseId: `CASE-${finding.id}`,
    title: "Possible Authentication Bypass",
    charge: "Admin route may be reachable without trusted authentication.",
    file: finding.file,
    lineStart: finding.lineStart,
    lineEnd: finding.lineEnd,
    severity: finding.severity,
    evidence: [
      "Admin route does not call authMiddleware directly.",
      "User role is read from request body."
    ],
    prosecutorArgument: "The route is risky because authorization appears to rely on user-controlled input.",
    defenseArgument: "More route-level or global middleware context may be needed to determine the true security posture.",
    expertWitnessArgument: "No direct auth middleware is visible in the shown route context.",
    verdict: {
      status: "Guilty",
      reasoning: "The evidence supports a high-risk authentication bypass due to direct role validation from request body.",
      confidence: 0.87
    },
    recommendedFix: "Apply authMiddleware and validate the role from trusted token claims instead of request body."
  };
}
