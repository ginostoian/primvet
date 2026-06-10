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

export const phone = "0744 952 860";
export const emergencyPhone = "0744 952 860";
export const address = "Strada Sărărie 119, 700116 Iași";
export const mapsQuery = "Strada Sărărie 119, 700116 Iași";
export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  mapsQuery,
)}`;
export const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  mapsQuery,
)}&output=embed`;
export const clinicName = "Prim Vet Iași";
export const doctorName = "Conf. Dr. Sindilar Eusebiu Viorel";
export const doctorTitle =
  "medic veterinar ortoped, conferențiar universitar la Iași";
export const doctorExperience = "peste 30 de ani de experiență";

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
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
  visitSteps: string[];
  faqs: { question: string; answer: string }[];
  icon: Icon;
  tone: "mint" | "rose" | "blue" | "green";
};

export const services: Service[] = [
  {
    slug: "ortopedie-veterinara",
    title: "Ortopedie veterinară",
    short:
      "Evaluare ortopedică pentru șchiopătat, traumatisme, dureri articulare și recuperare.",
    description:
      "Consultații ortopedice pentru câini și pisici, coordonate de Conf. Dr. Sindilar Eusebiu Viorel, medic veterinar ortoped cu peste 30 de ani de experiență. Investigăm cauza durerii, explicăm opțiunile și construim un plan medical realist pentru mobilitate mai bună.",
    seoTitle: "Ortopedie veterinară Iași",
    seoDescription:
      "Ortopedie veterinară în Iași pentru câini și pisici: șchiopătat, traumatisme, fracturi, dureri articulare și controale postoperatorii.",
    highlights: [
      "Examinare clinică ortopedică și evaluarea mersului",
      "Plan pentru traumatisme, fracturi, luxații și dureri articulare",
      "Recomandări pentru investigații imagistice atunci când sunt necesare",
      "Monitorizare pentru recuperare și revenirea treptată la mișcare",
    ],
    visitSteps: [
      "Discutăm istoricul: debutul șchiopătatului, traumatisme, efort, tratamente anterioare.",
      "Evaluăm postura, mersul, mobilitatea articulațiilor și zonele dureroase.",
      "Stabilim investigațiile utile și explicăm diferența dintre tratament conservator și intervenție.",
      "Pleci cu indicații clare pentru repaus, medicație, control și semne care cer revenire rapidă.",
    ],
    faqs: [
      {
        question: "Când ar trebui programat un consult ortopedic?",
        answer:
          "Programează un consult dacă animalul șchiopătează, evită sprijinul pe un membru, are durere la ridicare, a suferit un traumatism sau refuză mișcarea obișnuită.",
      },
      {
        question: "Este nevoie mereu de radiografie?",
        answer:
          "Nu în toate cazurile. Radiografia sau alte investigații sunt recomandate după examinare, când pot schimba diagnosticul, planul de tratament sau monitorizarea recuperării.",
      },
      {
        question: "Pot veni pentru o a doua opinie ortopedică?",
        answer:
          "Da. Pentru o evaluare cât mai utilă, adu istoricul medical, radiografiile, analizele și tratamentele primite anterior.",
      },
    ],
    icon: FirstAidKit,
    tone: "blue",
  },
  {
    slug: "consultatii",
    title: "Consultații generale",
    short: "Evaluări complete, diagnostic diferențial și plan de tratament clar.",
    description:
      "Consultații veterinare pentru câini și pisici, de la simptome apărute brusc la controale periodice. Punem întrebările corecte, examinăm atent și explicăm pașii medicali pe înțelesul familiei.",
    seoTitle: "Consultații veterinare Iași",
    seoDescription:
      "Consultații veterinare în Iași pentru câini și pisici, diagnostic, tratamente și controale periodice explicate clar.",
    highlights: [
      "Examinare clinică atentă, adaptată vârstei și simptomelor",
      "Discuție despre apetit, comportament, durere și tratamente anterioare",
      "Recomandări pentru analize, imagistică sau tratament atunci când sunt indicate",
      "Plan scris sau explicat clar pentru monitorizarea de acasă",
    ],
    visitSteps: [
      "Începem cu istoricul complet și motivul vizitei.",
      "Examinăm pacientul și urmărim semnele care pot orienta diagnosticul.",
      "Discutăm opțiunile de investigație și tratament, inclusiv costurile orientative.",
      "Stabilim pașii următori: tratament, control, prevenție sau trimitere către investigații suplimentare.",
    ],
    faqs: [
      {
        question: "Cât durează o consultație veterinară?",
        answer:
          "Durata depinde de complexitatea cazului, dar rezervăm timp pentru examinare, întrebări și explicații medicale, nu doar pentru tratamentul rapid al simptomelor.",
      },
      {
        question: "Pot veni la consult fără programare?",
        answer:
          "Recomandăm programarea, pentru ca vizita să fie organizată și timpul de așteptare să fie redus. Pentru semne acute, sună înainte.",
      },
      {
        question: "Ce documente sunt utile la prima vizită?",
        answer:
          "Carnetul de sănătate, analizele, radiografiile, tratamentele primite și orice observații despre evoluția simptomelor.",
      },
    ],
    icon: Stethoscope,
    tone: "mint",
  },
  {
    slug: "vaccinare",
    title: "Vaccinare și deparazitare",
    short: "Scheme adaptate vârstei, stilului de viață și istoricului medical.",
    description:
      "Planuri preventive pentru pui și adulți, carnete de sănătate actualizate și recomandări pentru protecție sezonieră împotriva paraziților interni și externi.",
    seoTitle: "Vaccinare și deparazitare câini și pisici Iași",
    seoDescription:
      "Scheme de vaccinare și deparazitare în Iași pentru pui, câini adulți și pisici, cu rapeluri urmărite corect.",
    highlights: [
      "Scheme pentru pui, adulți, seniori și animale cu istoric incomplet",
      "Deparazitare internă și externă adaptată sezonului",
      "Carnet de sănătate actualizat și explicații despre rapeluri",
      "Recomandări pentru animale care călătoresc sau intră în colectivități",
    ],
    visitSteps: [
      "Verificăm vârsta, istoricul vaccinărilor și riscurile de expunere.",
      "Alegem schema potrivită și discutăm intervalele dintre rapeluri.",
      "Administrăm vaccinul sau deparazitarea doar după evaluarea stării generale.",
      "Notăm următoarea vizită și semnele normale sau anormale după administrare.",
    ],
    faqs: [
      {
        question: "Se poate vaccina un animal care pare bolnav?",
        answer:
          "Vaccinarea se face după evaluarea clinică. Dacă există febră, apatie sau simptome digestive, medicul poate recomanda amânarea.",
      },
      {
        question: "Cât de des se face deparazitarea?",
        answer:
          "Frecvența depinde de vârstă, greutate, stil de viață, sezon și riscul de expunere. Medicul stabilește schema potrivită după consult.",
      },
      {
        question: "Ce fac dacă am ratat un rapel?",
        answer:
          "Sună pentru reprogramare. În funcție de întârziere și vârsta animalului, schema poate continua sau poate fi ajustată.",
      },
    ],
    icon: Syringe,
    tone: "rose",
  },
  {
    slug: "chirurgie",
    title: "Chirurgie veterinară",
    short: "Proceduri planificate, pregătire atentă și recuperare ghidată.",
    description:
      "Intervenții uzuale realizate cu pregătire preoperatorie, monitorizare și indicații clare pentru îngrijirea de acasă. Punem accent pe siguranța pacientului și pe decizii chirurgicale explicate înainte de procedură.",
    seoTitle: "Chirurgie veterinară Iași",
    seoDescription:
      "Chirurgie veterinară în Iași pentru proceduri planificate, sterilizări, intervenții de țesuturi moi și recuperare ghidată.",
    highlights: [
      "Evaluare preoperatorie și recomandări pentru analize atunci când sunt necesare",
      "Explicații clare despre procedură, beneficii, riscuri și recuperare",
      "Monitorizare atentă înainte și după intervenție",
      "Instrucțiuni de acasă pentru durere, plagă, hrană și mișcare",
    ],
    visitSteps: [
      "Confirmăm indicația chirurgicală și starea generală a pacientului.",
      "Discutăm pregătirea: repaus alimentar, analize, tratamente și consimțământ.",
      "Realizăm procedura cu monitorizare și atenție la confortul pacientului.",
      "Stabilim controlul postoperator și semnele care trebuie anunțate imediat.",
    ],
    faqs: [
      {
        question: "De ce sunt importante analizele înainte de operație?",
        answer:
          "Analizele pot evidenția probleme care cresc riscul anestezic sau modifică protocolul medical, mai ales la seniori și pacienți cu afecțiuni cronice.",
      },
      {
        question: "Cât durează recuperarea după o intervenție?",
        answer:
          "Recuperarea variază în funcție de procedură, vârstă și starea generală. Primești instrucțiuni personalizate și un termen de control.",
      },
      {
        question: "Animalul primește tratament pentru durere?",
        answer:
          "Da. Controlul durerii este parte importantă din planul chirurgical și este adaptat fiecărui pacient.",
      },
    ],
    icon: FirstAidKit,
    tone: "green",
  },
  {
    slug: "stomatologie",
    title: "Stomatologie veterinară",
    short: "Detartraj, evaluare orală și prevenția problemelor dentare.",
    description:
      "Verificăm sănătatea cavității bucale și propunem îngrijire preventivă sau tratament atunci când există tartru, durere, respirație urât mirositoare ori inflamație.",
    seoTitle: "Stomatologie veterinară Iași | Detartraj câini și pisici",
    seoDescription:
      "Stomatologie veterinară în Iași: detartraj, evaluare orală, prevenția durerii dentare și recomandări pentru îngrijirea acasă.",
    highlights: [
      "Evaluarea gingiilor, dinților și respirației",
      "Recomandări pentru detartraj și igienă orală",
      "Identificarea semnelor de durere sau inflamație",
      "Plan de prevenție pentru câini și pisici predispuși la tartru",
    ],
    visitSteps: [
      "Evaluăm cavitatea bucală și istoricul problemelor dentare.",
      "Explicăm dacă este nevoie de igienizare profesională sau tratament.",
      "Discutăm pregătirea și monitorizarea atunci când procedura necesită anestezie.",
      "Recomandăm pași realiști pentru îngrijirea dentară acasă.",
    ],
    faqs: [
      {
        question: "Respirația urât mirositoare este normală?",
        answer:
          "Nu ar trebui ignorată. Poate indica tartru, gingivită, durere dentară sau alte probleme care merită evaluate.",
      },
      {
        question: "Detartrajul se face cu anestezie?",
        answer:
          "În multe cazuri, da, pentru curățare corectă și siguranța pacientului. Medicul explică recomandarea după evaluare.",
      },
      {
        question: "Cum previn reapariția tartrului?",
        answer:
          "Prin controale periodice, hrană sau produse potrivite și obiceiuri de igienă adaptate temperamentului animalului.",
      },
    ],
    icon: Tooth,
    tone: "mint",
  },
  {
    slug: "analize",
    title: "Analize și monitorizare",
    short: "Investigații utile pentru diagnostic și urmărirea tratamentelor.",
    description:
      "Recomandăm analize țintite pentru decizii medicale mai bune, mai ales în cazul animalelor senior, al pacienților cu afecțiuni cronice sau înaintea intervențiilor.",
    seoTitle: "Analize veterinare Iași",
    seoDescription:
      "Analize veterinare și monitorizare în Iași pentru diagnostic, controale preventive, pacienți seniori și tratamente cronice.",
    highlights: [
      "Analize recomandate în funcție de simptome, nu la întâmplare",
      "Monitorizare pentru boli cronice și pacienți seniori",
      "Evaluare preoperatorie atunci când este indicată",
      "Interpretare explicată pe înțelesul stăpânului",
    ],
    visitSteps: [
      "Stabilim întrebarea medicală la care trebuie să răspundă analizele.",
      "Recoltăm sau recomandăm investigațiile potrivite cazului.",
      "Interpretăm rezultatele în contextul consultației și istoricului.",
      "Ajustăm tratamentul sau planul de monitorizare.",
    ],
    faqs: [
      {
        question: "Când sunt recomandate analizele de sânge?",
        answer:
          "Sunt utile în simptome nespecifice, înainte de anestezie, la seniori sau pentru monitorizarea tratamentelor și bolilor cronice.",
      },
      {
        question: "Trebuie animalul nemâncat înainte de analize?",
        answer:
          "Uneori da. Pentru anumite analize se recomandă repaus alimentar; confirmăm telefonic înainte de programare.",
      },
      {
        question: "Primesc explicații pentru rezultate?",
        answer:
          "Da. Rezultatele sunt corelate cu starea pacientului, iar recomandările sunt explicate clar.",
      },
    ],
    icon: Scales,
    tone: "rose",
  },
  {
    slug: "urgente",
    title: "Îndrumare pentru urgențe",
    short: "Triaj telefonic și recomandări rapide pentru situații critice.",
    description:
      "Pentru situații acute, oferim triaj telefonic, indicații de prim pas și direcționare către opțiunea potrivită atunci când cazul are nevoie de intervenție rapidă.",
    seoTitle: "Urgențe veterinare Iași",
    seoDescription:
      "Îndrumare pentru urgențe veterinare în Iași: traumatisme, dificultăți de respirație, convulsii, sângerări și simptome acute.",
    highlights: [
      "Triaj telefonic pentru simptome acute",
      "Prioritizarea cazurilor cu risc vital",
      "Instrucțiuni de prim pas până la consult",
      "Direcționare rapidă când este nevoie de serviciu de urgență",
    ],
    visitSteps: [
      "Sună și descrie pe scurt semnele: respirație, traumă, sângerare, convulsii, intoxicație.",
      "Primești indicații imediate despre transport și ce să nu faci acasă.",
      "Stabilim dacă pacientul poate veni la cabinet sau trebuie direcționat către urgență non-stop.",
      "După stabilizare, planificăm investigații și monitorizare.",
    ],
    faqs: [
      {
        question: "Ce semne sunt urgențe reale?",
        answer:
          "Dificultăți de respirație, traumatisme, convulsii, sângerări, abdomen mărit brusc, intoxicații, imposibilitatea urinării și apatie severă cer contact imediat.",
      },
      {
        question: "De ce trebuie să sun înainte?",
        answer:
          "Telefonul ajută la triaj, pregătirea vizitei și direcționarea rapidă dacă pacientul are nevoie de resurse disponibile în altă parte.",
      },
      {
        question: "Pot administra medicamente umane până ajung?",
        answer:
          "Nu administra medicamente fără recomandare veterinară. Unele substanțe uzuale pentru oameni pot fi toxice pentru câini sau pisici.",
      },
    ],
    icon: Clock,
    tone: "blue",
  },
];

