import { NextResponse } from "next/server";
import { demoProject } from "@bugcourt-ai/shared";

export async function GET(_: Request, { params }: { params: { slug: string[] } }) {
  const [first, second] = params.slug;

  if (!first) {
    return NextResponse.json({ error: "Invalid case route" }, { status: 400 });
  }

  if (first.startsWith("CASE-")) {
    const foundCase = demoProject.cases.find((item) => item.caseId === first);
    if (!foundCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ case: foundCase });
  }

  const projectCases = demoProject.cases.filter(() => demoProject.id === first);
  return NextResponse.json({ cases: projectCases });
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  const [first, action] = params.slug;

  if (!first?.startsWith("CASE-")) {
    return NextResponse.json({ error: "Invalid case route" }, { status: 400 });
  }

  if (action === "debate") {
    return NextResponse.json({
      status: "debate-logged",
      caseId: first,
      message: "Agent debate placeholder received.",
    });
  }

  if (action === "verdict") {
    const requestBody = await request.json().catch(() => ({}));
    return NextResponse.json({
      status: "verdict-recorded",
      caseId: first,
      verdict: requestBody.verdict ?? { status: "Guilty", confidence: 0.87 },
    });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
