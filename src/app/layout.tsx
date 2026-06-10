import type { Metadata } from "next";

import "./globals.css";
import { body, display } from "./fonts";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prim Vet Iași | Cabinet veterinar și ortopedie veterinară",
    template: "%s | Prim Vet Iași",
  },
  description:
    "Cabinet veterinar în Iași pentru ortopedie veterinară, consultații, vaccinare, prevenție, chirurgie, stomatologie și îngrijire atentă a animalelor de companie.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Prim Vet Iași | Cabinet veterinar și ortopedie veterinară",
    description:
      "Consultații, ortopedie veterinară, prevenție și chirurgie pentru câini și pisici în Iași.",
    url: absoluteUrl("/"),
    siteName: "Prim Vet Iași",
    locale: "ro_RO",
    type: "website",
    images: [absoluteUrl("/images/prim-vet-hero.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
