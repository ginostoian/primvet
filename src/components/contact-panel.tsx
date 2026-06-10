import { CalendarBlank, Clock, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { createPublicIntake } from "@/lib/actions";
import {
  address,
  googleMapsEmbedUrl,
  googleMapsUrl,
  phone,
} from "@/lib/site-data";

export function ContactPanel({ sent = false }: { sent?: boolean }) {
  return (
    <section id="programare" className="bg-cloud py-section">
      <div className="container-content grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
          <p className="text-sm font-semibold uppercase text-navy-700">
            Programare
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 md:text-4xl">
            Trimite-ne detaliile vizitei
          </h2>
          <p className="mt-4 text-slate-600">
            Pentru cazurile ortopedice, menționează când a apărut șchiopătatul,
            dacă a existat un traumatism și ce tratamente sau investigații au
            fost făcute până acum.
          </p>
          {sent ? (
            <div className="mt-8 rounded-lg border border-success/30 bg-green-300/35 p-4 font-semibold text-navy-900">
              Cererea a fost trimisă. Echipa Prim Vet te va contacta pentru
              confirmare.
            </div>
          ) : null}
          <form action={createPublicIntake} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label className="font-medium text-navy-900" htmlFor="name">
                Nume
              </label>
              <input
                id="name"
                name="name"
                className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                placeholder="Numele tău"
                required
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="phone">
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                  placeholder="07XX XXX XXX"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                  placeholder="nume@email.ro"
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="pet">
                  Companion
                </label>
                <input
                  id="pet"
                  name="pet"
                  className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                  placeholder="Nume companion"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="species">
                  Specie
                </label>
                <input
                  id="species"
                  name="species"
                  className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                  placeholder="Câine, pisică..."
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="urgency">
                  Urgență
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  className="rounded border border-slate-400 px-4 py-3 text-base focus:border-navy-700"
                  defaultValue="NORMAL"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="RAPID">Rapid</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="font-medium text-navy-900" htmlFor="message">
                Motivul vizitei
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                placeholder="Spune-ne simptomele, durata lor, serviciul dorit și dacă există analize sau radiografii anterioare."
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-fit">
              <CalendarBlank aria-hidden className="h-5 w-5" />
              Cere o programare
            </Button>
          </form>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl bg-navy-900 p-8 text-white shadow-card">
            <p className="inline-flex items-center gap-2 rounded-pill bg-green-300 px-3 py-1 text-sm font-semibold text-navy-900">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Deschis după programări
            </p>
            <h3 className="mt-6 font-display text-3xl font-semibold text-white">
              Contact rapid
            </h3>
            <ul className="mt-6 grid gap-5 text-white/80">
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {address}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <span>
                  Luni - Vineri, 09:00 - 18:00 · Sâmbătă cu programare
                </span>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
            <iframe
              src={googleMapsEmbedUrl}
              title={`Hartă Google Maps pentru ${address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0"
              allowFullScreen
            />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase text-navy-700">
                Hartă Iași
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-semibold text-navy-900 hover:underline hover:underline-offset-4"
              >
                <MapPin aria-hidden className="h-5 w-5 text-mint-500" />
                Deschide în Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
