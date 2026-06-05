import Link from "next/link";
import { ArrowRight, CalendarBlank, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { address, navLinks, phone, services } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer>
      <section className="bg-cloud py-12">
        <div className="container-content flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-navy-700">
              Prim Vet · Iași
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900">
              Ai nevoie de o programare?
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">
              Programează o vizită
              <ArrowRight aria-hidden className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      <section className="bg-navy-900 py-14 text-white">
        <div className="container-content grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-300 text-xl font-bold text-navy-900">
                PV
              </span>
              <span className="font-display text-2xl font-semibold">
                Prim Vet
              </span>
            </Link>
            <p className="mt-5 max-w-[32ch] text-white/75">
              Cabinet veterinar din Iași pentru consultații, prevenție și îngrijire
              atentă a animalelor de companie.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Navigare</h3>
            <ul className="mt-5 grid gap-3 text-white/75">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link className="inline-flex min-h-11 items-center hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Servicii</h3>
            <ul className="mt-5 grid gap-3 text-white/75">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    className="inline-flex min-h-11 items-center hover:text-white"
                    href={`/servicii/${service.slug}`}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <ul className="mt-5 grid gap-4 text-white/75">
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <a className="inline-flex min-h-11 items-center hover:text-white" href={`tel:${phone.replaceAll(" ", "")}`}>
                  {phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <span>{address}</span>
              </li>
              <li className="flex gap-3">
                <CalendarBlank
                  aria-hidden
                  className="mt-1 h-5 w-5 text-mint-300"
                />
                <span>Luni - Vineri, 09:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-content mt-12 border-t border-white/15 pt-6 text-sm text-white/60">
          © 2026 Prim Vet. Toate drepturile rezervate.
        </div>
      </section>
    </footer>
  );
}
