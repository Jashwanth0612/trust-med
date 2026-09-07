import { NextResponse } from "next/server";
import { recordOutcome } from "../../../lib/memory";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.analysisId || !["accepted", "overridden", "deferred"].includes(body.decision)) {
    return NextResponse.json({ error: "analysisId and a valid decision are required" }, { status: 400 });
  }
  const outcome = recordOutcome(body.analysisId, body.decision, typeof body.note === "string" ? body.note : undefined);
  return NextResponse.json({ outcome });
}
