import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { SectionHeading } from "@/components/section-heading";
import { articles } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  mint: "bg-mint-300",
  rose: "bg-rose-300",
  blue: "bg-blue-300",
};

export default function AdvicePage() {
  return (
    <section className="bg-white py-section-lg">
      <div className="container-content">
        <SectionHeading
          eyebrow="Sfaturi"
          title="Articole pentru îngrijirea animalelor"
          text="Ghiduri scurte pentru prevenție, simptome care merită atenție și obiceiuri sănătoase acasă."
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
  );
}
