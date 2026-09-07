import { NextResponse } from "next/server";
import { runAnalysis } from "../../../lib/agents";
import { recordAnalysis } from "../../../lib/memory";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = typeof body.query === "string" && body.query.trim()
    ? body.query.trim()
    : "Assess respiratory risk for PT-001";
  const result = runAnalysis(query);
  const analysisId = recordAnalysis(result, query);
  return NextResponse.json({ ...result, analysisId });
}
