import { ListChecks } from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Trasabilitate
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Audit log
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Ultimele 100 de acțiuni importante: creări, editări, ștergeri,
          check-in/check-out, exporturi PDF și schimbări de status.
        </p>
      </section>

      <section className="grid gap-3">
        {logs.length ? (
          logs.map((log) => (
            <article key={log.id} className="rounded-xl bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                      {log.action}
                    </span>
                    <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                      {log.entityType}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold">{log.summary}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Actor: {log.actor?.name ?? "Sistem / cont șters"}
                    {log.entityId ? ` · Entity ID: ${log.entityId}` : ""}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatDateTime(log.createdAt)}
                </p>
              </div>
              {log.metadata ? (
                <pre className="mt-4 overflow-auto rounded-lg bg-cloud p-3 text-xs text-slate-600">
                  {log.metadata}
                </pre>
              ) : null}
            </article>
          ))
        ) : (
          <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
            <div>
              <ListChecks
                aria-hidden
                className="mx-auto h-10 w-10 text-navy-700"
              />
              <h2 className="mt-4 font-display text-2xl font-semibold">
                Nu există audit log încă
              </h2>
              <p className="mt-2 text-slate-600">
                Acțiunile administrative vor apărea aici.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
