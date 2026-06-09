import { NextResponse } from "next/server";
import { demoProject } from "@bugcourt-ai/shared";

export async function POST() {
  return NextResponse.json({ project: demoProject });
}
