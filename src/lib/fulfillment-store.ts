export type FulfillmentRecord = {
  sessionId: string;
  productId: string;
  fulfilledAt: string;
  downloadUrl: string;
  status: "fulfilled";
};

const fulfillmentBySessionId = new Map<string, FulfillmentRecord>();

function createMockDownloadUrl(productId: string): string {
  return `/downloads/mock-${productId}.zip`;
}

export function markFulfilled(
  sessionId: string,
  productId: string
): FulfillmentRecord {
  const existing = fulfillmentBySessionId.get(sessionId);

  if (existing) {
    return existing;
  }

  const record: FulfillmentRecord = {
    sessionId,
    productId,
    fulfilledAt: new Date().toISOString(),
    downloadUrl: createMockDownloadUrl(productId),
    status: "fulfilled",
  };

  fulfillmentBySessionId.set(sessionId, record);
  return record;
}

export function getFulfillmentBySessionId(
  sessionId: string
): FulfillmentRecord | null {
  return fulfillmentBySessionId.get(sessionId) ?? null;
}