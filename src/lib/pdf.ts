import "server-only";

import fs from "node:fs";

import type { Prisma } from "@prisma/client";
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";

import { prisma } from "@/lib/db";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";

type PdfDoc = PDFKit.PDFDocument;

type Field = {
  label: string;
  value: string;
};

type FontNames = {
  regular: string;
  bold: string;
};

type PatientPdfPayload = Prisma.PetGetPayload<{
  include: {
    owner: true;
    medicalEvents: {
      include: {
        soapNote: true;
        staffMember: true;
      };
    };
    treatmentPlans: {
      include: {
        items: true;
      };
    };
  };
}>;

type MedicalEventForPdf = PatientPdfPayload["medicalEvents"][number];
type TreatmentPlanForPdf = PatientPdfPayload["treatmentPlans"][number];

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 44,
  bottom: 780,
};

const COLORS = {
  navy: "#17375f",
  ink: "#142235",
  muted: "#637083",
  line: "#d9e2ec",
  soft: "#f4f7fb",
  pale: "#eef4f8",
  accent: "#2d7f7b",
  danger: "#b64f4a",
  white: "#ffffff",
};

const SYSTEM_FONT_PATHS = {
  regular: [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Verdana.ttf",
    "/Library/Fonts/Arial.ttf",
  ],
  bold: [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Verdana Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
  ],
};

let fontBuffers:
  | {
      regular?: Buffer;
      bold?: Buffer;
    }
  | undefined;

function readFirstExistingFont(paths: string[]) {
  for (const fontPath of paths) {
    if (fs.existsSync(fontPath)) {
      return fs.readFileSync(fontPath);
    }
  }

  return undefined;
}

function getFontBuffers() {
  fontBuffers ??= {
    regular: readFirstExistingFont(SYSTEM_FONT_PATHS.regular),
    bold: readFirstExistingFont(SYSTEM_FONT_PATHS.bold),
  };

  return fontBuffers;
}

function registerFonts(doc: PdfDoc): FontNames {
  const fonts = getFontBuffers();

  if (fonts.regular && fonts.bold) {
    doc.registerFont("PrimVetRegular", fonts.regular);
    doc.registerFont("PrimVetBold", fonts.bold);

    return {
      regular: "PrimVetRegular",
      bold: "PrimVetBold",
    };
  }

  return {
    regular: "Helvetica",
    bold: "Helvetica-Bold",
  };
}

function contentWidth() {
  return PAGE.width - PAGE.margin * 2;
}

