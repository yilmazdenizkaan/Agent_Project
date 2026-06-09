import { CourtCase, Project } from "./types";

export const demoCourtCases: CourtCase[] = [
  {
    caseId: "CASE-001",
    title: "Possible Authentication Bypass",
    charge: "Admin route may be reachable without trusted authentication.",
    file: "src/routes/admin.ts",
    lineStart: 42,
    lineEnd: 61,
    severity: "High",
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
  }
];

export const demoProject: Project = {
  id: "project-001",
  name: "BugCourt AI Demo Repo",
  repositoryUrl: "https://example.com/demo-repo",
  createdAt: new Date().toISOString(),
  cases: demoCourtCases
};
