import Link from "next/link";
import { MagnifyingGlass, Package, WarningCircle } from "@phosphor-icons/react/dist/ssr";

import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatDateInput } from "@/lib/format";
import { getPagination, parsePage, searchParam } from "@/lib/pagination";

const pageSize = 12;

function expiryTone(expiresAt: Date | null) {
  if (!expiresAt) {
    return "bg-cloud";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((expiresAt.getTime() - today.getTime()) / 86400000);

  if (days < 0) {
    return "bg-danger text-white";
  }

  if (days <= 30) {
    return "bg-warning/35 text-navy-900";
  }

  return "bg-green-300/50 text-navy-900";
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = searchParam(params.q);
  const page = parsePage(params.page);
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { category: { contains: q } },
          { sku: { contains: q } },
          { batchNumber: { contains: q } },
          { manufacturer: { contains: q } },
          { supplier: { contains: q } },
          { storageLocation: { contains: q } },
        ],
      }
    : {};
  const total = await prisma.inventoryItem.count({ where });
  const pagination = getPagination({ page, total, pageSize });
  const items = await prisma.inventoryItem.findMany({
    where,
    orderBy: [{ expiresAt: "asc" }, { name: "asc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold uppercase text-navy-700">
          Stoc clinică
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Inventar medicamente și consumabile
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Urmărește produse, loturi, furnizori, cantități, praguri minime și
          date de expirare.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">
            Produs nou
          </h2>
          <form action={createInventoryItem} className="mt-6 grid gap-3">
            <label className="grid gap-2 text-sm font-semibold">
              Nume produs
              <input name="name" required className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm font-semibold">
                Categorie
                <select name="category" defaultValue="MEDICAMENT" className="rounded border border-slate-400 px-3 py-2 font-normal">
                  <option value="MEDICAMENT">Medicament</option>
                  <option value="VACCIN">Vaccin</option>
                  <option value="CONSUMABIL">Consumabil</option>
                  <option value="HRANA">Hrană</option>
                  <option value="ALTELE">Altele</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Status
                <select name="status" defaultValue="ACTIV" className="rounded border border-slate-400 px-3 py-2 font-normal">
                  <option value="ACTIV">Activ</option>
                  <option value="EPUIZAT">Epuizat</option>
                  <option value="INACTIV">Inactiv</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Cantitate
                <input name="quantity" inputMode="decimal" defaultValue="0" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Unitate
                <input name="unit" defaultValue="buc" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Stoc minim
                <input name="minQuantity" inputMode="decimal" defaultValue="0" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Expiră la
                <input name="expiresAt" type="date" className="rounded border border-slate-400 px-3 py-2 font-normal" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Lot
              <input name="batchNumber" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Producător
              <input name="manufacturer" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Furnizor
              <input name="supplier" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Locație
              <input name="storageLocation" className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Note
              <textarea name="notes" rows={3} className="rounded border border-slate-400 px-3 py-2 font-normal" />
            </label>
            <Button type="submit">
              <Package aria-hidden className="h-5 w-5" />
              Adaugă produs
            </Button>
          </form>
        </div>

        <div className="grid content-start gap-4">
          <form action="/admin/inventar" className="rounded-xl bg-white p-4 shadow-soft">
            <label className="grid gap-2 text-sm font-semibold">
              Caută produs
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlass aria-hidden className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input name="q" defaultValue={q} placeholder="Nume, lot, producător, furnizor, locație..." className="min-h-11 w-full rounded border border-slate-400 px-10 py-2 font-normal" />
                </div>
                <Button type="submit" size="sm">Caută</Button>
                {q ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/admin/inventar">Reset</Link>
                  </Button>
                ) : null}
              </div>
            </label>
          </form>

          <PaginationControls
            pathname="/admin/inventar"
            q={q}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={total}
            from={pagination.from}
            to={pagination.to}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
          />

          {items.length ? (
            items.map((item) => {
              const lowStock = item.quantity <= item.minQuantity;

              return (
                <article key={item.id} className="rounded-xl bg-white p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
                        {item.category}
                      </span>
                      <h2 className="mt-3 font-display text-2xl font-semibold">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Lot {item.batchNumber ?? "-"} · {item.manufacturer ?? "producător necunoscut"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-pill bg-mint-300 px-3 py-1 text-xs font-semibold">
                        {item.quantity} {item.unit}
                      </span>
                      <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${expiryTone(item.expiresAt)}`}>
                        Exp: {item.expiresAt ? formatDateInput(item.expiresAt) : "-"}
                      </span>
                      {lowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-pill bg-warning/35 px-3 py-1 text-xs font-semibold">
                          <WarningCircle aria-hidden className="h-4 w-4" />
                          Stoc minim
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <form action={updateInventoryItem} className="mt-5 grid gap-3 border-t border-navy-100 pt-4">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="grid gap-2 text-sm font-semibold">
                        Nume
                        <input name="name" defaultValue={item.name} required className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Categorie
                        <input name="category" defaultValue={item.category} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Status
                        <input name="status" defaultValue={item.status} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Cantitate
                        <input name="quantity" inputMode="decimal" defaultValue={item.quantity} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Unitate
                        <input name="unit" defaultValue={item.unit} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Stoc minim
                        <input name="minQuantity" inputMode="decimal" defaultValue={item.minQuantity} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Lot
                        <input name="batchNumber" defaultValue={item.batchNumber ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Expiră
                        <input name="expiresAt" type="date" defaultValue={formatDateInput(item.expiresAt)} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Locație
                        <input name="storageLocation" defaultValue={item.storageLocation ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="grid gap-2 text-sm font-semibold">
                        SKU
                        <input name="sku" defaultValue={item.sku ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Furnizor
                        <input name="supplier" defaultValue={item.supplier ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        Producător
                        <input name="manufacturer" defaultValue={item.manufacturer ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm font-semibold">
                      Note
                      <textarea name="notes" rows={2} defaultValue={item.notes ?? ""} className="rounded border border-slate-400 px-3 py-2 font-normal" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <ConfirmActionButton
                        size="sm"
                        title="Salvezi modificările produsului?"
                        description={`Produsul ${item.name} va fi actualizat imediat în inventar.`}
                        confirmLabel="Salvează"
                      >
                        Salvează produs
                      </ConfirmActionButton>
                    </div>
                  </form>
                  <form action={deleteInventoryItem} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="name" value={item.name} />
                    <ConfirmActionButton
                      variant="secondary"
                      size="sm"
                      className="border-danger text-danger hover:bg-danger hover:text-white"
                      title="Ștergi produsul?"
                      description={`Produsul ${item.name} va fi șters din inventar. Operațiunea nu poate fi anulată.`}
                      confirmLabel="Șterge"
                    >
                      Șterge produs
                    </ConfirmActionButton>
                  </form>
                </article>
              );
            })
          ) : (
            <div className="grid min-h-72 place-items-center rounded-xl bg-white p-8 text-center shadow-soft">
              <div>
                <Package aria-hidden className="mx-auto h-10 w-10 text-navy-700" />
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  Nu există produse
                </h2>
                <p className="mt-2 text-slate-600">
                  {q
                    ? "Schimbă termenul de căutare sau resetează filtrul."
                    : "Adaugă primul produs din formularul din stânga."}
                </p>
              </div>
            </div>
          )}

          {items.length ? (
            <PaginationControls
              pathname="/admin/inventar"
              q={q}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              total={total}
              from={pagination.from}
              to={pagination.to}
              hasPrevious={pagination.hasPrevious}
              hasNext={pagination.hasNext}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
