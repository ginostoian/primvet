import Link from "next/link";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

import { AppointmentStatusControls } from "@/components/admin/appointment-status-controls";
import { Button } from "@/components/ui/button";
import { createAppointment } from "@/lib/actions";
import { type AppointmentStatus } from "@/lib/appointment-status";
import { formatCalendarDate, getCalendarWindow } from "@/lib/calendar";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type AppointmentWithRelations = Awaited<
  ReturnType<typeof getAppointmentsForRange>
>[number];

async function getAppointmentsForRange(start: Date, end: Date) {
  return prisma.appointment.findMany({
    where: {
      startAt: {
        gte: start,
        lt: end,
      },
    },
    include: {
      pet: true,
      owner: true,
      staffMember: true,
      room: true,
      appointmentType: true,
    },
    orderBy: { startAt: "asc" },
  });
}

function calendarHref(view: string, date: Date) {
  return `/admin/calendar?view=${view}&date=${formatCalendarDate(date)}`;
}

function AppointmentCard({
  appointment,
}: {
  appointment: AppointmentWithRelations;
}) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            {appointment.pet ? (
              <Link
                href={`/admin/pacienti/${appointment.pet.id}`}
                className="hover:underline"
              >
                {appointment.pet.name}
              </Link>
            ) : (
              "Pacient nelegat"
            )}
          </h2>
          <p className="mt-1 text-slate-600">{appointment.reason}</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold">{formatDateTime(appointment.startAt)}</p>
          <p className="text-slate-600">
            până la {formatDateTime(appointment.endAt)}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm md:grid-cols-4">
        <div>
          <dt className="font-semibold text-slate-600">Proprietar</dt>
          <dd>
            {appointment.owner
              ? `${appointment.owner.firstName} ${appointment.owner.lastName}`
              : "-"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Medic</dt>
          <dd>{appointment.staffMember?.name ?? "-"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Sală</dt>
          <dd>{appointment.room?.name ?? "-"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Tip</dt>
          <dd>{appointment.appointmentType?.name ?? "-"}</dd>
        </div>
      </dl>
      <AppointmentStatusControls
        appointmentId={appointment.id}
        initialStatus={appointment.status as AppointmentStatus}
      />
    </article>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const calendar = getCalendarWindow(params);
  const [appointments, pets, owners, staffMembers, rooms, appointmentTypes] =
    await Promise.all([
      getAppointmentsForRange(calendar.start, calendar.end),
      prisma.pet.findMany({
        include: { owner: true },
        orderBy: { name: "asc" },
      }),
      prisma.owner.findMany({
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      }),
      prisma.staffMember.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      }),
      prisma.room.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.appointmentType.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      }),
    ]);
  const appointmentsByDay = new Map<string, AppointmentWithRelations[]>();

  for (const day of calendar.days) {
    appointmentsByDay.set(formatCalendarDate(day), []);
  }

  for (const appointment of appointments) {
    const key = formatCalendarDate(appointment.startAt);
    appointmentsByDay.get(key)?.push(appointment);
  }

  return (
    <div className="grid gap-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-navy-700">
            Cabinet
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">
            Calendar programări
          </h1>
          <p className="mt-3 text-slate-600">
            {calendar.view === "day"
              ? formatDate(calendar.start)
              : `${formatDate(calendar.start)} - ${formatDate(
                  new Date(calendar.end.getTime() - 1),
                )}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={calendarHref(calendar.view, calendar.previousDate)}>
              <CaretLeft aria-hidden className="h-4 w-4" />
              Înapoi
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={calendarHref(calendar.view, calendar.todayDate)}>
              Azi
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={calendarHref(calendar.view, calendar.nextDate)}>
              Înainte
              <CaretRight aria-hidden className="h-4 w-4" />
            </Link>
          </Button>
          <div className="ml-0 flex rounded-pill border-2 border-navy-800 p-1 md:ml-2">
            {(["day", "week"] as const).map((view) => (
              <Link
                key={view}
                href={calendarHref(view, calendar.selectedDate)}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-pill px-4 text-sm font-semibold transition",
                  calendar.view === view
                    ? "bg-navy-800 text-white"
                    : "text-navy-800 hover:bg-cloud",
                )}
              >
                {view === "day" ? "Zi" : "Săptămână"}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">
            Programare nouă
          </h2>
          <form action={createAppointment} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Pacient
              <select
                name="petId"
                className="rounded border border-slate-400 px-3 py-2 font-normal"
              >
                <option value="">Walk-in / pacient nelegat</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} · {pet.owner.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Proprietar
              <select
                name="ownerId"
                className="rounded border border-slate-400 px-3 py-2 font-normal"
              >
                <option value="">-</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.firstName} {owner.lastName}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Start
                <input
                  name="startAt"
                  type="datetime-local"
                  required
                  className="rounded border border-slate-400 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Durată minute
                <input
                  name="durationMinutes"
                  type="number"
                  defaultValue={30}
                  min={5}
                  className="rounded border border-slate-400 px-3 py-2 font-normal"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Medic
                <select
                  name="staffMemberId"
                  className="rounded border border-slate-400 px-3 py-2 font-normal"
                >
                  <option value="">-</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Cabinet / sală
                <select
                  name="roomId"
                  className="rounded border border-slate-400 px-3 py-2 font-normal"
                >
                  <option value="">-</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Tip vizită
                <select
                  name="appointmentTypeId"
                  className="rounded border border-slate-400 px-3 py-2 font-normal"
                >
                  <option value="">-</option>
                  {appointmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Motiv
              <input
                name="reason"
                required
                className="rounded border border-slate-400 px-3 py-2 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Note
              <textarea
                name="notes"
                rows={3}
                className="rounded border border-slate-400 px-3 py-2 font-normal"
              />
            </label>
            <Button type="submit">
              <CalendarBlank aria-hidden className="h-5 w-5" />
              Salvează programarea
            </Button>
          </form>
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-xl bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  {calendar.view === "day"
                    ? "Programările zilei"
                    : "Programările săptămânii"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {appointments.length} programări în intervalul selectat
                </p>
              </div>
              <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                {formatDate(calendar.start)}
              </span>
            </div>
          </div>

          {appointments.length ? (
            calendar.days.map((day) => {
              const key = formatCalendarDate(day);
              const dayAppointments = appointmentsByDay.get(key) ?? [];

              if (calendar.view === "day" && dayAppointments.length === 0) {
                return null;
              }

              return (
                <section key={key} className="grid gap-3">
                  {calendar.view === "week" ? (
                    <div className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-soft">
                      <h3 className="font-display text-xl font-semibold">
                        {formatDate(day)}
                      </h3>
                      <Link
                        href={calendarHref("day", day)}
                        className="text-sm font-semibold text-navy-700 hover:underline"
                      >
                        Vezi ziua
                      </Link>
                    </div>
                  ) : null}
                  {dayAppointments.length ? (
                    dayAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-navy-100 bg-white p-5 text-sm text-slate-600">
                      Nu există programări în această zi.
                    </div>
                  )}
                </section>
              );
            })
          ) : (
            <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
              <div>
                <CalendarBlank
                  aria-hidden
                  className="mx-auto h-10 w-10 text-navy-700"
                />
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  Nu există programări în interval
                </h2>
                <p className="mt-2 text-slate-600">
                  Schimbă ziua sau săptămâna, ori adaugă o programare nouă.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
