import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/site-data";
import {
  breadcrumbSchema,
  JsonLd,
  pageSchema,
  servicesItemListSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Servicii veterinare",
  description:
    "Servicii veterinare în Iași: ortopedie veterinară, consultații, vaccinare, chirurgie, stomatologie, analize și îndrumare pentru urgențe.",
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            path: "/servicii",
            title: "Servicii veterinare Prim Vet Iași",
            description:
              "Servicii veterinare în Iași pentru câini și pisici, cu accent pe ortopedie, consultații, prevenție, chirurgie și monitorizare.",
          }),
          servicesItemListSchema(),
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Servicii", path: "/servicii" },
          ]),
        ]}
      />
      <section className="bg-cloud py-section-lg">
        <div className="container-content">
          <SectionHeading
            eyebrow="Servicii"
            title="Servicii veterinare Prim Vet"
            text="Consultații, ortopedie veterinară, prevenție, chirurgie, stomatologie și monitorizare pentru situațiile în care animalul tău are nevoie de atenție medicală serioasă."
            titleAs="h1"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
