import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { loginAdmin } from "@/lib/actions";
import { getCurrentAdmin, hasAnyAdmin } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  if (!(await hasAnyAdmin())) {
    redirect("/admin/register");
  }

  if (await getCurrentAdmin()) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase text-navy-700">
          Prim Vet OS
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Log in admin
        </h1>
        {params.error ? (
          <p className="mt-5 rounded-lg bg-rose-300/60 p-3 text-sm font-semibold">
            Emailul sau parola nu sunt corecte.
          </p>
        ) : null}
        {params.reset ? (
          <p className="mt-5 rounded-lg bg-green-300/50 p-3 text-sm font-semibold">
            Parola a fost resetată. Te poți autentifica.
          </p>
        ) : null}
        <form action={loginAdmin} className="mt-8 grid gap-5">
          <label className="grid gap-2 font-semibold">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
          <label className="grid gap-2 font-semibold">
            Parolă
            <input
              name="password"
              type="password"
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
          <Button type="submit" size="lg">
            Log in
          </Button>
        </form>
        <Link
          href="/admin/forgot-password"
          className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-navy-700 hover:underline"
        >
          Ai uitat parola?
        </Link>
      </section>
    </main>
  );
}
