import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <section className="bg-white py-section-lg">
      <div className="container-content grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-2xl shadow-card">
          <Image
            src="/images/prim-vet-hero.png"
            alt="Medic veterinar în cabinetul Prim Vet"
            width={920}
            height={680}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Despre"
            title="Prim Vet, cabinet veterinar în Iași"
            text="Construim o relație de încredere cu stăpânii prin consultații calme, explicații clare și recomandări medicale responsabile."
          />
          <p className="mt-6 text-slate-600">
            Site-ul este pregătit pentru conținutul final al cabinetului:
            istoricul echipei, dotări, fotografii reale și detalii despre
            filozofia de lucru Prim Vet.
          </p>
          <Button asChild className="mt-8">
            <Link href="/contact">Contactează cabinetul</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
