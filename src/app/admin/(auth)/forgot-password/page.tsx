import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; devToken?: string }>;
}) {
  const params = await searchParams;
  const resetHref = params.devToken
    ? `/admin/reset-password?token=${params.devToken}`
    : null;

  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase text-navy-700">
          Resetare parolă
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Cere link de reset
        </h1>
        {params.sent ? (
          <div className="mt-5 rounded-lg bg-green-300/45 p-3 text-sm font-semibold">
            Dacă emailul există, a fost generat un link de reset.
            {resetHref ? (
              <Link
                href={resetHref}
                className="mt-2 block text-navy-800 underline underline-offset-4"
              >
                Link reset local
              </Link>
            ) : null}
          </div>
        ) : null}
        <form action={requestPasswordReset} className="mt-8 grid gap-5">
          <label className="grid gap-2 font-semibold">
            Email admin
            <input
              name="email"
              type="email"
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
          <Button type="submit" size="lg">
            Generează reset
          </Button>
        </form>
        <Link
          href="/admin/login"
          className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-navy-700 hover:underline"
        >
          Înapoi la login
        </Link>
      </section>
    </main>
  );
}
