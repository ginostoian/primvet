import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import {
  doctorExperience,
  doctorName,
  doctorTitle,
} from "@/lib/site-data";
import { breadcrumbSchema, doctorSchema, JsonLd, pageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Despre Prim Vet și medicul principal",
  description:
    "Prim Vet Iași este cabinetul coordonat de Conf. Dr. Sindilar Eusebiu Viorel, medic veterinar ortoped cu peste 30 de ani de experiență.",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/despre",
            title: "Despre Prim Vet Iași",
            description:
              "Cabinet veterinar în Iași coordonat de Conf. Dr. Sindilar Eusebiu Viorel, medic veterinar ortoped cu peste 30 de ani de experiență.",
          }),
          { "@context": "https://schema.org", ...doctorSchema },
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Despre", path: "/despre" },
          ]),
        ]}
      />
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
              text={`Cabinetul este construit în jurul experienței lui ${doctorName}, ${doctorTitle}, cu ${doctorExperience}.`}
              titleAs="h1"
            />
            <div
              id="dr-sindilar-eusebiu-viorel"
              className="mt-8 rounded-xl bg-cloud p-6 shadow-soft"
            >
              <p className="text-sm font-semibold uppercase text-navy-700">
                Medic principal
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900">
                {doctorName}
              </h2>
              <p className="mt-3 text-lg text-slate-700">
                {doctorTitle}, cu {doctorExperience}.
              </p>
              <p className="mt-5 text-slate-600">
                Rolul medicului principal este să aducă rigoare în diagnostic,
                claritate în explicații și prudență în recomandările medicale.
                Pentru cazurile ortopedice, accentul cade pe evaluarea mersului,
                identificarea sursei durerii și alegerea unei soluții potrivite
                pentru pacient și familie.
              </p>
            </div>
            <p className="mt-6 text-slate-600">
              La Prim Vet, vizita este gândită ca o colaborare: stăpânul aduce
              observațiile de acasă, medicul verifică semnele clinice, iar planul
              final este explicat pas cu pas. Această abordare ajută mai ales în
              cazurile cronice, în recuperare și în situațiile în care familia
              are nevoie de o a doua opinie medicală.
            </p>
            <Button asChild className="mt-8">
              <Link href="/contact">Contactează cabinetul</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-cloud py-section">
        <div className="container-content grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Experiență",
              text: "Peste trei decenii de practică medicală și activitate universitară.",
            },
            {
              title: "Ortopedie",
              text: "Atenție pentru șchiopătat, traumatisme, dureri articulare și recuperare.",
            },
            {
              title: "Încredere",
              text: "Explicații clare, pași medicali justificați și comunicare directă.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-navy-900">
                {item.title}
              </h3>
              <p className="mt-3 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
