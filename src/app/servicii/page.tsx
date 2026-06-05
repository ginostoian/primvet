import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <section className="bg-cloud py-section-lg">
      <div className="container-content">
        <SectionHeading
          eyebrow="Servicii"
          title="Servicii veterinare Prim Vet"
          text="Consultații, prevenție, tratamente și îndrumare pentru situațiile în care animalul tău are nevoie de atenție rapidă."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
