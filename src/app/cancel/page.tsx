import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6 py-10 text-amber-950">
      <section className="w-full max-w-lg rounded-xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Checkout canceled</h1>
        <p className="mt-3 text-sm text-amber-900/80">
          No payment was completed. You can retry any time.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-amber-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          Return to store
        </Link>
      </section>
    </main>
  );
}