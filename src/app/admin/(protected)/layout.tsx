import Link from "next/link";
import {
  CalendarBlank,
  ClipboardText,
  GearSix,
  Heartbeat,
  House,
  ListChecks,
  Package,
  SignOut,
  Stethoscope,
  UserList,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/formulare", label: "Formulare", icon: ClipboardText },
  { href: "/admin/pacienti", label: "Pacienți", icon: Heartbeat },
  { href: "/admin/proprietari", label: "Proprietari", icon: UsersThree },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarBlank },
  { href: "/admin/check-in", label: "Check-in", icon: Stethoscope },
  { href: "/admin/inventar", label: "Inventar", icon: Package },
  { href: "/admin/planuri", label: "Planuri", icon: UserList },
  { href: "/admin/audit", label: "Audit", icon: ListChecks },
  { href: "/admin/setari", label: "Setări", icon: GearSix },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cloud text-navy-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-navy-100 bg-white px-4 py-5 lg:sticky lg:top-0 lg:h-screen">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white">
              PV
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">
                Prim Vet OS
              </span>
              <span className="text-xs font-semibold uppercase text-slate-600">
                Clinic source of truth
              </span>
            </span>
          </Link>

          <nav className="mt-8 grid gap-1" aria-label="Navigare admin">
            {adminNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-navy-900 transition hover:bg-cloud"
                >
                  <Icon aria-hidden className="h-5 w-5 text-navy-700" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAdmin} className="mt-8">
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              <SignOut aria-hidden className="h-5 w-5" />
              Log out
            </Button>
          </form>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">
                  Autentificat
                </p>
                <p className="font-semibold">{admin.name}</p>
              </div>
              <Link
                href="/"
                className="inline-flex min-h-10 items-center rounded-pill border border-navy-100 px-4 text-sm font-semibold hover:bg-cloud"
              >
                Vezi site-ul public
              </Link>
            </div>
          </header>

          <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
