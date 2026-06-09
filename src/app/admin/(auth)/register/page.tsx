import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { registerFirstAdmin } from "@/lib/actions";
import { hasAnyAdmin } from "@/lib/auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasAnyAdmin()) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-navy-900 px-4 py-10 text-white">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-navy-900 shadow-lift">
        <p className="text-sm font-semibold uppercase text-navy-700">
          Bootstrap securizat
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Creează primul admin
        </h1>
        <p className="mt-4 text-slate-600">
          Această pagină este disponibilă doar cât timp nu există niciun cont
          admin în baza de date.
        </p>
        {params.error === "password" ? (
          <p className="mt-5 rounded-lg bg-rose-300/60 p-3 text-sm font-semibold">
            Parola trebuie să aibă minimum 10 caractere.
          </p>
        ) : null}
        <form action={registerFirstAdmin} className="mt-8 grid gap-5">
          <label className="grid gap-2 font-semibold">
            Nume
            <input
              name="name"
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
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
              minLength={10}
              required
              className="rounded border border-slate-400 px-4 py-3 font-normal"
            />
          </label>
          <Button type="submit" size="lg">
            Creează contul
          </Button>
        </form>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-navy-700 hover:underline"
        >
          Înapoi la site
        </Link>
      </section>
    </main>
  );
}
