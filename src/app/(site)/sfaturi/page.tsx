import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { SectionHeading } from "@/components/section-heading";
import { articles } from "@/lib/site-data";
import { breadcrumbSchema, JsonLd, pageSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  mint: "bg-mint-300",
  rose: "bg-rose-300",
  blue: "bg-blue-300",
};

export const metadata: Metadata = {
  title: "Sfaturi veterinare",
  description:
    "Articole Prim Vet Iași despre vaccinare, simptome care cer consult, îngrijire dentară și prevenție pentru câini și pisici.",
};

export default function AdvicePage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/sfaturi",
            title: "Sfaturi veterinare Prim Vet Iași",
            description:
              "Ghiduri veterinare despre prevenție, vaccinare, semne de alarmă și îngrijire acasă pentru câini și pisici.",
          }),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Sfaturi", path: "/sfaturi" },
          ]),
        ]}
      />
      <section className="bg-white py-section-lg">
        <div className="container-content">
          <SectionHeading
            eyebrow="Sfaturi"
            title="Articole pentru îngrijirea animalelor"
            text="Ghiduri scurte pentru prevenție, simptome care merită atenție și obiceiuri sănătoase acasă, scrise într-un limbaj ușor de folosit de stăpâni."
            titleAs="h1"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/sfaturi/${article.slug}`}
                className={cn(
                  "rounded-xl p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift",
                  tones[article.tone],
                )}
              >
                <span className="rounded-pill bg-white/70 px-3 py-1 text-sm font-semibold text-navy-900">
                  {article.readTime}
                </span>
                <h2 className="mt-6 font-display text-xl font-medium text-navy-900">
                  {article.title}
                </h2>
                <p className="mt-3 text-navy-900/80">{article.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-900">
                  Citește articolul
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
