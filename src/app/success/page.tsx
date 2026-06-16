"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type FulfillmentState =
  | { kind: "pending" }
  | { kind: "fulfilled"; downloadUrl: string }
  | { kind: "error"; message: string };

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-6 py-10 text-emerald-950">
      <section className="w-full max-w-lg rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Payment received</h1>
        <p className="mt-3 text-sm text-emerald-900/80">
          Loading fulfillment status...
        </p>
      </section>
    </main>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<FulfillmentState>({ kind: "pending" });

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const currentStatusUrl = `/api/fulfillment-status?session_id=${encodeURIComponent(
      sessionId
    )}`;

    let stopPolling = false;

    async function pollFulfillmentStatus() {
      try {
        const response = await fetch(currentStatusUrl, { cache: "no-store" });
        const payload: {
          status?: string;
          downloadUrl?: string;
          error?: string;
        } = await response.json();

        if (!response.ok) {
          setState({
            kind: "error",
            message: payload.error ?? "Failed to confirm payment status.",
          });
          return;
        }

        if (payload.status === "fulfilled" && payload.downloadUrl) {
          setState({ kind: "fulfilled", downloadUrl: payload.downloadUrl });
          stopPolling = true;
          return;
        }

        setState({ kind: "pending" });
      } catch {
        setState({
          kind: "error",
          message: "Unable to load fulfillment status.",
        });
      }
    }

    pollFulfillmentStatus();
    const interval = window.setInterval(() => {
      if (!stopPolling) {
        pollFulfillmentStatus();
      }
    }, 2000);

    return () => {
      stopPolling = true;
      window.clearInterval(interval);
    };
  }, [sessionId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-6 py-10 text-emerald-950">
      <section className="w-full max-w-lg rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Payment received</h1>
        {!sessionId ? (
          <p className="mt-3 text-sm text-amber-900">
            Missing session id. Retry checkout from the storefront.
          </p>
        ) : null}

        {state.kind === "pending" ? (
          <p className="mt-3 text-sm text-emerald-900/80">
            Payment is confirmed on Stripe. Waiting for secure fulfillment
            confirmation...
          </p>
        ) : null}

        {state.kind === "fulfilled" ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p>Your mock download is ready.</p>
            <a
              href={state.downloadUrl}
              className="mt-3 inline-flex rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-600"
            >
              Download product
            </a>
          </div>
        ) : null}

        {state.kind === "error" ? (
          <p className="mt-3 text-sm text-red-700">{state.message}</p>
        ) : null}

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          Back to store
        </Link>
      </section>
    </main>
  );
}