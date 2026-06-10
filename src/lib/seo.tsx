import {
  address,
  articles,
  clinicName,
  doctorExperience,
  doctorName,
  doctorTitle,
  phone,
  services,
} from "@/lib/site-data";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://primvet.ro";

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function cleanPhone(value: string) {
  return value.includes("X") ? undefined : value.replaceAll(" ", "");
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const doctorSchema = {
  "@type": "Person",
  "@id": absoluteUrl("/despre#dr-sindilar-eusebiu-viorel"),
  name: doctorName,
  jobTitle: doctorTitle,
  description: `${doctorName} este ${doctorTitle}, cu ${doctorExperience}, concentrat pe ortopedie veterinară, evaluarea durerii și recuperarea mobilității la câini și pisici.`,
  worksFor: { "@id": absoluteUrl("/#clinica") },
  knowsAbout: [
    "ortopedie veterinară",
    "chirurgie veterinară",
    "traumatisme la câini și pisici",
    "dureri articulare",
    "recuperare medicală veterinară",
  ],
};

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["VeterinaryCare", "MedicalBusiness", "LocalBusiness"],
  "@id": absoluteUrl("/#clinica"),
  name: clinicName,
  url: siteUrl,
  image: absoluteUrl("/images/prim-vet-hero.png"),
  description:
    "Prim Vet Iași este un cabinet veterinar pentru consultații, ortopedie veterinară, prevenție, chirurgie, stomatologie și monitorizare medicală pentru câini și pisici.",
  telephone: cleanPhone(phone),
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Iași",
    addressRegion: "Iași",
    addressCountry: "RO",
    streetAddress: address,
  },
  areaServed: [
    { "@type": "City", name: "Iași" },
    { "@type": "AdministrativeArea", name: "Județul Iași" },
  ],
  medicalSpecialty: [
    "Veterinary medicine",
    "Veterinary orthopedics",
    "Preventive veterinary care",
    "Veterinary surgery",
  ],
  employee: doctorSchema,
  founder: doctorSchema,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      description: "Cu programare",
    },
  ],
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.description,
      url: absoluteUrl(`/servicii/${service.slug}`),
    },
  })),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: clinicName,
  url: siteUrl,
  inLanguage: "ro-RO",
  publisher: { "@id": absoluteUrl("/#clinica") },
};

export function pageSchema({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "ro-RO",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#clinica") },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(service: (typeof services)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${absoluteUrl(`/servicii/${service.slug}`)}#serviciu`,
    name: service.title,
    description: service.description,
    url: absoluteUrl(`/servicii/${service.slug}`),
    provider: { "@id": absoluteUrl("/#clinica") },
    medicalSpecialty:
      service.slug === "ortopedie-veterinara"
        ? "Veterinary orthopedics"
        : "Veterinary medicine",
    procedureType: service.title,
    howPerformed: service.visitSteps.join(" "),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function servicesItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicii veterinare Prim Vet Iași",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: absoluteUrl(`/servicii/${service.slug}`),
    })),
  };
}

export function articleSchema(article: (typeof articles)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/sfaturi/${article.slug}`)}#articol`,
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(`/sfaturi/${article.slug}`),
    inLanguage: "ro-RO",
    author: doctorSchema,
    publisher: { "@id": absoluteUrl("/#clinica") },
    mainEntityOfPage: {
      "@id": `${absoluteUrl(`/sfaturi/${article.slug}`)}#webpage`,
    },
  };
}
