import { describe, expect, it } from "vitest";

import { getPagination, paginatedHref, parsePage, searchParam } from "@/lib/pagination";

describe("pagination helpers", () => {
  it("parses valid pages and falls back for invalid values", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-1")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage(undefined)).toBe(1);
  });

  it("calculates bounds for paginated result ranges", () => {
    expect(getPagination({ page: 2, total: 25, pageSize: 10 })).toEqual({
      currentPage: 2,
      pageSize: 10,
      totalPages: 3,
      skip: 10,
      hasPrevious: true,
      hasNext: true,
      from: 11,
      to: 20,
    });
  });

  it("clamps out-of-range pages and handles empty result sets", () => {
    expect(getPagination({ page: 10, total: 0, pageSize: 10 })).toMatchObject({
      currentPage: 1,
      totalPages: 1,
      skip: 0,
      from: 0,
      to: 0,
      hasPrevious: false,
      hasNext: false,
    });
  });

  it("builds links while preserving search terms", () => {
    expect(paginatedHref("/admin/pacienti", { q: "rex", page: 2 })).toBe(
      "/admin/pacienti?q=rex&page=2",
    );
    expect(paginatedHref("/admin/pacienti", { q: "rex", page: 1 })).toBe(
      "/admin/pacienti?q=rex",
    );
    expect(searchParam("  Rex  ")).toBe("Rex");
  });
});
