export const defaultPageSize = 12;

export function parsePage(value: string | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getPagination({
  page,
  total,
  pageSize = defaultPageSize,
}: {
  page: number;
  total: number;
  pageSize?: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return {
    currentPage,
    pageSize,
    totalPages,
    skip: (currentPage - 1) * pageSize,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
    from: total === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, total),
  };
}

export function searchParam(value: string | undefined) {
  return value?.trim() ?? "";
}

export function paginatedHref(
  pathname: string,
  params: { q?: string; page?: number },
) {
  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }

  const query = search.toString();

  return query ? `${pathname}?${query}` : pathname;
}
