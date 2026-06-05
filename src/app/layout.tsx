import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";
import { body, display } from "./fonts";

export const metadata: Metadata = {
  title: "Prim Vet Iași | Cabinet veterinar",
  description:
    "Cabinet veterinar în Iași pentru consultații, vaccinare, prevenție, chirurgie de rutină și îngrijire atentă a animalelor de companie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
