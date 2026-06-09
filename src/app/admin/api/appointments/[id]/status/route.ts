import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth";
import { updateAppointmentStatusRecord } from "@/lib/clinic-service";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Sesiunea de admin a expirat." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    status?: unknown;
    cancellationReason?: unknown;
  } | null;
  const status = typeof body?.status === "string" ? body.status : "";
  const cancellationReason =
    typeof body?.cancellationReason === "string"
      ? body.cancellationReason
      : null;

  try {
    const appointment = await updateAppointmentStatusRecord(
      id,
      status,
      cancellationReason,
    );

    await writeAuditLog({
      actorId: admin.id,
      action: "UPDATE",
      entityType: "Appointment",
      entityId: appointment.id,
      summary: `Status programare actualizat la ${appointment.status}.`,
    });

    return NextResponse.json({
      id: appointment.id,
      status: appointment.status,
      updatedAt: appointment.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Statusul nu a putut fi actualizat.",
      },
      { status: 400 },
    );
  }
}
