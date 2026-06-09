import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarBlank,
  PawPrint,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { deleteOwner, updateOwner } from "@/lib/actions";
import { prisma } from "@/lib/db";
import {
  formatDate,
  formatDateInput,
  formatDateTime,
  formatMoney,
  initials,
} from "@/lib/format";

export default async function OwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const owner = await prisma.owner.findUnique({
    where: { id },
    include: {
      pets: {
        include: {
          medicalEvents: {
            select: { id: true, occurredAt: true, title: true, type: true },
            orderBy: { occurredAt: "desc" },
            take: 1,
          },
          treatmentPlans: {
            select: { id: true, status: true, totalEstimatedCents: true },
          },
        },
        orderBy: { name: "asc" },
      },
      appointments: {
        include: {
          pet: true,
          staffMember: true,
          room: true,
        },
        orderBy: { startAt: "desc" },
        take: 8,
      },
      intakeSubmissions: {
        orderBy: { submittedAt: "desc" },
        take: 5,
      },
      treatmentPlans: {
        include: { pet: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!owner) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/proprietari"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy-700 hover:underline"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Înapoi la proprietari
          </Link>
          <div className="mt-3 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-300 text-lg font-bold text-navy-900">
              {initials(`${owner.firstName} ${owner.lastName}`)}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase text-navy-700">
                Proprietar
              </p>
              <h1 className="font-display text-4xl font-semibold">
                {owner.firstName} {owner.lastName}
              </h1>
            </div>
          </div>
        </div>
        <a
          href={`tel:${owner.phone.replaceAll(" ", "")}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-navy-800 px-5 font-semibold text-white hover:bg-navy-900"
        >
          <Phone aria-hidden className="h-5 w-5" />
          Sună proprietarul
        </a>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="grid content-start gap-6">
          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Editează proprietar
            </h2>
            <form action={updateOwner} className="mt-5 grid gap-3">
              <input type="hidden" name="id" value={owner.id} />
              <label className="grid gap-2 text-sm font-semibold">
                Prenume
                <input name="firstName" defaultValue={owner.firstName} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Nume
                <input name="lastName" defaultValue={owner.lastName} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Telefon
                <input name="phone" defaultValue={owner.phone} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input name="email" type="email" defaultValue={owner.email ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Adresă
                <input name="address" defaultValue={owner.address ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <label className="grid gap-2 text-sm font-semibold">
                  Oraș
                  <input name="city" defaultValue={owner.city ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Județ
                  <input name="county" defaultValue={owner.county ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Contact preferat
                <select name="preferredContact" defaultValue={owner.preferredContact} className="rounded border border-slate-400 px-3 py-2 font-normal">
                  <option value="PHONE">Telefon</option>
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Contact urgență
                <input name="emergencyContactName" defaultValue={owner.emergencyContactName ?? ""} placeholder="Nume" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Telefon urgență
                <input name="emergencyContactPhone" defaultValue={owner.emergencyContactPhone ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="gdprConsent" type="checkbox" defaultChecked={Boolean(owner.gdprConsentAt)} className="h-4 w-4" />
                Consimțământ GDPR
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="marketingConsent" type="checkbox" defaultChecked={owner.marketingConsent} className="h-4 w-4" />
                Comunicări preventive
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Note
                <textarea name="notes" rows={3} defaultValue={owner.notes ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <ConfirmActionButton
                size="sm"
                title="Salvezi modificările proprietarului?"
                description={`Datele pentru ${owner.firstName} ${owner.lastName} vor fi actualizate imediat.`}
                confirmLabel="Salvează"
              >
                Salvează proprietar
              </ConfirmActionButton>
            </form>
            <form action={deleteOwner} className="mt-4 border-t border-navy-100 pt-4">
              <input type="hidden" name="id" value={owner.id} />
              <input type="hidden" name="ownerName" value={`${owner.firstName} ${owner.lastName}`} />
              <ConfirmActionButton
                variant="secondary"
                size="sm"
                className="w-full border-danger text-danger hover:bg-danger hover:text-white"
                title="Ștergi proprietarul?"
                description={`Proprietarul ${owner.firstName} ${owner.lastName} și animalele asociate vor fi șterse. Operațiunea nu poate fi anulată.`}
                confirmLabel="Șterge"
              >
                Șterge proprietarul
              </ConfirmActionButton>
            </form>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Consimțăminte
            </h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-600">GDPR</dt>
                <dd>
                  {owner.gdprConsentAt
                    ? formatDateInput(owner.gdprConsentAt)
                    : "Nu"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">
                  Comunicări preventive
                </dt>
                <dd>{owner.marketingConsent ? "Da" : "Nu"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">Note</dt>
                <dd>{owner.notes ?? "-"}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="grid content-start gap-6">
          <section className="rounded-xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold">
                Animale de companie
              </h2>
              <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                {owner.pets.length} fișe
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {owner.pets.length ? (
                owner.pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/admin/pacienti/${pet.id}`}
                    className="rounded-lg border border-navy-100 p-4 transition hover:bg-cloud"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-300 text-navy-900">
                        <PawPrint aria-hidden className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">{pet.name}</h3>
                        <p className="text-sm text-slate-600">
                          {pet.species}
                          {pet.breed ? ` · ${pet.breed}` : ""}
                        </p>
                      </div>
                    </div>
                    <dl className="mt-4 grid gap-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt className="font-semibold text-slate-600">
                          Microcip
                        </dt>
                        <dd>{pet.microchipNumber ?? "-"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="font-semibold text-slate-600">
                          Greutate
                        </dt>
                        <dd>{pet.weightKg ? `${pet.weightKg} kg` : "-"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="font-semibold text-slate-600">
                          Ultim eveniment
                        </dt>
                        <dd>
                          {pet.medicalEvents[0]
                            ? formatDate(pet.medicalEvents[0].occurredAt)
                            : "-"}
                        </dd>
                      </div>
                    </dl>
                  </Link>
                ))
              ) : (
                <p className="text-slate-600">
                  Nu există animale legate de acest proprietar.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <CalendarBlank aria-hidden className="h-6 w-6 text-navy-700" />
              <h2 className="font-display text-2xl font-semibold">
                Programări recente
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {owner.appointments.length ? (
                owner.appointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="rounded-lg border border-navy-100 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {appointment.pet?.name ?? "Pacient nelegat"} ·{" "}
                          {appointment.reason}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {appointment.staffMember?.name ?? "Fără medic"} ·{" "}
                          {appointment.room?.name ?? "Fără sală"}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold">
                          {formatDateTime(appointment.startAt)}
                        </p>
                        <p className="text-slate-600">{appointment.status}</p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-slate-600">
                  Nu există programări pentru acest proprietar.
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl font-semibold">
                Formulare recente
              </h2>
              <div className="mt-5 grid gap-3">
                {owner.intakeSubmissions.length ? (
                  owner.intakeSubmissions.map((submission) => (
                    <article
                      key={submission.id}
                      className="rounded-lg border border-navy-100 p-3 text-sm"
                    >
                      <p className="font-semibold">
                        {submission.petName} · {submission.status}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {submission.reason}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-600">Nu există formulare legate.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl font-semibold">
                Planuri recente
              </h2>
              <div className="mt-5 grid gap-3">
                {owner.treatmentPlans.length ? (
                  owner.treatmentPlans.map((plan) => (
                    <article
                      key={plan.id}
                      className="rounded-lg border border-navy-100 p-3 text-sm"
                    >
                      <p className="font-semibold">
                        {plan.title} · {plan.pet.name}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {plan.status} · {formatMoney(plan.totalEstimatedCents)}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-600">Nu există planuri legate.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
