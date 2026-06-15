"use client";

import { useState } from "react";
import { STOREFRONT_PRODUCT } from "@/lib/products";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: STOREFRONT_PRODUCT.id }),
      });

      const payload: { checkoutUrl?: string; error?: string } =
        await response.json();

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Unable to start checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unable to start checkout.");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 px-6 py-10 font-sans text-zinc-900">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Digital Product Store
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          V1 proof-of-flow: one product, one checkout, one success page.
        </p>

        <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-xl font-semibold">{STOREFRONT_PRODUCT.name}</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {STOREFRONT_PRODUCT.description}
          </p>
          <p className="mt-4 text-2xl font-semibold">
            {STOREFRONT_PRODUCT.displayPrice}
          </p>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isLoading ? "Redirecting to Stripe..." : "Buy"}
          </button>

          {errorMessage ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
