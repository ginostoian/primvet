import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessSchema, JsonLd, websiteSchema } from "@/lib/seo";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={[businessSchema, websiteSchema]} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
