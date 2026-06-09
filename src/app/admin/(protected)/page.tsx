import Link from "next/link";
import {
  CalendarBlank,
  ClipboardText,
  Heartbeat,
  Stethoscope,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function AdminDashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [
    pendingForms,
    activePets,
    todayAppointments,
    activeCheckIns,
    recentForms,
    nextAppointments,
  ] = await Promise.all([
    prisma.intakeSubmission.count({ where: { status: "IN_ASTEPTARE" } }),
    prisma.pet.count({ where: { active: true } }),
    prisma.appointment.count({
      where: { startAt: { gte: todayStart, lt: todayEnd } },
    }),
    prisma.checkIn.count({
      where: { checkedOutAt: null },
    }),
    prisma.intakeSubmission.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { startAt: { gte: new Date() } },
      include: { pet: true, owner: true, staffMember: true },
      orderBy: { startAt: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Formulare în așteptare",
      value: pendingForms,
      href: "/admin/formulare",
      icon: ClipboardText,
    },
    {
      label: "Pacienți activi",
      value: activePets,
      href: "/admin/pacienti",
      icon: Heartbeat,
    },
    {
      label: "Programări azi",
      value: todayAppointments,
      href: "/admin/calendar",
      icon: CalendarBlank,
    },
    {
      label: "Check-in activ",
      value: activeCheckIns,
      href: "/admin/check-in",
      icon: Stethoscope,
    },
  ];

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Operațiuni
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Dashboard clinică
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">
                  {stat.label}
                </span>
                <Icon aria-hidden className="h-6 w-6 text-navy-700" />
              </div>
              <p className="mt-5 font-display text-4xl font-semibold">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold">
              Formulare recente
            </h2>
            <Link
              href="/admin/formulare"
              className="text-sm font-semibold text-navy-700 hover:underline"
            >
              Vezi toate
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {recentForms.length ? (
              recentForms.map((form) => (
                <article
                  key={form.id}
                  className="rounded-lg border border-navy-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {form.petName} · {form.ownerName}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {form.reason}
                      </p>
                    </div>
                    <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                      {form.status}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-slate-600">Nu există formulare încă.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold">
              Următoarele programări
            </h2>
            <Link
              href="/admin/calendar"
              className="text-sm font-semibold text-navy-700 hover:underline"
            >
              Calendar
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {nextAppointments.length ? (
              nextAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-lg border border-navy-100 p-4"
                >
                  <p className="font-semibold">
                    {appointment.pet?.name ?? "Pacient nelegat"} ·{" "}
                    {appointment.reason}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDateTime(appointment.startAt)} ·{" "}
                    {appointment.staffMember?.name ?? "Fără medic"}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-slate-600">Nu există programări viitoare.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
