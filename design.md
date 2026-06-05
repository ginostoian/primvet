# Prim Vet — Design System & Spec

Sistem de design pentru website-ul cabinetului veterinar **Prim Vet** (Iași), construit în **Next.js (App Router)** + **Tailwind CSS**. Direcția vizuală este inspirată de CVS Vets: profesionist, cald, de încredere, cu un navy bogat ca ancoră și accente pastel (mint, rose, blue) care fac brandul prietenos fără să-l facă infantil.

> Notă: valorile de mai jos sunt o reinterpretare a sistemului CVS Vets, nu o copie exactă pixel cu pixel. Sunt rotunjite și organizate ca tokens reutilizabili.

---

## 1. Principii de design

1. **Cald, dar profesional** — navy serios ca bază, pastelurile aduc empatie. Sănătatea animalelor e treabă serioasă, dar nu rece.
2. **Claritate înainte de decor** — ierarhie tipografică puternică, mult whitespace, CTA-uri evidente (Programează / Găsește-ne).
3. **Carduri rotunjite, prietenoase** — colțuri generos rotunjite (16–24px), umbre soft, nimic ascuțit/agresiv.
4. **Acțiuni evidente** — un singur CTA primar per secțiune; butoanele „pill" (rotunjire mare) sunt semnătura vizuală.
5. **Accesibilitate** — contrast AA minim, focus states vizibile, target touch ≥ 44px.

---

## 2. Paleta de culori

### Brand & neutre

| Token | Hex | Utilizare |
|---|---|---|
| `navy-900` | `#0A2540` | Text principal, fundal footer, navbar dark |
| `navy-800` | `#143A5E` | Butoane primare, hover pe link-uri |
| `navy-700` | `#1E4D7B` | Accente, iconuri |
| `navy-100` | `#DCE6F0` | Borduri subtile pe fundal navy |
| `ink` | `#0A2540` | Alias text body (= navy-900) |
| `slate-600`| `#5A6B7B` | Text secundar / subtitluri |
| `slate-400`| `#9AAAB8` | Placeholder, text dezactivat |
| `cloud` | `#F4F7FA` | Fundal secțiuni alternante |
| `white` | `#FFFFFF` | Fundal principal, text pe navy |

### Accente pastel (din CVS: mint / rose / blue / green)

| Token | Hex | Utilizare |
|---|---|---|
| `mint-300` | `#A8E0CE` | Carduri „Find a vet", badge-uri |
| `mint-500` | `#5FC9A8` | Iconuri, accente mint mai puternice |
| `rose-300` | `#F6C9C9` | Card „pet care plans", fundaluri soft |
| `rose-500` | `#E98B8B` | Accent rose puternic |
| `blue-300` | `#BBD7F0` | Carduri articole, info |
| `blue-500` | `#5B9BD5` | Accent blue |
| `green-300`| `#BFE3A8` | Booking / disponibilitate |
| `green-500`| `#6FB23F` | Status „deschis", confirmări |

### Semantice (UI feedback)

| Token | Hex | Utilizare |
|---|---|---|
| `success` | `#2E9E5B` | Mesaje succes |
| `warning` | `#E0A23B` | Atenționări (ex. urgență) |
| `danger` | `#D64545` | Erori, urgență medicală |
| `info` | `#3B82C4` | Notificări neutre |

### Bara de urgență (top banner)
Folosește `rose-300` fundal + `navy-900` text, pentru anunțuri tip „program redus / urgențe la tel. X".

---

