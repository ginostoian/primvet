import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarBlank,
  CheckCircle,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

import { ContactPanel } from "@/components/contact-panel";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import {
  actionCards,
  articles,
  phone,
  reasons,
  services,
} from "@/lib/site-data";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  mint: "bg-mint-300",
  rose: "bg-rose-300",
  blue: "bg-blue-300",
  green: "bg-green-300",
};

export default function Home() {
  return (
    <>
      <section className="bg-white pb-10 pt-6 md:pb-14">
        <div className="container-content">
          <div className="relative isolate min-h-[610px] overflow-hidden rounded-[2.25rem] bg-brand-600 px-6 py-8 text-white shadow-lift md:min-h-[670px] md:px-12 lg:px-16">
            <div className="relative z-50 flex items-start justify-between gap-6">
              <Link href="/" className="flex items-center gap-3 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-brand-600">
                  PV
                </span>
                <span className="font-display text-3xl font-semibold">
                  Prim Vet
                </span>
              </Link>
              <div className="hidden gap-3 lg:flex">
                <Button asChild variant="light" size="lg">
                  <Link href="/contact">Găsește cabinetul</Link>
                </Button>
                <Button asChild variant="light" size="lg">
                  <Link href="/contact">Programează</Link>
                </Button>
              </div>
            </div>

            <div className="relative z-40 mt-24 max-w-[520px] md:mt-36">
              <h1 className="font-display text-[3.7rem] font-semibold leading-[0.96] text-white sm:text-[4.8rem] md:text-[5.8rem] lg:text-[6rem]">
                Pentru animale, pe viață
              </h1>
              <p className="mt-8 max-w-[45ch] text-xl text-white/88">
                Cabinet veterinar în Iași pentru consultații, prevenție și
                îngrijire clar explicată.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:hidden">
                <Button asChild variant="light" size="lg">
                  <Link href="/contact">
                    <CalendarBlank aria-hidden className="h-5 w-5" />
                    Programează o vizită
                  </Link>
                </Button>
                <Button asChild variant="light" size="lg">
                  <a href={`tel:${phone.replaceAll(" ", "")}`}>
                    <Phone aria-hidden className="h-5 w-5" />
                    Sună-ne
                  </a>
                </Button>
              </div>
            </div>

            <div className="absolute bottom-[-12%] right-[-35%] top-[67%] z-10 w-[115%] rounded-t-full bg-lavender md:right-[-22%] md:top-[18%] md:w-[72%] md:rounded-l-full md:rounded-tr-none lg:right-[-18%] lg:w-[58%]">
              <div className="absolute right-[-25%] top-[22%] z-10 h-64 w-64 rounded-full bg-brand-600 lg:h-80 lg:w-80" />
              <div className="absolute right-[26%] top-[5%] z-10 hidden h-28 w-28 rotate-45 bg-brand-600 lg:block [clip-path:polygon(0_0,100%_32%,44%_100%)]" />
              <Image
                src="/images/prim-vet-dog-hero.png"
                alt="Câine prietenos fotografiat frontal pentru Prim Vet"
                width={720}
                height={900}
                priority
                sizes="(min-width: 1024px) 38vw, 76vw"
                className="absolute bottom-[3%] left-[18%] z-20 w-[54%] max-w-[480px] object-contain md:bottom-[2%] md:left-[20%] md:w-[62%] lg:left-[23%] lg:w-[66%]"
              />
            </div>
            <div className="absolute bottom-[-18%] right-[3%] z-20 hidden h-[420px] w-[420px] rounded-full bg-white/25 lg:block" />
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-content grid gap-6 lg:grid-cols-3">
          {actionCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className={cn(
                  "group min-h-[230px] rounded-[2rem] p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift",
                  toneClasses[card.tone],
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-navy-900">
                  <Icon aria-hidden className="h-8 w-8" />
                </div>
                <h2 className="mt-7 font-display text-2xl font-semibold text-navy-900">
                  {card.title}
                </h2>
                <p className="mt-3 text-navy-900/80">{card.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-900">
                  Continuă
                  <ArrowRight
                    aria-hidden
                    className="h-5 w-5 transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-cloud py-section">
        <div className="container-content">
          <SectionHeading
            eyebrow="Servicii"
            title="Îngrijire veterinară pentru fiecare etapă"
            text="De la prima schemă de vaccinare până la controale pentru seniori, Prim Vet pune accent pe prevenție, diagnostic clar și tratamente explicate."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-content">
          <h2 className="mx-auto max-w-[950px] text-center font-display text-[3.4rem] font-semibold leading-none text-navy-900 md:text-[5.8rem]">
            De ce au încredere stăpânii în noi
          </h2>
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="grid gap-5">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.title}
                  className="flex min-h-[96px] items-center gap-6 rounded-[1.5rem] bg-lavender p-5"
                >
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[1.25rem] bg-brand-600 text-white">
                    <Icon aria-hidden className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{reason.text}</p>
                  </div>
                </article>
              );
            })}
            </div>
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src="/images/prim-vet-hero.png"
                alt="Medic veterinar examinând cu grijă un câine"
                width={920}
                height={760}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-rose-300 py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-navy-700">
              Prim Card
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 md:text-4xl">
              Prevenție planificată, costuri mai ușor de anticipat
            </h2>
            <p className="mt-5 max-w-[62ch] text-lg text-navy-900/80">
              Un abonament de îngrijire pentru controale periodice, vaccinuri,
              deparazitări și beneficii la servicii uzuale.
            </p>
            <Button asChild className="mt-8">
              <Link href="/preturi">
                Vezi beneficiile
                <ArrowRight aria-hidden className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <ul className="grid gap-5">
              {[
                "Control anual inclus",
                "Plan de vaccinare urmărit",
                "Reduceri la servicii preventive",
                "Reminder pentru vizitele importante",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-navy-900">
                  <CheckCircle
                    aria-hidden
                    weight="fill"
                    className="mt-1 h-6 w-6 shrink-0 text-green-500"
                  />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-content">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-display text-[3.2rem] font-semibold leading-none text-navy-900 md:text-[5rem]">
              Ghidul tău pentru îngrijire mai bună
            </h2>
            <p className="mx-auto mt-6 max-w-[58ch] text-xl text-navy-900">
              Sfaturi de la cabinet pentru prevenție, simptome comune și decizii
              mai bune acasă.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
            {articles.slice(0, 1).map((article) => (
              <Link
                key={article.slug}
                href={`/sfaturi/${article.slug}`}
                className={cn(
                  "group relative min-h-[620px] overflow-hidden rounded-[2rem] p-8 shadow-lift transition-all duration-300 ease-smooth hover:-translate-y-1",
                  toneClasses[article.tone],
                )}
              >
                <span className="text-base font-bold text-navy-900">Articol</span>
                <div className="mt-7 h-px bg-navy-900/70" />
                <h3 className="mt-12 max-w-[10ch] font-display text-[3.25rem] font-semibold leading-tight text-navy-900">
                  {article.title}
                </h3>
                <span className="mt-12 inline-flex min-h-12 items-center rounded-pill border-2 border-navy-900 px-7 font-semibold text-navy-900">
                  Citește
                </span>
                <div className="absolute bottom-[-18%] right-[-8%] h-[360px] w-[540px] rounded-t-full bg-white/40" />
                <Image
                  src="/images/prim-vet-dog-hero.png"
                  alt="Câine prietenos"
                  width={420}
                  height={520}
                  className="absolute bottom-[-4%] right-[6%] w-[42%] max-w-[270px] object-contain"
                />
              </Link>
            ))}
            <div className="grid gap-6">
              {articles.slice(1).map((article) => (
                <Link
                  key={article.slug}
                  href={`/sfaturi/${article.slug}`}
                  className={cn(
                    "grid min-h-[285px] overflow-hidden rounded-[2rem] shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift md:grid-cols-[0.72fr_1.28fr]",
                    toneClasses[article.tone],
                  )}
                >
                  <div className="relative min-h-[210px] bg-white/25">
                    <Image
                      src={
                        article.tone === "rose"
                          ? "/images/prim-vet-hero.png"
                          : "/images/prim-vet-dog-hero.png"
                      }
                      alt={article.title}
                      fill
                      sizes="(min-width: 768px) 20vw, 80vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-base font-bold text-navy-900">
                      Articol
                    </span>
                    <div className="mt-6 h-px bg-navy-900/70" />
                    <h3 className="mt-8 font-display text-3xl font-semibold leading-tight text-navy-900">
                      {article.title}
                    </h3>
                    <span className="mt-10 inline-flex min-h-12 items-center rounded-pill border-2 border-navy-900 px-7 font-semibold text-navy-900">
                      Citește
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-section text-white">
        <div className="container-content grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/prim-vet-hero.png"
              alt="Spațiu veterinar luminos și prietenos"
              width={920}
              height={680}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-mint-300">
              Despre cabinet
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
              Aproape de stăpâni, atent cu fiecare pacient
            </h2>
            <p className="mt-5 max-w-[62ch] text-lg text-white/78">
              Prim Vet este construit ca un cabinet de cartier cu standarde
              moderne: consultații atente, prevenție bine planificată și
              comunicare directă cu familia animalului.
            </p>
            <Button asChild variant="accent" className="mt-8">
              <Link href="/despre">
                Află mai multe
                <ArrowRight aria-hidden className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ContactPanel />
    </>
  );
}
