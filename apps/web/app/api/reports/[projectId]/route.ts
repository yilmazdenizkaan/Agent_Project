import { NextResponse } from "next/server";
import { demoProject } from "@bugcourt-ai/shared";

export async function GET(_: Request, { params }: { params: { projectId: string } }) {
  if (params.projectId !== demoProject.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({
    projectId: demoProject.id,
    summary: "BugCourt AI demo report for one high-risk case.",
    caseCount: demoProject.cases.length,
    verdicts: demoProject.cases.map((item) => ({ caseId: item.caseId, status: item.verdict.status })),
  });
}
