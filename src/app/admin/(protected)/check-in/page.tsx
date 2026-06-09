import Link from "next/link";
import { DoorOpen, Stethoscope } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { finishCheckIn, startCheckIn } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";

export default async function CheckInPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [appointments, checkIns] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        startAt: { gte: todayStart, lt: tomorrow },
        status: { notIn: ["FINALIZATA", "ANULATA"] },
      },
      include: { pet: true, owner: true, staffMember: true, checkIn: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.checkIn.findMany({
      where: { checkedOutAt: null },
      include: { pet: true, owner: true, appointment: true },
      orderBy: { checkedInAt: "asc" },
    }),
  ]);

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Recepție
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Check-in / check-out
        </h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">
            Programări de azi
          </h2>
          <div className="mt-6 grid gap-4">
            {appointments.length ? (
              appointments.map((appointment) => (
                <article key={appointment.id} className="rounded-lg border border-navy-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                        {appointment.status}
                      </span>
                      <h3 className="mt-3 text-xl font-bold">
                        {appointment.pet ? (
                          <Link href={`/admin/pacienti/${appointment.pet.id}`} className="hover:underline">
                            {appointment.pet.name}
                          </Link>
                        ) : (
                          "Pacient nelegat"
                        )}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {formatDateTime(appointment.startAt)} · {appointment.reason}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {appointment.staffMember?.name ?? "Fără medic"}
                    </p>
                  </div>
                  <form action={startCheckIn} className="mt-4 grid gap-3">
                    <input type="hidden" name="appointmentId" value={appointment.id} />
                    <label className="grid gap-2 text-sm font-semibold">
                      Plângere principală / motiv sosire
                      <textarea name="presentingComplaint" rows={2} defaultValue={appointment.reason} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">
                        Estimare cost RON
                        <input name="estimatedCost" inputMode="decimal" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                        <input name="consentSigned" type="checkbox" className="h-4 w-4" />
                        Consimțământ semnat
                      </label>
                    </div>
                    <Button type="submit" size="sm" disabled={Boolean(appointment.checkIn)}>
                      <DoorOpen aria-hidden className="h-5 w-5" />
                      {appointment.checkIn ? "Deja sosit" : "Start check-in"}
                    </Button>
                  </form>
                </article>
              ))
            ) : (
              <p className="text-slate-600">
                Nu există programări active azi.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">
            Pacienți în cabinet
          </h2>
          <div className="mt-6 grid gap-4">
            {checkIns.length ? (
              checkIns.map((checkIn) => (
                <article key={checkIn.id} className="rounded-lg border border-navy-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-pill bg-mint-300 px-3 py-1 text-xs font-semibold">
                        {checkIn.status}
                      </span>
                      <h3 className="mt-3 text-xl font-bold">
                        {checkIn.pet ? (
                          <Link href={`/admin/pacienti/${checkIn.pet.id}`} className="hover:underline">
                            {checkIn.pet.name}
                          </Link>
                        ) : (
                          "Pacient nelegat"
                        )}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Sosit la {formatDateTime(checkIn.checkedInAt)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      Estimat: {formatMoney(checkIn.estimatedCostCents)}
                    </p>
                  </div>
                  <p className="mt-4 text-sm">{checkIn.presentingComplaint}</p>
                  <form action={finishCheckIn} className="mt-4 grid gap-3">
                    <input type="hidden" name="id" value={checkIn.id} />
                    <label className="grid gap-2 text-sm font-semibold">
                      Note externare
                      <textarea name="dischargeNotes" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">
                        Status plată
                        <select name="paymentStatus" defaultValue="PLATIT" className="rounded border border-slate-400 px-3 py-2 font-normal">
                          <option value="NEPLATIT">Neplătit</option>
                          <option value="PARTIAL">Parțial</option>
                          <option value="PLATIT">Plătit</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Plătit RON
                        <input name="paid" inputMode="decimal" className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                    </div>
                    <Button type="submit" size="sm">
                      <Stethoscope aria-hidden className="h-5 w-5" />
                      Finalizează vizita
                    </Button>
                  </form>
                </article>
              ))
            ) : (
              <p className="text-slate-600">
                Nu există pacienți cu check-in activ.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
