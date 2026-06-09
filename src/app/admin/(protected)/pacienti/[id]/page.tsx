import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { Button } from "@/components/ui/button";
import {
  createMedicalEvent,
  createTreatmentPlan,
  deletePet,
  updatePet,
} from "@/lib/actions";
import { prisma } from "@/lib/db";
import {
  formatDate,
  formatDateInput,
  formatDateTime,
  formatMoney,
} from "@/lib/format";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pet, staffMembers] = await Promise.all([
    prisma.pet.findUnique({
      where: { id },
      include: {
        owner: { include: { pets: true } },
        medicalEvents: {
          include: { soapNote: true, staffMember: true },
          orderBy: { occurredAt: "desc" },
        },
        treatmentPlans: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
        appointments: { orderBy: { startAt: "desc" }, take: 5 },
      },
    }),
    prisma.staffMember.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!pet) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/pacienti"
            className="text-sm font-semibold text-navy-700 hover:underline"
          >
            Înapoi la pacienți
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            {pet.name}
          </h1>
          <p className="mt-2 text-slate-600">
            {pet.species}
            {pet.breed ? ` · ${pet.breed}` : ""} · Proprietar:{" "}
            {pet.owner.firstName} {pet.owner.lastName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/api/patients/${pet.id}/pdf`}
            className="inline-flex min-h-10 items-center rounded-pill bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-900"
          >
            Export PDF
          </Link>
          <span className="inline-flex min-h-10 items-center rounded-pill bg-mint-300 px-4 text-sm font-semibold">
            Fișă pacient activă
          </span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Dosar medical timeline
            </h2>
            <div className="mt-6 grid gap-4">
              {pet.medicalEvents.length ? (
                pet.medicalEvents.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-lg border border-navy-100 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                          {event.type}
                        </span>
                        <h3 className="mt-3 text-xl font-bold">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {formatDateTime(event.occurredAt)} ·{" "}
                          {event.staffMember?.name ?? "Fără medic alocat"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatMoney(event.costCents)}
                      </span>
                    </div>
                    {event.summary ? (
                      <p className="mt-4 text-slate-700">{event.summary}</p>
                    ) : null}
                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-slate-600">
                          Diagnostic
                        </dt>
                        <dd>{event.diagnosis ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-600">
                          Tratament
                        </dt>
                        <dd>{event.treatment ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-600">
                          Recomandări
                        </dt>
                        <dd>{event.recommendations ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-600">
                          Follow-up
                        </dt>
                        <dd>{formatDate(event.followUpAt)}</dd>
                      </div>
                    </dl>
                    {event.soapNote ? (
                      <div className="mt-4 grid gap-3 rounded-lg bg-cloud p-4 text-sm md:grid-cols-2">
                        <p>
                          <strong>S:</strong>{" "}
                          {event.soapNote.subjective ?? "-"}
                        </p>
                        <p>
                          <strong>O:</strong> {event.soapNote.objective ?? "-"}
                        </p>
                        <p>
                          <strong>A:</strong>{" "}
                          {event.soapNote.assessment ?? "-"}
                        </p>
                        <p>
                          <strong>P:</strong> {event.soapNote.plan ?? "-"}
                        </p>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="text-slate-600">
                  Nu există evenimente medicale încă.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Adaugă consultație / notă SOAP
            </h2>
            <form action={createMedicalEvent} className="mt-6 grid gap-4">
              <input type="hidden" name="petId" value={pet.id} />
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold">
                  Tip eveniment
                  <select name="type" className="rounded border border-slate-400 px-3 py-2 font-normal">
                    <option value="CONSULTATIE">Consultație</option>
                    <option value="VACCIN">Vaccin</option>
                    <option value="RETETA">Rețetă</option>
                    <option value="ANALIZE">Analize</option>
                    <option value="IMAGISTICA">Imagistică</option>
                    <option value="INTERVENTIE">Intervenție</option>
                    <option value="OBSERVATIE">Observație</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold md:col-span-2">
                  Titlu
                  <input name="title" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Dată
                  <input name="occurredAt" type="datetime-local" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Medic
                  <select name="staffMemberId" className="rounded border border-slate-400 px-3 py-2 font-normal">
                    <option value="">-</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Cost RON
                  <input name="cost" inputMode="decimal" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Sumar
                <textarea name="summary" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Subjective
                  <textarea name="subjective" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Objective
                  <textarea name="objective" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Assessment / diagnostic
                  <textarea name="assessment" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Plan
                  <textarea name="plan" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold">
                  Diagnostic
                  <input name="diagnosis" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Tratament
                  <input name="treatment" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Follow-up
                  <input name="followUpAt" type="date" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Recomandări pentru acasă
                <textarea name="recommendations" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <Button type="submit">Salvează în timeline</Button>
            </form>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <section className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Editează pacient
            </h2>
            <form action={updatePet} className="mt-5 grid gap-3">
              <input type="hidden" name="id" value={pet.id} />
              <input type="hidden" name="ownerId" value={pet.ownerId} />
              <label className="grid gap-2 text-sm font-semibold">
                Nume
                <input name="name" defaultValue={pet.name} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Specie
                <input name="species" defaultValue={pet.species} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Rasă
                <input name="breed" defaultValue={pet.breed ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <label className="grid gap-2 text-sm font-semibold">
                  Sex
                  <select name="sex" defaultValue={pet.sex ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal">
                    <option value="">-</option>
                    <option value="FEMELA">Femelă</option>
                    <option value="MASCUL">Mascul</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Data nașterii
                  <input name="birthDate" type="date" defaultValue={formatDateInput(pet.birthDate)} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Microcip
                  <input name="microchipNumber" defaultValue={pet.microchipNumber ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Greutate kg
                  <input name="weightKg" inputMode="decimal" defaultValue={pet.weightKg ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Status reproductiv
                <input name="reproductiveStatus" defaultValue={pet.reproductiveStatus ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Alergii
                <textarea name="allergies" rows={2} defaultValue={pet.allergies ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Afecțiuni cronice
                <textarea name="chronicConditions" rows={2} defaultValue={pet.chronicConditions ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Dietă
                <input name="diet" defaultValue={pet.diet ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Asigurare
                <input name="insuranceProvider" defaultValue={pet.insuranceProvider ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Note
                <textarea name="notes" rows={3} defaultValue={pet.notes ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input name="active" type="checkbox" defaultChecked={pet.active} className="h-4 w-4" />
                Pacient activ
              </label>
              <ConfirmActionButton
                size="sm"
                title="Salvezi modificările pacientului?"
                description={`Fișa pacientului ${pet.name} va fi actualizată imediat.`}
                confirmLabel="Salvează"
              >
                Salvează pacient
              </ConfirmActionButton>
            </form>
            <form action={deletePet} className="mt-4 border-t border-navy-100 pt-4">
              <input type="hidden" name="id" value={pet.id} />
              <input type="hidden" name="petName" value={pet.name} />
              <ConfirmActionButton
                variant="secondary"
                size="sm"
                className="w-full border-danger text-danger hover:bg-danger hover:text-white"
                title="Ștergi pacientul?"
                description={`Pacientul ${pet.name} și istoricul medical asociat vor fi șterse. Operațiunea nu poate fi anulată.`}
                confirmLabel="Șterge"
              >
                Șterge pacientul
              </ConfirmActionButton>
            </form>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Proprietar
            </h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div><dt className="font-semibold text-slate-600">Nume</dt><dd><Link href={`/admin/proprietari/${pet.ownerId}`} className="font-semibold text-navy-700 hover:underline">{pet.owner.firstName} {pet.owner.lastName}</Link></dd></div>
              <div><dt className="font-semibold text-slate-600">Telefon</dt><dd>{pet.owner.phone}</dd></div>
              <div><dt className="font-semibold text-slate-600">Email</dt><dd>{pet.owner.email ?? "-"}</dd></div>
              <div><dt className="font-semibold text-slate-600">Adresă</dt><dd>{pet.owner.address ?? "-"}</dd></div>
              <div><dt className="font-semibold text-slate-600">Animale</dt><dd>{pet.owner.pets.map((ownerPet) => ownerPet.name).join(", ")}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">
              Plan tratament
            </h2>
            <form action={createTreatmentPlan} className="mt-5 grid gap-3">
              <input type="hidden" name="petId" value={pet.id} />
              <input type="hidden" name="ownerId" value={pet.ownerId} />
              <input type="hidden" name="status" value="DRAFT" />
              <label className="grid gap-2 text-sm font-semibold">
                Titlu
                <input name="title" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Diagnostic
                <input name="diagnosis" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Primul pas
                <input name="itemName" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Doză / frecvență
                <input name="dosage" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Cost total estimat RON
                <input name="totalEstimated" inputMode="decimal" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <Button type="submit" size="sm">Creează plan</Button>
            </form>
            <div className="mt-6 grid gap-3">
              {pet.treatmentPlans.map((plan) => (
                <article key={plan.id} className="rounded-lg border border-navy-100 p-3 text-sm">
                  <p className="font-semibold">{plan.title}</p>
                  <p className="mt-1 text-slate-600">{plan.status} · {formatMoney(plan.totalEstimatedCents)}</p>
                  <p className="mt-2">{plan.items.map((item) => item.name).join(", ")}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
