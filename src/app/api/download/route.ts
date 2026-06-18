import path from "path";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { getFulfillmentBySessionId } from "@/lib/fulfillment-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return new NextResponse(null, { status: 404 });
  }

  let record: Awaited<ReturnType<typeof getFulfillmentBySessionId>>;

  try {
    record = await getFulfillmentBySessionId(sessionId);
  } catch {
    return new NextResponse(null, { status: 500 });
  }

  if (!record || record.status !== "fulfilled") {
    return new NextResponse(null, { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    record.assetRelativePath
  );

  try {
    const fileBuffer = await readFile(filePath);
    const fileName = path.basename(record.assetRelativePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}