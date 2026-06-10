import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { ContactPanel } from "@/components/contact-panel";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site-data";
import {
  breadcrumbSchema,
  faqSchema,
  JsonLd,
  pageSchema,
  serviceSchema,
} from "@/lib/seo";

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
    title: service ? service.seoTitle : "Serviciu Prim Vet",
    description: service?.seoDescription,
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
      <JsonLd
        data={[
          pageSchema({
            path: `/servicii/${service.slug}`,
            title: service.seoTitle,
            description: service.seoDescription,
          }),
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Servicii", path: "/servicii" },
            { name: service.title, path: `/servicii/${service.slug}` },
          ]),
        ]}
      />
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
              {service.highlights.map((item) => (
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
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-navy-700">
              Proces medical
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 md:text-4xl">
              Cum decurge vizita
            </h2>
            <p className="mt-5 text-slate-600">
              Scopul este să primești un răspuns medical clar, nu doar o listă
              de opțiuni. Fiecare recomandare este legată de ce observăm la
              pacient și de ce se poate face realist acasă.
            </p>
          </div>
          <ol className="grid gap-4">
            {service.visitSteps.map((step, index) => (
              <li
                key={step}
                className="grid gap-4 rounded-xl bg-cloud p-6 shadow-soft sm:grid-cols-[3rem_1fr]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-cloud py-section">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase text-navy-700">
            Întrebări frecvente
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 md:text-4xl">
            Răspunsuri înainte de programare
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {service.faqs.map((faq) => (
              <article key={faq.question} className="rounded-xl bg-white p-6 shadow-card">
                <h3 className="text-lg font-bold text-navy-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
