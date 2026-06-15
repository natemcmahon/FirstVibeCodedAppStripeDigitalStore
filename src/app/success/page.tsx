import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-6 py-10 text-emerald-950">
      <section className="w-full max-w-lg rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Payment successful</h1>
        <p className="mt-3 text-sm text-emerald-900/80">
          Your test checkout completed successfully.
        </p>
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