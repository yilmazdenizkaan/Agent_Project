import { NextResponse } from "next/server";
import { demoProject } from "@bugcourt-ai/shared";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (params.id === demoProject.id) {
    return NextResponse.json({ project: demoProject });
  }

  return NextResponse.json({ error: "Project not found" }, { status: 404 });
}
