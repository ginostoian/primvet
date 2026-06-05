import type { Icon } from "@phosphor-icons/react";
import {
  CalendarBlank,
  Clock,
  FirstAidKit,
  Heart,
  MapPin,
  PawPrint,
  Scales,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Tooth,
} from "@phosphor-icons/react/dist/ssr";

export const phone = "07XX XXX XXX";
export const emergencyPhone = "07XX XXX XXX";
export const address = "Iași, România";

export const navLinks = [
  { href: "/servicii", label: "Servicii" },
  { href: "/preturi", label: "Prețuri" },
  { href: "/sfaturi", label: "Sfaturi" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: Icon;
  tone: "mint" | "rose" | "blue" | "green";
};

export const services: Service[] = [
  {
    slug: "consultatii",
    title: "Consultații generale",
    short: "Evaluări complete, diagnostic și plan de tratament clar.",
    description:
      "Consultații pentru câini și pisici, de la simptome acute la controale periodice. Explicăm pașii medicali pe înțelesul stăpânilor.",
    icon: Stethoscope,
    tone: "mint",
  },
  {
    slug: "vaccinare",
    title: "Vaccinare și deparazitare",
    short: "Scheme adaptate vârstei, stilului de viață și istoricului medical.",
    description:
      "Planuri preventive pentru pui și adulți, carnete de sănătate actualizate și recomandări pentru protecție sezonieră.",
    icon: Syringe,
    tone: "rose",
  },
  {
    slug: "chirurgie",
    title: "Chirurgie de rutină",
    short: "Proceduri planificate, monitorizare atentă și recuperare ghidată.",
    description:
      "Intervenții uzuale realizate cu grijă, pregătire preoperatorie și indicații clare pentru îngrijirea de acasă.",
    icon: FirstAidKit,
    tone: "blue",
  },
  {
    slug: "stomatologie",
    title: "Stomatologie veterinară",
    short: "Detartraj, evaluare orală și prevenția problemelor dentare.",
    description:
      "Verificăm sănătatea cavității bucale și propunem îngrijire preventivă sau tratament atunci când există durere ori inflamație.",
    icon: Tooth,
    tone: "green",
  },
  {
    slug: "analize",
    title: "Analize și monitorizare",
    short: "Investigații utile pentru diagnostic și urmărirea tratamentelor.",
    description:
      "Recomandăm analize țintite pentru decizii medicale mai bune, mai ales în cazul animalelor senior sau cu afecțiuni cronice.",
    icon: Scales,
    tone: "mint",
  },
  {
    slug: "urgente",
    title: "Îndrumare pentru urgențe",
    short: "Triaj telefonic și recomandări rapide pentru situații critice.",
    description:
      "În afara programului, oferim indicații de prim pas și direcționare către servicii potrivite pentru urgențe majore.",
    icon: Clock,
    tone: "rose",
  },
];

export const actionCards = [
  {
    title: "Programează online",
    text: "Alege serviciul potrivit și trimite-ne detaliile vizitei.",
    href: "/contact",
    icon: CalendarBlank,
    tone: "mint",
  },
  {
    title: "Prim Card",
    text: "Îngrijire preventivă cu beneficii clare pentru companionul tău.",
    href: "/preturi",
    icon: ShieldCheck,
    tone: "rose",
  },
  {
    title: "Găsește-ne în Iași",
    text: "Vezi programul, adresa și variantele rapide de contact.",
    href: "/contact",
    icon: MapPin,
    tone: "blue",
  },
];

export const reasons = [
  {
    title: "Medicină explicată clar",
    text: "Primești opțiuni, costuri orientative și pași următori fără limbaj inutil de complicat.",
    icon: Heart,
  },
  {
    title: "Prevenție pe termen lung",
    text: "Controale, vaccinuri și recomandări adaptate etapei de viață a animalului.",
    icon: ShieldCheck,
  },
  {
    title: "Cabinet primitor",
    text: "Un spațiu calm, curat și gândit pentru vizite mai puțin stresante.",
    icon: PawPrint,
  },
  {
    title: "Programări eficiente",
    text: "Organizăm vizitele astfel încât timpul de așteptare să fie redus.",
    icon: CalendarBlank,
  },
];

export const articles = [
  {
    slug: "schema-vaccinare-caini-pisici",
    title: "Cum pregătești schema de vaccinare",
    excerpt:
      "Ce contează la pui, adulți și animale care au ratat rapelurile.",
    tone: "mint",
    readTime: "4 min",
  },
  {
    slug: "semne-care-cer-consult",
    title: "Semne care cer un consult rapid",
    excerpt:
      "Schimbări de apetit, apatie, vărsături sau dureri care nu trebuie amânate.",
    tone: "rose",
    readTime: "5 min",
  },
  {
    slug: "ingrijire-dentara-acasa",
    title: "Îngrijirea dentară acasă",
    excerpt:
      "Obiceiuri simple care reduc tartrul și disconfortul oral.",
    tone: "blue",
    readTime: "3 min",
  },
];
