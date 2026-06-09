import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Consultație",
    price: "de la 120 lei",
    features: ["Examinare clinică", "Istoric medical", "Recomandări scrise"],
  },
  {
    name: "Prevenție",
    price: "personalizat",
    features: ["Vaccinare", "Deparazitare", "Reminder pentru rapel"],
  },
  {
    name: "Prim Card",
    price: "abonament lunar",
    features: ["Control anual", "Beneficii preventive", "Prioritate la programări"],
  },
];

export default function PricingPage() {
  return (
    <section className="bg-cloud py-section-lg">
      <div className="container-content">
        <SectionHeading
          eyebrow="Prețuri"
          title="Tarife clare și opțiuni preventive"
          text="Tarifele finale depind de consultație, greutatea animalului, investigații și tratamentul necesar. Confirmăm costurile înainte de proceduri."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`rounded-xl p-6 shadow-card ${
                index === 1 ? "bg-mint-300" : index === 2 ? "bg-rose-300" : "bg-white"
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
        <Button asChild className="mt-10">
          <Link href="/contact">Cere o estimare</Link>
        </Button>
      </div>
    </section>
  );
}
