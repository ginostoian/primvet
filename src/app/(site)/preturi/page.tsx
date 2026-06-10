import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, JsonLd, pageSchema } from "@/lib/seo";

const plans = [
  {
    name: "Consultație veterinară",
    price: "de la 120 lei",
    features: ["Examinare clinică", "Istoric medical", "Plan explicat"],
  },
  {
    name: "Ortopedie",
    price: "personalizat",
    features: [
      "Evaluarea mersului",
      "Examinare articulară",
      "Recomandări pentru investigații",
    ],
  },
  {
    name: "Prevenție",
    price: "personalizat",
    features: ["Vaccinare", "Deparazitare", "Reminder pentru rapel"],
  },
];

export const metadata: Metadata = {
  title: "Prețuri servicii veterinare",
  description:
    "Tarife orientative Prim Vet Iași pentru consultații veterinare, ortopedie, vaccinare, prevenție și servicii medicale pentru câini și pisici.",
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/preturi",
            title: "Prețuri Prim Vet Iași",
            description:
              "Tarife orientative pentru consultații veterinare, ortopedie, prevenție și servicii medicale Prim Vet Iași.",
          }),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Prețuri", path: "/preturi" },
          ]),
        ]}
      />
      <section className="bg-cloud py-section-lg">
        <div className="container-content">
          <SectionHeading
            eyebrow="Prețuri"
            title="Tarife clare, confirmate înainte de proceduri"
            text="Costul final depinde de consultație, greutatea animalului, investigații și tratamentul necesar. Pentru cazurile ortopedice sau chirurgicale, estimarea se face după examinare."
            titleAs="h1"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <article
                key={plan.name}
                className={`rounded-xl p-6 shadow-card ${
                  index === 1
                    ? "bg-mint-300"
                    : index === 2
                      ? "bg-rose-300"
                      : "bg-white"
                }`}
              >
                <h2 className="font-display text-2xl font-semibold text-navy-900">
                  {plan.name}
                </h2>
                <p className="mt-3 text-lg font-semibold text-navy-800">
                  {plan.price}
                </p>
                <ul className="mt-6 grid gap-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-navy-900/80">
                      <CheckCircle
                        aria-hidden
                        weight="fill"
                        className="mt-1 h-5 w-5 shrink-0 text-green-500"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-[72ch] text-slate-600">
            Preferăm să discutăm costurile înainte de analize, intervenții sau
            tratamente, astfel încât decizia medicală să fie clară pentru
            familie și potrivită pentru pacient.
          </p>
          <Button asChild className="mt-10">
            <Link href="/contact">Cere o estimare</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
