import Link from "next/link";
import type { Metadata } from "next";
import { FirstAidKit, Phone } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { emergencyPhone } from "@/lib/site-data";
import { breadcrumbSchema, faqSchema, JsonLd, pageSchema } from "@/lib/seo";

const emergencyFaqs = [
  {
    question: "Ce simptome cer contact imediat?",
    answer:
      "Dificultățile de respirație, convulsiile, traumatismele, sângerările, suspiciunea de intoxicație, imposibilitatea urinării și apatia severă trebuie anunțate imediat.",
  },
  {
    question: "Pot administra medicamente de acasă?",
    answer:
      "Nu administra medicamente umane sau tratamente vechi fără indicație veterinară. Unele substanțe pot agrava starea pacientului.",
  },
  {
    question: "De ce trebuie să sun înainte să pornesc?",
    answer:
      "Triajul telefonic ajută la pregătirea vizitei și la direcționarea către un serviciu non-stop atunci când cazul are nevoie de resurse imediate.",
  },
];

export const metadata: Metadata = {
  title: "Urgențe veterinare și triaj",
  description:
    "Îndrumare pentru urgențe veterinare în Iași: traumatisme, convulsii, dificultăți de respirație, intoxicații și simptome acute.",
};

export default function EmergencyPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/urgente",
            title: "Urgențe veterinare Prim Vet Iași",
            description:
              "Triaj și îndrumare pentru urgențe veterinare în Iași, inclusiv traumatisme, convulsii, intoxicații și dificultăți de respirație.",
          }),
          faqSchema(emergencyFaqs),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Urgențe", path: "/urgente" },
          ]),
        ]}
      />
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
              Triajul telefonic ajută la prioritizarea cazului și la alegerea
              celei mai rapide soluții. Dacă animalul are dificultăți de
              respirație, traumă majoră, convulsii, suspiciune de intoxicație
              sau sângerare, contactează imediat un serviciu de urgență.
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
      <section className="bg-white py-section">
        <div className="container-content">
          <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">
            Întrebări frecvente în situații acute
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {emergencyFaqs.map((faq) => (
              <article key={faq.question} className="rounded-xl bg-cloud p-6 shadow-soft">
                <h3 className="text-lg font-bold text-navy-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