export const actionCards = [
  {
    title: "Programare rapidă",
    text: "Trimite simptomele, istoricul și serviciul dorit. Te contactăm pentru confirmare.",
    href: "/contact",
    icon: CalendarBlank,
    tone: "mint",
  },
  {
    title: "Ortopedie veterinară",
    text: "Consult pentru șchiopătat, traumatisme, fracturi, dureri articulare și recuperare.",
    href: "/servicii/ortopedie-veterinara",
    icon: ShieldCheck,
    tone: "blue",
  },
  {
    title: "Găsește-ne în Iași",
    text: "Vezi programul, adresa și variantele rapide de contact pentru Prim Vet.",
    href: "/contact",
    icon: MapPin,
    tone: "rose",
  },
];

export const reasons = [
  {
    title: "Autoritate medicală reală",
    text: `${doctorName} este ${doctorTitle}, cu ${doctorExperience}.`,
    icon: Heart,
  },
  {
    title: "Diagnostic înainte de tratament",
    text: "Fiecare recomandare pornește de la istoric, examinare și investigații utile cazului.",
    icon: ShieldCheck,
  },
  {
    title: "Explicații fără grabă",
    text: "Primești opțiuni, riscuri, costuri orientative și pași următori într-un limbaj clar.",
    icon: PawPrint,
  },
  {
    title: "Prevenție și recuperare",
    text: "Planificăm controale, vaccinuri, monitorizare ortopedică și îngrijire pe termen lung.",
    icon: CalendarBlank,
  },
];

