import { NextResponse } from "next/server";
import { demoProject } from "@bugcourt-ai/shared";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  if (params.id !== demoProject.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ status: "analyzed", cases: demoProject.cases });
}
