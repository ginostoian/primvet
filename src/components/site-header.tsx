import Link from "next/link";
import {
  CalendarBlank,
  CaretRight,
  List,
  MapPin,
  Phone,
  X,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { emergencyPhone, navLinks, phone } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <>
      <div className="bg-rose-300 text-navy-900">
        <div className="container-content flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2 text-center text-sm font-semibold md:justify-between">
          <span>Urgențe în afara programului: {emergencyPhone}</span>
          <Link
            href="/urgente"
            className="inline-flex min-h-11 items-center gap-1 hover:underline hover:underline-offset-4"
          >
            Informații urgențe
            <CaretRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-navy-100/70 bg-white/90 backdrop-blur">
        <nav
          aria-label="Navigare principală"
          className="container-content flex min-h-[72px] items-center justify-between gap-6"
        >
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-300 text-xl font-bold text-navy-900">
              PV
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold text-navy-900">
                Prim Vet
              </span>
              <span className="block text-xs font-semibold uppercase text-slate-600">
                Cabinet veterinar · Iași
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-navy-900 transition hover:text-navy-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="secondary" size="sm">
              <Link href="/contact">
                <MapPin aria-hidden className="h-5 w-5" />
                Găsește cabinetul
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/contact">
                <CalendarBlank aria-hidden className="h-5 w-5" />
                Programează
              </Link>
            </Button>
          </div>

          <details className="group lg:hidden">
            <summary
              aria-label="Deschide meniul"
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-navy-800 text-navy-900 marker:hidden"
            >
              <List aria-hidden className="h-6 w-6 group-open:hidden" />
              <X aria-hidden className="hidden h-6 w-6 group-open:block" />
            </summary>
            <div className="fixed inset-x-0 top-[112px] z-50 min-h-[calc(100vh-112px)] bg-navy-900 px-4 py-8 text-white shadow-lift">
              <div className="mx-auto flex max-w-content flex-col gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-3xl font-semibold text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 grid gap-3">
                  <Button asChild variant="accent">
                    <Link href="/contact">
                      <CalendarBlank aria-hidden className="h-5 w-5" />
                      Programează o vizită
                    </Link>
                  </Button>
                  <Button asChild variant="light">
                    <a href={`tel:${phone.replaceAll(" ", "")}`}>
                      <Phone aria-hidden className="h-5 w-5" />
                      Sună-ne: {phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </details>
        </nav>
      </header>
    </>
  );
}
