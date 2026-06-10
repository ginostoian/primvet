import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { articles } from "@/lib/site-data";
import { articleSchema, breadcrumbSchema, JsonLd, pageSchema } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  return {
    title: article ? article.title : "Sfaturi Prim Vet",
    description: article?.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: `/sfaturi/${article.slug}`,
            title: article.title,
            description: article.excerpt,
          }),
          articleSchema(article),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Sfaturi", path: "/sfaturi" },
            { name: article.title, path: `/sfaturi/${article.slug}` },
          ]),
        ]}
      />
      <article className="bg-cloud py-section-lg">
        <div className="container-content max-w-[860px]">
          <Button asChild variant="ghost">
            <Link href="/sfaturi">
              <ArrowLeft aria-hidden className="h-5 w-5" />
              Înapoi la sfaturi
            </Link>
          </Button>
          <p className="mt-8 text-sm font-semibold uppercase text-navy-700">
            {article.readTime} citire
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-navy-900 md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-slate-600">{article.excerpt}</p>
          <div className="mt-10 grid gap-5">
            {article.sections.map((section) => (
              <section key={section.title} className="rounded-2xl bg-white p-8 shadow-card">
                <h2 className="font-display text-2xl font-semibold text-navy-900">
                  {section.title}
                </h2>
                <p className="mt-4 text-slate-600">{section.text}</p>
              </section>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-rose-300 bg-white p-6 text-slate-600 shadow-soft">
            <p className="font-semibold text-navy-900">
              Informație medicală orientativă
            </p>
            <p className="mt-3">
              Articolul nu înlocuiește consultația. Pentru simptome acute,
              durere, apatie severă, vărsături repetate, traumatisme sau
              dificultăți de respirație, contactează cabinetul cât mai rapid.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
