import Link from "next/link";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";

export default async function TreatmentPlansPage() {
  const plans = await prisma.treatmentPlan.findMany({
    include: {
      pet: { include: { owner: true } },
      items: { orderBy: { stepOrder: "asc" } },
      appointment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Medicină
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Planuri de tratament
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Planurile sunt legate de pacient, proprietar și, opțional, programare.
          Sunt baza pentru aprobări, cost estimat și pașii de tratament.
        </p>
      </section>

      <section className="grid gap-4">
        {plans.length ? (
          plans.map((plan) => (
            <article key={plan.id} className="rounded-xl bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                    {plan.status}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold">
                    {plan.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    <Link href={`/admin/pacienti/${plan.petId}`} className="font-semibold text-navy-700 hover:underline">
                      {plan.pet.name}
                    </Link>{" "}
                    · {plan.pet.owner.firstName} {plan.pet.owner.lastName} ·{" "}
                    {formatDateTime(plan.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600">
                    Estimare
                  </p>
                  <p className="font-display text-2xl font-semibold">
                    {formatMoney(plan.totalEstimatedCents)}
                  </p>
                </div>
              </div>
              {plan.diagnosis ? (
                <p className="mt-4 rounded-lg bg-cloud p-4 text-sm">
                  <strong>Diagnostic:</strong> {plan.diagnosis}
                </p>
              ) : null}
              <div className="mt-4 grid gap-3">
                {plan.items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-navy-100 p-3 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {item.stepOrder}. {item.name}
                        </p>
                        <p className="mt-1 text-slate-600">
                          {item.kind}
                          {item.dosage ? ` · ${item.dosage}` : ""}
                          {item.frequency ? ` · ${item.frequency}` : ""}
                          {item.duration ? ` · ${item.duration}` : ""}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatMoney(item.estimatedCostCents)}
                      </p>
                    </div>
                    {item.instructions ? (
                      <p className="mt-2 text-slate-700">{item.instructions}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
            <div>
              <ClipboardText aria-hidden className="mx-auto h-10 w-10 text-navy-700" />
              <h2 className="mt-4 font-display text-2xl font-semibold">
                Nu există planuri încă
              </h2>
              <p className="mt-2 text-slate-600">
                Creează planuri din fișa pacientului.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
