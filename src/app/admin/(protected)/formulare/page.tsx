import {
  Archive,
  CheckCircle,
  Clock,
  Trash,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { deleteIntake, updateIntakeStatus } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

const statusOptions = [
  "IN_ASTEPTARE",
  "TRIAT",
  "RASPUNS",
  "PROGRAMARE_NECESARA",
  "ARHIVAT",
];

export default async function IntakePage() {
  const submissions = await prisma.intakeSubmission.findMany({
    orderBy: [{ status: "asc" }, { submittedAt: "desc" }],
    include: { owner: true, pet: true },
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Inbox clinică
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Formulare trimise de pacienți
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Fiecare cerere venită din site intră aici pentru triaj: răspuns,
          programare, arhivare sau ștergere definitivă.
        </p>
      </section>

      <section className="grid gap-4">
        {submissions.length ? (
          submissions.map((submission) => (
            <article
              key={submission.id}
              className="grid gap-5 rounded-xl bg-white p-5 shadow-soft xl:grid-cols-[1fr_360px]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                    {submission.status}
                  </span>
                  <span className="rounded-pill bg-rose-300/70 px-3 py-1 text-xs font-semibold">
                    {submission.urgency}
                  </span>
                  <span className="text-sm text-slate-600">
                    {formatDateTime(submission.submittedAt)}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  {submission.petName} · {submission.ownerName}
                </h2>
                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-600">Telefon</dt>
                    <dd>{submission.ownerPhone}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-600">Email</dt>
                    <dd>{submission.ownerEmail ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-600">Specie</dt>
                    <dd>{submission.species ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-600">Legat de</dt>
                    <dd>
                      {submission.pet?.name ??
                        submission.owner?.lastName ??
                        "Nelegat în CRM"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 rounded-lg bg-cloud p-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Motivul vizitei
                  </p>
                  <p className="mt-2">{submission.reason}</p>
                </div>
                {submission.response ? (
                  <div className="mt-4 rounded-lg border border-navy-100 p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      Răspuns trimis/notat
                    </p>
                    <p className="mt-2">{submission.response}</p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4">
                <form action={updateIntakeStatus} className="grid gap-3">
                  <input type="hidden" name="id" value={submission.id} />
                  <label className="grid gap-2 text-sm font-semibold">
                    Status
                    <select
                      name="status"
                      defaultValue={submission.status}
                      className="rounded border border-slate-400 px-3 py-2 font-normal"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Note triaj
                    <textarea
                      name="triageNotes"
                      rows={3}
                      defaultValue={submission.triageNotes ?? ""}
                      className="rounded border border-slate-400 px-3 py-2 font-normal"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Răspuns
                    <textarea
                      name="response"
                      rows={3}
                      defaultValue={submission.response ?? ""}
                      className="rounded border border-slate-400 px-3 py-2 font-normal"
                    />
                  </label>
                  <Button type="submit" size="sm">
                    <CheckCircle aria-hidden className="h-5 w-5" />
                    Salvează triaj
                  </Button>
                </form>

                <div className="grid grid-cols-2 gap-2">
                  <form action={updateIntakeStatus}>
                    <input type="hidden" name="id" value={submission.id} />
                    <input type="hidden" name="status" value="ARHIVAT" />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      <Archive aria-hidden className="h-4 w-4" />
                      Arhivează
                    </Button>
                  </form>
                  <form action={deleteIntake}>
                    <input type="hidden" name="id" value={submission.id} />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="w-full border-danger text-danger hover:bg-danger hover:text-white"
                    >
                      <Trash aria-hidden className="h-4 w-4" />
                      Șterge
                    </Button>
                  </form>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
            <div>
              <Clock aria-hidden className="mx-auto h-10 w-10 text-navy-700" />
              <h2 className="mt-4 font-display text-2xl font-semibold">
                Nu există formulare încă
              </h2>
              <p className="mt-2 text-slate-600">
                Cererile trimise din pagina de contact vor apărea aici.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
