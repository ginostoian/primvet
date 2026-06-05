import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { articles } from "@/lib/site-data";

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
    title: article ? `${article.title} | Prim Vet Iași` : "Sfaturi Prim Vet",
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
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
        <div className="mt-10 rounded-2xl bg-white p-8 text-slate-600 shadow-card">
          <p>
            Acest articol este pregătit ca structură editorială pentru site.
            Conținutul medical final trebuie validat de medicul veterinar înainte
            de publicare.
          </p>
          <p className="mt-5">
            Pentru simptome acute, durere, apatie severă, vărsături repetate sau
            dificultăți de respirație, contactează cabinetul cât mai rapid.
          </p>
        </div>
      </div>
    </article>
  );
}
