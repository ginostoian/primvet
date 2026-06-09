import Link from "next/link";

import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase text-navy-700">
          Parolă nouă
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Resetează parola
        </h1>
        {params.error ? (
          <p className="mt-5 rounded-lg bg-rose-300/60 p-3 text-sm font-semibold">
            Linkul nu este valid sau parola este prea scurtă.
          </p>
        ) : null}
        <form action={resetPassword} className="mt-8 grid gap-5">
          <input type="hidden" name="token" value={params.token ?? ""} />
          <label className="grid gap-2 font-semibold">
            Parolă nouă
            <input
              name="password"
              type="password"
              minLength={10}
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
          <Button type="submit" size="lg" disabled={!params.token}>
            Salvează parola
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
