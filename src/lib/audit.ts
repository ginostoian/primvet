import { prisma } from "@/lib/db";

export async function writeAuditLog({
  actorId,
  action,
  entityType,
  entityId,
  summary,
  metadata,
}: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: actorId ?? null,
      action,
      entityType,
      entityId: entityId ?? null,
      summary,
      metadata: metadata === undefined ? null : JSON.stringify(metadata),
    },
  });
}
