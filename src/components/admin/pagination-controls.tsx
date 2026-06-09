import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { paginatedHref } from "@/lib/pagination";

export function PaginationControls({
  pathname,
  q,
  currentPage,
  totalPages,
  total,
  from,
  to,
  hasPrevious,
  hasNext,
}: {
  pathname: string;
  q: string;
  currentPage: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-soft">
      <p className="text-sm font-semibold text-slate-600">
        {total === 0
          ? "0 rezultate"
          : `${from}-${to} din ${total} rezultate`}
      </p>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link
            href={
              hasPrevious
                ? paginatedHref(pathname, { q, page: currentPage - 1 })
                : paginatedHref(pathname, { q, page: currentPage })
            }
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
          >
            <CaretLeft aria-hidden className="h-4 w-4" />
            Prev
          </Link>
        </Button>
        <span className="px-2 text-sm font-semibold text-navy-900">
          Pagina {currentPage} / {totalPages}
        </span>
        <Button asChild variant="secondary" size="sm">
          <Link
            href={
              hasNext
                ? paginatedHref(pathname, { q, page: currentPage + 1 })
                : paginatedHref(pathname, { q, page: currentPage })
            }
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
          >
            Next
            <CaretRight aria-hidden className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
