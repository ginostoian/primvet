import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { generatePatientPdf } from "@/lib/pdf";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const pdf = await generatePatientPdf(id);

  if (!pdf) {
    return NextResponse.json(
      { error: "Pacientul nu a fost găsit." },
      { status: 404 },
    );
  }

  await writeAuditLog({
    actorId: admin.id,
    action: "EXPORT",
    entityType: "Pet",
    entityId: id,
    summary: "Fișă pacient exportată PDF.",
  });

  return new Response(pdf.buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
    },
  });
}
