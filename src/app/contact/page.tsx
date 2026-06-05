import { ContactPanel } from "@/components/contact-panel";
import { SectionHeading } from "@/components/section-heading";

export default function ContactPage() {
  return (
    <>
      <section className="bg-white py-section">
        <div className="container-content">
          <SectionHeading
            eyebrow="Contact"
            title="Programează o vizită la Prim Vet"
            text="Trimite-ne câteva detalii, sună direct sau vino după confirmarea programării."
          />
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
