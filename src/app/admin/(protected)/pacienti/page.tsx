import Link from "next/link";
import { MagnifyingGlass, PawPrint, PlusCircle } from "@phosphor-icons/react/dist/ssr";

import { PaginationControls } from "@/components/admin/pagination-controls";
import { Button } from "@/components/ui/button";
import { createOwnerWithPet } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getPagination, parsePage, searchParam } from "@/lib/pagination";

const pageSize = 12;

export default async function PatientsPage({
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
          { name: { contains: q } },
          { species: { contains: q } },
          { breed: { contains: q } },
          { microchipNumber: { contains: q } },
          { owner: { firstName: { contains: q } } },
          { owner: { lastName: { contains: q } } },
          { owner: { phone: { contains: q } } },
          { owner: { email: { contains: q } } },
        ],
      }
    : {};
  const total = await prisma.pet.count({ where });
  const pagination = getPagination({ page, total, pageSize });
  const pets = await prisma.pet.findMany({
    where,
    include: {
      owner: true,
      medicalEvents: { select: { id: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          CRM medical
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Pacienți și proprietari
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Relația centrală este proprietar → animale. Un proprietar poate avea
          oricâte fișe de pacient, fiecare cu dosar medical separat.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">
            Creează proprietar + pacient
          </h2>
          <form action={createOwnerWithPet} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Prenume proprietar
                <input name="firstName" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Nume proprietar
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
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Oraș
                <input name="city" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Adresă
                <input name="address" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
            </div>
            <div className="grid gap-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="gdprConsent" type="checkbox" className="h-4 w-4" />
                Consimțământ GDPR înregistrat
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="marketingConsent" type="checkbox" className="h-4 w-4" />
                Acceptă comunicări preventive
              </label>
            </div>

            <div className="border-t border-navy-100 pt-4">
              <p className="text-sm font-semibold uppercase text-navy-700">
                Pacient
              </p>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Nume pacient
              <input name="petName" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Specie
                <input name="species" required placeholder="Câine, pisică..." className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Rasă
                <input name="breed" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Sex
                <select name="sex" className="rounded border border-slate-400 px-3 py-2 font-normal">
                  <option value="">-</option>
                  <option value="FEMELA">Femelă</option>
                  <option value="MASCUL">Mascul</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Data nașterii
                <input name="birthDate" type="date" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Microcip
                <input name="microchipNumber" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Greutate kg
                <input name="weightKg" inputMode="decimal" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Alergii
              <textarea name="allergies" rows={2} className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Afecțiuni cronice / observații
              <textarea name="chronicConditions" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <Button type="submit">
              <PlusCircle aria-hidden className="h-5 w-5" />
              Creează fișa
            </Button>
          </form>
        </div>

        <div className="grid content-start gap-4">
          <form action="/admin/pacienti" className="rounded-xl bg-white p-4 shadow-soft">
            <label className="grid gap-2 text-sm font-semibold">
              Caută pacient
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlass
                    aria-hidden
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Nume, specie, rasă, microcip, proprietar, telefon..."
                    className="min-h-11 w-full rounded border border-slate-400 px-10 py-2 font-normal"
                  />
                </div>
                <Button type="submit" size="sm">
                  Caută
                </Button>
                {q ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/admin/pacienti">Reset</Link>
                  </Button>
                ) : null}
              </div>
            </label>
          </form>

          <PaginationControls
            pathname="/admin/pacienti"
            q={q}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={total}
            from={pagination.from}
            to={pagination.to}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
          />

          {pets.length ? (
            pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/admin/pacienti/${pet.id}`}
                className="rounded-xl bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-300 text-navy-900">
                      <PawPrint aria-hidden className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold">
                        {pet.name}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {pet.species}
                        {pet.breed ? ` · ${pet.breed}` : ""} · Proprietar:{" "}
                        {pet.owner.firstName} {pet.owner.lastName}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                    {pet.medicalEvents.length} evenimente
                  </span>
                </div>
                <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-slate-600">Microcip</dt>
                    <dd>{pet.microchipNumber ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-600">Greutate</dt>
                    <dd>{pet.weightKg ? `${pet.weightKg} kg` : "-"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-600">Născut</dt>
                    <dd>{formatDate(pet.birthDate)}</dd>
                  </div>
                </dl>
              </Link>
            ))
          ) : (
            <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
              <div>
                <PawPrint aria-hidden className="mx-auto h-10 w-10 text-navy-700" />
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  Nu există pacienți încă
                </h2>
                <p className="mt-2 text-slate-600">
                  {q
                    ? "Schimbă termenul de căutare sau resetează filtrul."
                    : "Creează primul proprietar și primul pacient din formularul din stânga."}
                </p>
              </div>
            </div>
          )}

          {pets.length ? (
            <PaginationControls
              pathname="/admin/pacienti"
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
        </div>
      </section>
    </div>
  );
}