## 3. Configurare Tailwind

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          100: "#DCE6F0",
          700: "#1E4D7B",
          800: "#143A5E",
          900: "#0A2540",
        },
        ink: "#0A2540",
        slate: {
          400: "#9AAAB8",
          600: "#5A6B7B",
        },
        cloud: "#F4F7FA",
        mint: { 300: "#A8E0CE", 500: "#5FC9A8" },
        rose: { 300: "#F6C9C9", 500: "#E98B8B" },
        blue: { 300: "#BBD7F0", 500: "#5B9BD5" },
        green: { 300: "#BFE3A8", 500: "#6FB23F" },
        success: "#2E9E5B",
        warning: "#E0A23B",
        danger: "#D64545",
        info: "#3B82C4",
      },
      fontFamily: {
        // vezi secțiunea Tipografie
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 37, 64, 0.06)",
        card: "0 8px 24px rgba(10, 37, 64, 0.08)",
        lift: "0 16px 40px rgba(10, 37, 64, 0.12)",
        focus: "0 0 0 3px rgba(95, 201, 168, 0.45)",
      },
      fontSize: {
        // [size, lineHeight]
        xs: ["0.75rem", "1.1rem"],
        sm: ["0.875rem", "1.35rem"],
        base: ["1rem", "1.6rem"],
        lg: ["1.125rem", "1.7rem"],
        xl: ["1.375rem", "1.85rem"],
        "2xl": ["1.75rem", "2.1rem"],
        "3xl": ["2.25rem", "2.5rem"],
        "4xl": ["2.875rem", "3.1rem"],
        "5xl": ["3.5rem", "3.7rem"],
      },
      maxWidth: { content: "1200px" },
      spacing: { section: "5rem", "section-lg": "7rem" },
      transitionTimingFunction: { smooth: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. Tipografie

### Alegerea fonturilor

| Rol | Font recomandat | Alternativă | De ce |
|---|---|---|---|
| **Display / titluri** | `Fraunces` (serif modern, cald) | `Bricolage Grotesque` | Aduce personalitate și încredere; serif-ul „optical" e prietenos, nu corporate-rece |
| **Body / UI** | `Plus Jakarta Sans` | `Hanken Grotesque` | Sans geometric-umanist, lizibil, ușor rotunjit — se potrivește cu cardurile rotunde |

> Evită Inter/Roboto/Arial. Dacă vrei un singur font, `Hanken Grotesque` acoperă bine și titluri și body.

### Setup Next.js (`next/font`)

```ts
// app/fonts.ts
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

export const display = Fraunces({
  subsets: ["latin", "latin-ext"], // latin-ext pentru diacriticele RO: ă â î ș ț
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const body = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
```

```tsx
// app/layout.tsx
import { display, body } from "./fonts";
// <html lang="ro" className={`${display.variable} ${body.variable}`}>
```

> **Important pentru diacritice**: include mereu `latin-ext` în subsets, altfel ș/ț/ă/î apar cu fallback urât.

### Scala tipografică

| Element | Clasă Tailwind | Font | Weight |
|---|---|---|---|
| Hero H1 | `font-display text-4xl md:text-5xl` | Fraunces | 600 |
| H2 secțiune | `font-display text-3xl` | Fraunces | 600 |
| H3 card | `font-display text-xl` | Fraunces | 500 |
| Subtitlu / lead | `text-lg text-slate-600` | Jakarta | 400 |
| Body | `text-base text-ink` | Jakarta | 400 |
| Body emphasis | `text-base font-medium` | Jakarta | 500 |
| Label / eyebrow | `text-sm uppercase tracking-wide font-semibold` | Jakarta | 600 |
| Buton | `text-base font-semibold` | Jakarta | 600 |
| Caption / legal | `text-xs text-slate-400` | Jakarta | 400 |

**Font weights folosite:** 400 (body), 500 (subtitluri/H3), 600 (titluri/butoane), 700 (rar, accente puternice).

**Reguli tipografice**
- Line-height generos pe body (1.6).
- Titlurile pe `tracking-tight` (`-0.01em`), body pe `tracking-normal`.
- Lungime linie text: max ~70ch (`max-w-[65ch]`).

---

## 5. Border radius (rezumat decizional)

| Element | Radius | Clasă |
|---|---|---|
| Butoane | pill | `rounded-pill` |
| Carduri | 24px | `rounded-xl` |
| Carduri mari / hero panels | 32px | `rounded-2xl` |
| Inputuri | 12px | `rounded` |
| Badge / chip | pill | `rounded-pill` |
| Imagini în card | 16–20px | `rounded-md` / `rounded-lg` |
| Avatar / icon bubble | full | `rounded-full` |

---

## 6. Umbre & elevație

| Nivel | Token | Când |
|---|---|---|
| Plat | — | secțiuni full-width |
| Soft | `shadow-soft` | inputuri, chips |
| Card | `shadow-card` | carduri standard |
| Lift | `shadow-lift` | card la hover, dropdown, modale |
| Focus | `shadow-focus` | stare `:focus-visible` |

Hover pe card: `transition-all duration-300 ease-smooth hover:shadow-lift hover:-translate-y-1`.

---

## 7. Spațiere & layout

- **Container**: `mx-auto max-w-content px-4 md:px-6 lg:px-8`.
- **Grid**: 12 coloane mental; în practică `grid gap-6 md:grid-cols-2 lg:grid-cols-3`.
- **Padding secțiune**: `py-section` (80px) standard, `py-section-lg` (112px) pentru hero/CTA.
- **Gap între carduri**: `gap-6` (24px).
- **Padding intern card**: `p-6` (24px) / `p-8` pe carduri mari.
- Ritm vertical: multipli de 4px (scala Tailwind implicită).

---

## 8. Componente cheie

### Buton

| Variantă | Stil |
|---|---|
| Primar | `bg-navy-800 text-white rounded-pill px-6 py-3 font-semibold hover:bg-navy-900 shadow-soft transition` |
| Secundar (outline) | `border-2 border-navy-800 text-navy-800 rounded-pill px-6 py-3 font-semibold hover:bg-navy-800 hover:text-white` |
| Accent | `bg-mint-500 text-navy-900 rounded-pill px-6 py-3 font-semibold hover:bg-mint-300` |
| Ghost | `text-navy-800 font-semibold hover:underline underline-offset-4` |
| Cu icon | adaugă `inline-flex items-center gap-2`; iconul `arrow-right` la dreapta |

Dimensiuni: sm `px-4 py-2 text-sm`, md (default) `px-6 py-3`, lg `px-8 py-4 text-lg`.

### Card de serviciu (stil CVS „Find a vet")
```
rounded-xl p-6 shadow-card bg-mint-300  (sau rose-300 / blue-300 pe alternanță)
  → icon bubble: rounded-full bg-white/70 p-3
  → titlu: font-display text-xl
  → text: text-base text-navy-900/80
  → CTA ghost cu arrow-right
```
Pattern de culori rotativ pe trei carduri: **mint → rose → blue** (exact ca pe CVS).

### Navbar
- Sticky, `bg-white/90 backdrop-blur`, înălțime ~72px.
- Logo stânga; nav links centru/stânga; în dreapta `Găsește cabinetul` (outline) + `Programează` (primar).
- Variantă „dark" peste hero: `bg-navy-900 text-white`.
- Mobile: hamburger → drawer full-screen navy.

### Footer
- `bg-navy-900 text-white`, coloane: Navigare / Servicii / Contact / Legal.
- Sus un strip CTA (`bg-cloud`) cu „Înregistrează-te / Programează".

### Input
```
rounded border border-slate-400 px-4 py-3 text-base
focus:outline-none focus:border-navy-700 focus:shadow-focus
placeholder:text-slate-400
```

### Badge / Chip
`rounded-pill bg-mint-300 text-navy-900 px-3 py-1 text-sm font-semibold`.

---

## 9. Iconografie

- Set: **Phosphor Icons** (CVS folosește vizibil stilul Phosphor: `shield-chevron`, `handshake`, `first-aid-kit`, `pin`, `calendar-blank`, `arrow-right`, `price`).
- Pachet: `@phosphor-icons/react`.
- Greutate icon: `regular` pentru UI, `fill` pentru pin-uri/accente.
- Mărimi: 20px inline, 24px butoane, 32–40px în bubble-uri de card.

---

## 10. Imagini & ilustrații

- Stil foto: animale + oameni, lumină naturală, caldă; evită stock rece/corporate.
- Toate imaginile în carduri: `rounded-lg object-cover`.
- Folosește `next/image` cu `sizes` corect și `priority` doar pe hero.
- Ilustrații/iconuri decorative pe fundaluri pastel pentru secțiuni de articole.

---

## 11. Motion (micro-interacțiuni)

- Tranziție standard: `duration-300 ease-smooth`.
- Hover card: ridicare `-translate-y-1` + `shadow-lift`.
- Hero load: reveal în cascadă (titlu → subtitlu → CTA) cu `animation-delay` (sau Framer Motion `staggerChildren`).
- Butoane: `active:scale-[0.98]`.
- Respectă `prefers-reduced-motion`: dezactivează translate/scale.

---

## 12. Structura paginilor (sitemap pentru Prim Vet)

```
/                     Acasă (hero, servicii, de ce noi, articole, despre, contact)
/servicii             Lista serviciilor
/servicii/[slug]      Pagină serviciu (consultații, vaccinare, chirurgie, urgențe...)
/echipa               Medicii veterinari
/preturi              Tarife / abonament „Prim Card" (analog Healthy Pet Club)
/sfaturi              Blog / articole îngrijire
/sfaturi/[slug]       Articol
/despre               Despre cabinet
/contact              Hartă Iași, program, telefon, formular programare
/urgente              Info urgențe out-of-hours
```

### Secțiuni homepage (ordine recomandată, după modelul CVS)
1. **Hero** — „Pentru animalele tale, pe viață" + 2 CTA (Programează / Sună-ne) + imagine.
2. **3 carduri acțiune** (mint/rose/blue): Programează online · Abonament îngrijire · Găsește-ne pe hartă.
3. **De ce ne aleg stăpânii** — listă cu iconuri (medici cu experiență, prețuri transparente, urgențe, dotări moderne).
4. **Abonament Prim Card** — fundal rose, beneficii + discount.
5. **Articole / sfaturi** — 3 carduri pastel.
6. **Despre cabinet** — scurt istoric + CTA.
7. **Contact / programare** — formular + hartă + program.

---

## 13. Conținut RO — microcopy

| Element | Text |
|---|---|
| Hero CTA primar | „Programează o vizită" |
| Hero CTA secundar | „Sună-ne: 0XXX XXX XXX" |
| Eyebrow | „Cabinet veterinar · Iași" |
| Banner urgență | „Urgențe în afara programului: 0XXX XXX XXX" |
| Status program | „Deschis acum" (green-500) / „Închis" (slate-400) |

Diacritice corecte peste tot: ă, â, î, ș, ț.

---

## 14. Accesibilitate (checklist)

- Contrast text/fundal ≥ 4.5:1 (navy-900 pe alb/cloud ✅; evită mint-500 pentru text mic).
- `:focus-visible` cu `shadow-focus` pe toate elementele interactive.
- `lang="ro"` pe `<html>`.
- Alt text descriptiv la imagini.
- Touch targets ≥ 44×44px.
- Formular: label-uri vizibile, mesaje de eroare lângă câmp, nu doar culoare.

---

## 15. Tokens CSS globale (`globals.css`)

```css
:root {
  --font-display: "Fraunces";
  --font-body: "Plus Jakarta Sans";
}

html { scroll-behavior: smooth; }
body {
  @apply bg-white text-ink font-sans antialiased;
}
h1, h2, h3, h4 {
  @apply font-display tracking-tight text-navy-900;
}
::selection { background: #A8E0CE; color: #0A2540; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 16. Stack tehnic recomandat

- **Next.js 14+** (App Router, Server Components).
- **Tailwind CSS 3.4+**.
- **@phosphor-icons/react** — iconuri.
- **Framer Motion** — animații (opțional).
- **next/font** — Fraunces + Plus Jakarta Sans cu `latin-ext`.
- **next/image** — toate imaginile.
- Formular contact: Server Action + Resend (email) sau un endpoint API.
- Hartă: embed Google Maps sau `@vis.gl/react-google-maps` pentru locația din Iași.

---

### Rezumat „semnătură vizuală" Prim Vet
Navy profund + accente mint/rose/blue · titluri serif Fraunces · body Jakarta Sans · butoane pill · carduri rotunjite 24px cu umbre soft · iconuri Phosphor · mult whitespace · ton cald și de încredere.