export const articles = [
  {
    slug: "schema-vaccinare-caini-pisici",
    title: "Schema de vaccinare la câini și pisici",
    excerpt:
      "Ce contează la pui, adulți și animale care au ratat rapelurile, fără promisiuni sau scheme aplicate mecanic.",
    tone: "mint",
    readTime: "4 min",
    sections: [
      {
        title: "De ce schema trebuie personalizată",
        text: "Vârsta, istoricul medical, mediul în care trăiește animalul și contactul cu alte animale schimbă modul în care se construiește prevenția. O schemă bună nu înseamnă doar o injecție, ci verificarea stării generale și planificarea rapelurilor.",
      },
      {
        title: "Ce aduci la cabinet",
        text: "Carnetul de sănătate, informații despre deparazitări, eventuale reacții anterioare și data ultimului vaccin ajută medicul să evite suprapuneri sau întârzieri importante.",
      },
      {
        title: "Când amâni vaccinarea",
        text: "Dacă apar febră, apatie, vărsături, diaree sau alte semne acute, vaccinarea poate fi amânată până când pacientul este stabil. Decizia se ia după consult.",
      },
    ],
  },
  {
    slug: "semne-care-cer-consult",
    title: "Semne care cer un consult rapid",
    excerpt:
      "Schimbări de apetit, apatie, vărsături, dureri sau șchiopătat care nu trebuie amânate.",
    tone: "rose",
    readTime: "5 min",
    sections: [
      {
        title: "Semne generale care contează",
        text: "Apatia severă, refuzul hranei, vărsăturile repetate, diareea cu sânge, febra sau schimbările bruște de comportament pot indica probleme care au nevoie de evaluare medicală.",
      },
      {
        title: "Semne ortopedice",
        text: "Șchiopătatul, refuzul sprijinului pe un membru, durerea la ridicare, mersul rigid sau umflarea unei articulații merită consult, mai ales după traumatisme sau efort intens.",
      },
      {
        title: "Când suni imediat",
        text: "Dificultățile de respirație, convulsiile, sângerările, suspiciunea de intoxicație, imposibilitatea urinării sau traumatismele cer contact rapid înainte de transport.",
      },
    ],
  },
  {
    slug: "ingrijire-dentara-acasa",
    title: "Îngrijirea dentară acasă",
    excerpt:
      "Obiceiuri simple care reduc tartrul, respirația urât mirositoare și disconfortul oral.",
    tone: "blue",
    readTime: "3 min",
    sections: [
      {
        title: "Începe cu evaluarea orală",
        text: "Înainte de produse sau periaj, este important să știm dacă există tartru, gingivită, durere sau dinți mobili. Unele probleme nu se rezolvă doar prin îngrijire acasă.",
      },
      {
        title: "Alege obiceiuri realiste",
        text: "Periajul progresiv, recompensele dentare potrivite și controalele periodice pot ajuta, dar planul trebuie adaptat temperamentului animalului și riscului de tartru.",
      },
      {
        title: "Nu ignora durerea",
        text: "Mestecatul pe o singură parte, refuzul hranei tari, salivarea sau respirația urât mirositoare persistentă sunt motive bune pentru consult.",
      },
    ],
  },
];
