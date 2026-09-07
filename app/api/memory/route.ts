import { NextResponse } from "next/server";
import { memorySnapshot } from "../../../lib/memory";

export async function GET() {
  return NextResponse.json(memorySnapshot());
}