function textValue(value: string | number | Date | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function drawPageChrome(doc: PdfDoc, fonts: FontNames) {
  doc.rect(0, 0, PAGE.width, PAGE.height).fill(COLORS.white);
  doc.rect(0, 0, PAGE.width, 26).fill(COLORS.navy);
  doc
    .font(fonts.bold)
    .fontSize(9)
    .fillColor(COLORS.white)
    .text("PRIM VET", PAGE.margin, 8, { continued: true });
  doc
    .font(fonts.regular)
    .fillColor("#d8e5ee")
    .text("  |  Fișă medicală pacient");
  setText(doc, fonts, "regular", 8, COLORS.muted);
  doc.text("Prim Vet | Fișă pacient", PAGE.margin, 786, {
    width: contentWidth(),
    align: "center",
  });
  doc.y = 52;
}

function addPage(doc: PdfDoc, fonts: FontNames) {
  doc.addPage();
  drawPageChrome(doc, fonts);
}

function ensureSpace(doc: PdfDoc, fonts: FontNames, height: number) {
  if (doc.y + height > PAGE.bottom) {
    addPage(doc, fonts);
  }
}

function setText(doc: PdfDoc, fonts: FontNames, variant: "regular" | "bold", size: number, color = COLORS.ink) {
  doc.font(fonts[variant]).fontSize(size).fillColor(color);
}

function sectionTitle(doc: PdfDoc, fonts: FontNames, title: string) {
  ensureSpace(doc, fonts, 42);
  doc.moveDown(0.7);
  setText(doc, fonts, "bold", 13, COLORS.ink);
  doc.text(title, PAGE.margin, doc.y);
  doc
    .moveTo(PAGE.margin, doc.y + 4)
    .lineTo(PAGE.width - PAGE.margin, doc.y + 4)
    .strokeColor(COLORS.line)
    .lineWidth(1)
    .stroke();
  doc.y += 16;
}

function drawHero(doc: PdfDoc, fonts: FontNames, petName: string, subtitle: string) {
  const x = PAGE.margin;
  const y = doc.y;
  const width = contentWidth();
  const height = 116;

  doc.roundedRect(x, y, width, height, 10).fill(COLORS.pale);
  doc.rect(x, y, 8, height).fill(COLORS.accent);

  setText(doc, fonts, "bold", 23, COLORS.ink);
  doc.text(petName, x + 24, y + 22, { width: width - 190, lineGap: 2 });

  setText(doc, fonts, "regular", 11, COLORS.muted);
  doc.text(subtitle, x + 24, doc.y + 4, { width: width - 190 });

  setText(doc, fonts, "bold", 9, COLORS.navy);
  doc.text("DOCUMENT MEDICAL", x + width - 156, y + 26, {
    width: 126,
    align: "right",
  });

  setText(doc, fonts, "regular", 9, COLORS.muted);
  doc.text(`Generat la ${formatDateTime(new Date())}`, x + width - 190, y + 48, {
    width: 160,
    align: "right",
    lineGap: 2,
  });

  doc.y = y + height + 16;
}

function fieldCellHeight(doc: PdfDoc, fonts: FontNames, value: string, width: number) {
  setText(doc, fonts, "regular", 10);
  return Math.max(36, 16 + doc.heightOfString(value, { width, lineGap: 2 }));
}

function drawFieldGrid(doc: PdfDoc, fonts: FontNames, fields: Field[]) {
  const x = PAGE.margin;
  const width = contentWidth();
  const padding = 16;
  const gap = 18;
  const columnWidth = (width - padding * 2 - gap) / 2;
  const valueWidth = columnWidth;
  const rows: Field[][] = [];

  for (let index = 0; index < fields.length; index += 2) {
    rows.push(fields.slice(index, index + 2));
  }

  const rowHeights = rows.map((row) =>
    Math.max(
      ...row.map((field) => fieldCellHeight(doc, fonts, field.value, valueWidth)),
    ),
  );
  const height = padding * 2 + rowHeights.reduce((total, rowHeight) => total + rowHeight, 0);

  ensureSpace(doc, fonts, height + 8);

  const y = doc.y;
  doc.roundedRect(x, y, width, height, 8).fillAndStroke(COLORS.white, COLORS.line);

  let cursorY = y + padding;

  rows.forEach((row, rowIndex) => {
    const rowHeight = rowHeights[rowIndex];

    row.forEach((field, columnIndex) => {
      const cellX = x + padding + columnIndex * (columnWidth + gap);

      setText(doc, fonts, "bold", 7.5, COLORS.muted);
      doc.text(field.label.toUpperCase(), cellX, cursorY, {
        width: columnWidth,
        characterSpacing: 0.2,
      });

      setText(doc, fonts, "regular", 10.2, COLORS.ink);
      doc.text(field.value, cellX, cursorY + 13, {
        width: columnWidth,
        lineGap: 2,
      });
    });

    cursorY += rowHeight;
  });

  doc.y = y + height + 8;
}

function drawEmptyState(doc: PdfDoc, fonts: FontNames, text: string) {
  ensureSpace(doc, fonts, 54);
  const x = PAGE.margin;
  const y = doc.y;

  doc.roundedRect(x, y, contentWidth(), 46, 8).fillAndStroke(COLORS.soft, COLORS.line);
  setText(doc, fonts, "regular", 10, COLORS.muted);
  doc.text(text, x + 16, y + 16, { width: contentWidth() - 32 });
  doc.y = y + 56;
}

function blockHeight(doc: PdfDoc, fonts: FontNames, label: string, value: string, width: number) {
  setText(doc, fonts, "regular", 9.6);
  const valueHeight = doc.heightOfString(value, { width, lineGap: 2 });
  return 18 + valueHeight + (label ? 7 : 0);
}

function eventNotes(event: MedicalEventForPdf) {
  const notes = [
    { label: "Sumar", value: textValue(event.summary) },
    { label: "Diagnostic", value: textValue(event.diagnosis) },
    { label: "Tratament", value: textValue(event.treatment) },
    { label: "Recomandări", value: textValue(event.recommendations) },
  ];

  if (event.soapNote) {
    notes.push(
      { label: "SOAP - S", value: textValue(event.soapNote.subjective) },
      { label: "SOAP - O", value: textValue(event.soapNote.objective) },
      { label: "SOAP - A", value: textValue(event.soapNote.assessment) },
      { label: "SOAP - P", value: textValue(event.soapNote.plan) },
    );
  }

  return notes;
}

function eventCardHeight(doc: PdfDoc, fonts: FontNames, event: MedicalEventForPdf) {
  const innerWidth = contentWidth() - 32;
  const noteHeight = eventNotes(event).reduce(
    (total, note) => total + blockHeight(doc, fonts, note.label, note.value, innerWidth),
    0,
  );

  return 82 + noteHeight;
}

function drawLabelBlock(
  doc: PdfDoc,
  fonts: FontNames,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  setText(doc, fonts, "bold", 8, COLORS.muted);
  doc.text(label.toUpperCase(), x, y, { width });

  setText(doc, fonts, "regular", 9.7, COLORS.ink);
  doc.text(value || "-", x, y + 12, { width, lineGap: 2 });
}

function drawEventCard(
  doc: PdfDoc,
  fonts: FontNames,
  event: MedicalEventForPdf,
) {
  const x = PAGE.margin;
  const width = contentWidth();
  const innerX = x + 16;
  const innerWidth = width - 32;
  const notes = eventNotes(event);
  const height = eventCardHeight(doc, fonts, event);

  ensureSpace(doc, fonts, Math.min(height, 220));

  if (doc.y + height > PAGE.bottom) {
    addPage(doc, fonts);
  }

  const y = doc.y;
  doc.roundedRect(x, y, width, height, 8).fillAndStroke(COLORS.white, COLORS.line);

  doc.roundedRect(innerX, y + 16, 74, 18, 9).fill(COLORS.pale);
  setText(doc, fonts, "bold", 7.2, COLORS.navy);
  doc.text(event.type, innerX, y + 21, { width: 74, align: "center" });

  setText(doc, fonts, "bold", 12.5, COLORS.ink);
  doc.text(event.title, innerX + 86, y + 16, { width: innerWidth - 86 });

  setText(doc, fonts, "regular", 9, COLORS.muted);
  doc.text(
    `${formatDateTime(event.occurredAt)}  |  ${event.staffMember?.name ?? "Fără medic"}  |  ${formatMoney(event.costCents)}`,
    innerX,
    y + 44,
    { width: innerWidth },
  );

  let cursorY = y + 72;

  notes.forEach((note) => {
    const currentHeight = blockHeight(doc, fonts, note.label, note.value, innerWidth);

    if (cursorY + currentHeight > PAGE.bottom) {
      doc.y = cursorY;
      addPage(doc, fonts);
      cursorY = doc.y;
    }

    drawLabelBlock(doc, fonts, note.label, note.value, innerX, cursorY, innerWidth);
    cursorY += currentHeight;
  });

  doc.y = Math.max(y + height + 10, cursorY + 10);
}

function drawTreatmentPlanCard(
  doc: PdfDoc,
  fonts: FontNames,
  plan: TreatmentPlanForPdf,
) {
  const x = PAGE.margin;
  const width = contentWidth();
  const innerX = x + 16;
  const innerWidth = width - 32;
  const itemText = plan.items.length
    ? plan.items
        .map((item) => {
          const quantity = item.quantity ? ` x ${item.quantity}` : "";
          const dosage = item.dosage ? ` (${item.dosage})` : "";
          return `${item.name}${quantity}${dosage}`;
        })
        .join("; ")
    : "Fără servicii sau produse adăugate.";
  const height = 72 + blockHeight(doc, fonts, "Pași / produse", itemText, innerWidth);

  ensureSpace(doc, fonts, height);

  const y = doc.y;
  doc.roundedRect(x, y, width, height, 8).fillAndStroke(COLORS.white, COLORS.line);

  setText(doc, fonts, "bold", 12, COLORS.ink);
  doc.text(plan.title, innerX, y + 16, { width: innerWidth - 140 });

  setText(doc, fonts, "bold", 9, COLORS.accent);
  doc.text(plan.status, x + width - 130, y + 17, { width: 112, align: "right" });

  setText(doc, fonts, "regular", 9, COLORS.muted);
  doc.text(`Cost estimat: ${formatMoney(plan.totalEstimatedCents)}`, innerX, y + 38, {
    width: innerWidth,
  });

  drawLabelBlock(doc, fonts, "Pași / produse", itemText, innerX, y + 62, innerWidth);
  doc.y = y + height + 10;
}

export async function generatePatientPdf(petId: string) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: {
      owner: true,
      medicalEvents: {
        include: { soapNote: true, staffMember: true },
        orderBy: { occurredAt: "desc" },
      },
      treatmentPlans: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!pet) {
    return null;
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE.margin,
    info: {
      Title: `Fișă pacient - ${pet.name}`,
      Author: "Prim Vet",
      Subject: "Fișă medicală pacient",
    },
  });
  const fonts = registerFonts(doc);
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<void>((resolve) => {
    doc.on("end", resolve);
  });

  drawPageChrome(doc, fonts);
  drawHero(
    doc,
    fonts,
    pet.name,
    `${pet.species}${pet.breed ? ` | ${pet.breed}` : ""}`,
  );

  sectionTitle(doc, fonts, "Date pacient");
  drawFieldGrid(doc, fonts, [
    { label: "Sex", value: textValue(pet.sex) },
    { label: "Data nașterii", value: formatDate(pet.birthDate) },
    { label: "Microcip", value: textValue(pet.microchipNumber) },
    { label: "Greutate", value: pet.weightKg ? `${pet.weightKg} kg` : "-" },
    { label: "Alergii", value: textValue(pet.allergies) },
    { label: "Afecțiuni cronice", value: textValue(pet.chronicConditions) },
    { label: "Dietă", value: textValue(pet.diet) },
  ]);

  sectionTitle(doc, fonts, "Proprietar");
  drawFieldGrid(doc, fonts, [
    { label: "Nume", value: `${pet.owner.firstName} ${pet.owner.lastName}` },
    { label: "Telefon", value: pet.owner.phone },
    { label: "Email", value: textValue(pet.owner.email) },
    { label: "Adresă", value: textValue(pet.owner.address) },
    { label: "Oraș", value: textValue(pet.owner.city) },
    { label: "Observații", value: textValue(pet.owner.notes) },
  ]);

  if (pet.medicalEvents[0]) {
    ensureSpace(doc, fonts, 58 + Math.min(eventCardHeight(doc, fonts, pet.medicalEvents[0]), 260));
  }

  sectionTitle(doc, fonts, "Timeline medical");

  if (pet.medicalEvents.length === 0) {
    drawEmptyState(doc, fonts, "Nu există evenimente medicale înregistrate pentru acest pacient.");
  }

  for (const event of pet.medicalEvents) {
    drawEventCard(doc, fonts, event);
  }

  if (pet.treatmentPlans[0]) {
    ensureSpace(doc, fonts, 170);
  }

  sectionTitle(doc, fonts, "Planuri de tratament");

  if (pet.treatmentPlans.length === 0) {
    drawEmptyState(doc, fonts, "Nu există planuri de tratament active sau arhivate.");
  }

  for (const plan of pet.treatmentPlans) {
    drawTreatmentPlanCard(doc, fonts, plan);
  }

  doc.end();

  await finished;

  return {
    filename: `fisa-${pet.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}.pdf`,
    buffer: Buffer.concat(chunks),
  };
}
