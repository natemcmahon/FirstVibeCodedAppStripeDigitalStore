import { prisma } from "@/lib/db";

export type FulfillmentRecord = {
  sessionId: string;
  productId: string;
  fulfilledAt: string;
  assetRelativePath: string;
  status: "fulfilled";
};

function getAssetRelativePathForProduct(productId: string): string {
  if (productId === "starter-pack") {
    return "downloads/starter-pack.txt";
  }

  throw new Error("No downloadable asset configured for product.");
}

function assertDatabaseUrl(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }
}

function mapFromDbRecord(record: {
  sessionId: string;
  productId: string;
  fulfilledAt: Date;
  assetRelativePath: string;
  status: string;
}): FulfillmentRecord {
  if (record.status !== "fulfilled") {
    throw new Error("Unexpected fulfillment status returned from database.");
  }

  return {
    sessionId: record.sessionId,
    productId: record.productId,
    fulfilledAt: record.fulfilledAt.toISOString(),
    assetRelativePath: record.assetRelativePath,
    status: "fulfilled",
  };
}

export async function markFulfilled(
  sessionId: string,
  productId: string
): Promise<FulfillmentRecord> {
  assertDatabaseUrl();

  const now = new Date();
  const record = await prisma.fulfillment.upsert({
    where: { sessionId },
    update: {},
    create: {
      sessionId,
      productId,
      fulfilledAt: now,
      assetRelativePath: getAssetRelativePathForProduct(productId),
      status: "fulfilled",
    },
  });

  return mapFromDbRecord(record);
}

export async function getFulfillmentBySessionId(
  sessionId: string
): Promise<FulfillmentRecord | null> {
  assertDatabaseUrl();

  const record = await prisma.fulfillment.findUnique({
    where: { sessionId },
  });

  if (!record) {
    return null;
  }

  return mapFromDbRecord(record);
}