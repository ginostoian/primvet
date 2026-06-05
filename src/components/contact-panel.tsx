import { CalendarBlank, Clock, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { address, phone } from "@/lib/site-data";

export function ContactPanel() {
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
          <form className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label className="font-medium text-navy-900" htmlFor="name">
                Nume
              </label>
              <input
                id="name"
                name="name"
                className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                placeholder="Numele tău"
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
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium text-navy-900" htmlFor="pet">
                  Companion
                </label>
                <input
                  id="pet"
                  name="pet"
                  className="rounded border border-slate-400 px-4 py-3 text-base placeholder:text-slate-400 focus:border-navy-700"
                  placeholder="Câine, pisică..."
                />
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
                placeholder="Spune-ne pe scurt ce simptome sau ce serviciu te interesează."
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
                <span>{address}</span>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-1 h-5 w-5 text-mint-300" />
                <span>Luni - Vineri, 09:00 - 18:00 · Sâmbătă cu programare</span>
              </li>
            </ul>
          </div>

          <div className="min-h-[280px] rounded-2xl border-2 border-dashed border-navy-100 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase text-navy-700">
              Hartă Iași
            </p>
            <div className="mt-10 grid place-items-center text-center">
              <MapPin aria-hidden className="h-12 w-12 text-mint-500" />
              <p className="mt-4 max-w-[32ch] text-slate-600">
                Embed-ul Google Maps poate fi conectat după confirmarea adresei
                exacte a cabinetului.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
