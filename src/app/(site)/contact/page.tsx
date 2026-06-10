import type { Metadata } from "next";

import { ContactPanel } from "@/components/contact-panel";
import { SectionHeading } from "@/components/section-heading";
import { breadcrumbSchema, JsonLd, pageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact și programări",
  description:
    "Programează o vizită la Prim Vet Iași pentru consultații, ortopedie veterinară, vaccinare, chirurgie sau monitorizare medicală.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/contact",
            title: "Contact Prim Vet Iași",
            description:
              "Contact și programări la Prim Vet Iași pentru consultații, ortopedie veterinară, prevenție, chirurgie și îngrijire pentru câini și pisici.",
          }),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <section className="bg-white py-section">
        <div className="container-content">
          <SectionHeading
            eyebrow="Contact"
            title="Programează o vizită la Prim Vet"
            text="Trimite-ne câteva detalii despre companionul tău, mai ales dacă este vorba despre durere, șchiopătat, traumă sau simptome apărute brusc. Confirmăm programarea și îți spunem ce documente sunt utile."
            titleAs="h1"
          />
        </div>
      </section>
      <ContactPanel sent={params.sent === "1"} />
    </>
  );
}
