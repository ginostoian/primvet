import Link from "next/link";
import { MagnifyingGlass, PawPrint, UsersThree } from "@phosphor-icons/react/dist/ssr";

import { PaginationControls } from "@/components/admin/pagination-controls";
import { Button } from "@/components/ui/button";
import { createOwner } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatDateTime, initials } from "@/lib/format";
import { getPagination, parsePage, searchParam } from "@/lib/pagination";

const pageSize = 12;

export default async function OwnersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = searchParam(params.q);
  const page = parsePage(params.page);
  const where = q
    ? {
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { phone: { contains: q } },
          { email: { contains: q } },
          { city: { contains: q } },
          { address: { contains: q } },
          { pets: { some: { name: { contains: q } } } },
          { pets: { some: { species: { contains: q } } } },
          { pets: { some: { breed: { contains: q } } } },
          { pets: { some: { microchipNumber: { contains: q } } } },
        ],
      }
    : {};
  const total = await prisma.owner.count({ where });
  const pagination = getPagination({ page, total, pageSize });
  const owners = await prisma.owner.findMany({
    where,
    include: {
      pets: {
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          active: true,
        },
        orderBy: { name: "asc" },
      },
      appointments: {
        select: { id: true, startAt: true, status: true },
        orderBy: { startAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          pets: true,
          appointments: true,
          intakeSubmissions: true,
          treatmentPlans: true,
        },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          CRM proprietari
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Proprietari
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          View dedicat pentru persoanele care dețin animalele din clinică:
          contact, consimțăminte, istoric de programări și linkuri către fișele
          pacienților.
        </p>
      </section>

      <section className="grid gap-4">
        <details className="rounded-xl bg-white p-5 shadow-soft">
          <summary className="cursor-pointer list-none font-display text-2xl font-semibold marker:hidden">
            Proprietar nou
          </summary>
          <form action={createOwner} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-semibold">
              Prenume
              <input name="firstName" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Nume
              <input name="lastName" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Telefon
              <input name="phone" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input name="email" type="email" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Oraș
              <input name="city" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Adresă
              <input name="address" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Contact preferat
              <select name="preferredContact" defaultValue="PHONE" className="rounded border border-slate-400 px-3 py-2 font-normal">
                <option value="PHONE">Telefon</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
            </label>
            <div className="grid content-end gap-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="gdprConsent" type="checkbox" className="h-4 w-4" />
                GDPR
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="marketingConsent" type="checkbox" className="h-4 w-4" />
                Comunicări
              </label>
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <Button type="submit" size="sm">Creează proprietar</Button>
            </div>
          </form>
        </details>

        <form action="/admin/proprietari" className="rounded-xl bg-white p-4 shadow-soft">
          <label className="grid gap-2 text-sm font-semibold">
            Caută proprietar
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass
                  aria-hidden
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Nume, telefon, email, oraș, animal, microcip..."
                  className="min-h-11 w-full rounded border border-slate-400 px-10 py-2 font-normal"
                />
              </div>
              <Button type="submit" size="sm">
                Caută
              </Button>
              {q ? (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/proprietari">Reset</Link>
                </Button>
              ) : null}
            </div>
          </label>
        </form>

        <PaginationControls
          pathname="/admin/proprietari"
          q={q}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={total}
          from={pagination.from}
          to={pagination.to}
          hasPrevious={pagination.hasPrevious}
          hasNext={pagination.hasNext}
        />

        {owners.length ? (
          owners.map((owner) => (
            <Link
              key={owner.id}
              href={`/admin/proprietari/${owner.id}`}
              className="rounded-xl bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 font-bold text-navy-900">
                    {initials(`${owner.firstName} ${owner.lastName}`)}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold">
                      {owner.firstName} {owner.lastName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {owner.phone} · {owner.email ?? "fără email"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                    {owner._count.pets} animale
                  </span>
                  <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                    {owner._count.appointments} programări
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
                <div className="flex flex-wrap gap-2">
                  {owner.pets.length ? (
                    owner.pets.map((pet) => (
                      <span
                        key={pet.id}
                        className="inline-flex min-h-9 items-center gap-2 rounded-pill bg-mint-300 px-3 text-sm font-semibold"
                      >
                        <PawPrint aria-hidden className="h-4 w-4" />
                        {pet.name} · {pet.species}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-600">
                      Fără animale legate.
                    </span>
                  )}
                </div>
                <dl className="grid gap-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-slate-600">
                      Ultima programare
                    </dt>
                    <dd>
                      {owner.appointments[0]
                        ? formatDateTime(owner.appointments[0].startAt)
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-slate-600">
                      GDPR
                    </dt>
                    <dd>{owner.gdprConsentAt ? "Da" : "Nu"}</dd>
                  </div>
                </dl>
              </div>
            </Link>
          ))
        ) : (
          <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
            <div>
              <UsersThree
                aria-hidden
                className="mx-auto h-10 w-10 text-navy-700"
              />
              <h2 className="mt-4 font-display text-2xl font-semibold">
                Nu există proprietari încă
              </h2>
              <p className="mt-2 text-slate-600">
                {q
                  ? "Schimbă termenul de căutare sau resetează filtrul."
                  : "Creează proprietari din pagina de pacienți."}
              </p>
            </div>
          </div>
        )}

        {owners.length ? (
          <PaginationControls
            pathname="/admin/proprietari"
            q={q}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={total}
            from={pagination.from}
            to={pagination.to}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
          />
        ) : null}
      </section>
    </div>
  );
}
