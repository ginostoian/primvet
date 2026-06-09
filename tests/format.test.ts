import { describe, expect, it } from "vitest";

import { formatMoney, initials } from "@/lib/format";

describe("format helpers", () => {
  it("formats stored cents as RON", () => {
    expect(formatMoney(12345)).toContain("123,45");
    expect(formatMoney(null)).toBe("-");
  });

  it("builds initials from names", () => {
    expect(initials("Admin Prim Vet")).toBe("AP");
    expect(initials("Rex")).toBe("R");
  });
});
