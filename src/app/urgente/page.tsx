import Link from "next/link";
import { FirstAidKit, Phone } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { emergencyPhone } from "@/lib/site-data";

export default function EmergencyPage() {
  return (
    <section className="bg-rose-300 py-section-lg">
      <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/70 text-navy-900">
          <FirstAidKit aria-hidden className="h-12 w-12" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-navy-700">
            Urgențe
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-navy-900 md:text-5xl">
            Pentru situații urgente, sună înainte să pornești spre cabinet
          </h1>
          <p className="mt-5 max-w-[65ch] text-lg text-navy-900/80">
            În afara programului putem oferi triaj telefonic și direcționare
            către cea mai potrivită opțiune disponibilă. Dacă animalul are
            dificultăți de respirație, traumă majoră, convulsii sau sângerare,
            contactează imediat un serviciu de urgență.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={`tel:${emergencyPhone.replaceAll(" ", "")}`}>
                <Phone aria-hidden className="h-5 w-5" />
                Sună: {emergencyPhone}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Vezi programul</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
