import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { ContactPanel } from "@/components/contact-panel";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site-data";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  return {
    title: service ? `${service.title} | Prim Vet Iași` : "Serviciu Prim Vet",
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <>
      <section className="bg-cloud py-section-lg">
        <div className="container-content grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-navy-700">
              Serviciu Prim Vet
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-navy-900 md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-[62ch] text-lg text-slate-600">
              {service.description}
            </p>
            <Button asChild className="mt-8">
              <Link href="/contact">
                Programează o vizită
                <ArrowRight aria-hidden className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-300 text-navy-900">
              <Icon aria-hidden className="h-9 w-9" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold text-navy-900">
              Ce include vizita
            </h2>
            <ul className="mt-6 grid gap-4">
              {[
                "Evaluare inițială și istoric medical",
                "Recomandări explicate pe înțelesul stăpânului",
                "Plan de tratament sau prevenție",
                "Pași clari pentru monitorizarea acasă",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-slate-600">
                  <CheckCircle
                    aria-hidden
                    weight="fill"
                    className="mt-1 h-5 w-5 shrink-0 text-green-500"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
