import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import type { Service } from "@/lib/site-data";

const toneClasses = {
  mint: "bg-mint-300",
  rose: "bg-rose-300",
  blue: "bg-blue-300",
  green: "bg-green-300",
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article
      className={cn(
        "group rounded-xl p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift",
        toneClasses[service.tone],
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-navy-900">
        <Icon aria-hidden className="h-8 w-8" />
      </div>
      <h3 className="mt-6 font-display text-xl font-medium text-navy-900">
        {service.title}
      </h3>
      <p className="mt-3 text-navy-900/80">{service.short}</p>
      <Link
        href={`/servicii/${service.slug}`}
        className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-navy-900 hover:underline hover:underline-offset-4"
      >
        Detalii serviciu
        <ArrowRight
          aria-hidden
          className="h-5 w-5 transition group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
