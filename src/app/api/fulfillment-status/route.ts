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

  let record: Awaited<ReturnType<typeof getFulfillmentBySessionId>>;

  try {
    record = await getFulfillmentBySessionId(sessionId);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load fulfillment status.";

    return NextResponse.json({ status: "error", error: message }, { status: 500 });
  }

  if (!record) {
    return NextResponse.json({ status: "not_found" });
  }

  return NextResponse.json({
    status: "fulfilled",
    sessionId: record.sessionId,
    productId: record.productId,
    fulfilledAt: record.fulfilledAt,
    downloadUrl: `/api/download?session_id=${encodeURIComponent(record.sessionId)}`,
  });
}