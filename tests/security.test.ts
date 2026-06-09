import { describe, expect, it } from "vitest";

import {
  createResetToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "@/lib/security";

describe("security helpers", () => {
  it("hashes and verifies passwords without storing the raw password", () => {
    const password = "PrimVetAdmin123!";
    const hash = hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash).toContain(":");
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("rejects malformed password hashes", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
  });

  it("creates reset tokens and deterministic token hashes", () => {
    const reset = createResetToken();

    expect(reset.token.length).toBeGreaterThan(20);
    expect(reset.tokenHash).toBe(hashToken(reset.token));
    expect(reset.tokenHash).toHaveLength(64);
  });
});
