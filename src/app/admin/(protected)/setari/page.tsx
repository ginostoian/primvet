import { Button } from "@/components/ui/button";
import {
  createAdminUser,
  createAppointmentType,
  createRoom,
  createStaffMember,
} from "@/lib/actions";
import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const [admins, staff, rooms, appointmentTypes] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.staffMember.findMany({ orderBy: { name: "asc" } }),
    prisma.room.findMany({ orderBy: { name: "asc" } }),
    prisma.appointmentType.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Configurare
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Setări clinică
        </h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Medici / personal</h2>
          <form action={createStaffMember} className="mt-5 grid gap-3">
            <input name="name" required placeholder="Nume" className="rounded border border-slate-400 px-3 py-2" />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="role" placeholder="Rol: MEDIC, ASISTENT..." className="rounded border border-slate-400 px-3 py-2" />
              <input name="color" type="color" defaultValue="#5FC9A8" className="h-11 rounded border border-slate-400 px-2 py-1" />
              <input name="email" type="email" placeholder="Email" className="rounded border border-slate-400 px-3 py-2" />
              <input name="phone" placeholder="Telefon" className="rounded border border-slate-400 px-3 py-2" />
            </div>
            <Button type="submit" size="sm">Adaugă personal</Button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-3">
                <span>{member.name} · {member.role}</span>
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: member.color }} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Cabinete / săli</h2>
          <form action={createRoom} className="mt-5 grid gap-3">
            <input name="name" required placeholder="Cabinet 1" className="rounded border border-slate-400 px-3 py-2" />
            <input name="type" placeholder="CABINET, CHIRURGIE, TRIAJ..." className="rounded border border-slate-400 px-3 py-2" />
            <Button type="submit" size="sm">Adaugă sală</Button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-lg border border-navy-100 p-3">
                {room.name} · {room.type}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Tipuri de vizită</h2>
          <form action={createAppointmentType} className="mt-5 grid gap-3">
            <input name="name" required placeholder="Consultație generală" className="rounded border border-slate-400 px-3 py-2" />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="durationMinutes" type="number" min={5} defaultValue={30} className="rounded border border-slate-400 px-3 py-2" />
              <input name="color" type="color" defaultValue="#BBD7F0" className="h-11 rounded border border-slate-400 px-2 py-1" />
            </div>
            <Button type="submit" size="sm">Adaugă tip</Button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            {appointmentTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-3">
                <span>{type.name} · {type.durationMinutes} min</span>
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: type.color }} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Admini</h2>
          <form action={createAdminUser} className="mt-5 grid gap-3">
            <input name="name" required placeholder="Nume admin" className="rounded border border-slate-400 px-3 py-2" />
            <input name="email" type="email" required placeholder="admin@email.ro" className="rounded border border-slate-400 px-3 py-2" />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="role" defaultValue="ADMIN" className="rounded border border-slate-400 px-3 py-2" />
              <input name="password" type="password" minLength={10} required placeholder="Parolă inițială" className="rounded border border-slate-400 px-3 py-2" />
            </div>
            <Button type="submit" size="sm">Creează admin</Button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            {admins.map((admin) => (
              <div key={admin.id} className="rounded-lg border border-navy-100 p-3">
                <p className="font-semibold">{admin.name}</p>
                <p className="text-slate-600">{admin.email} · {admin.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
