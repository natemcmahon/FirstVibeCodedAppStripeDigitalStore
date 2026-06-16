import { NextResponse } from "next/server";
import { getFulfillmentBySessionId } from "@/lib/fulfillment-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { status: "invalid_request", error: "session_id is required." },
      { status: 400 }
    );
  }

  const record = getFulfillmentBySessionId(sessionId);

  if (!record) {
    return NextResponse.json({ status: "not_found" });
  }

  return NextResponse.json({
    status: "fulfilled",
    sessionId: record.sessionId,
    productId: record.productId,
    fulfilledAt: record.fulfilledAt,
    downloadUrl: record.downloadUrl,
  });
}