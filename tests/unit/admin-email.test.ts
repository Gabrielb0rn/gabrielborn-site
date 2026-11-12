import { describe, expect, it } from "vitest";
import { isAdminEmail } from "@/lib/auth/admin-email";

const ADMIN = "dono@exemplo.com";

describe("isAdminEmail", () => {
  it("aceita o e-mail do admin", () => {
    expect(isAdminEmail("dono@exemplo.com", ADMIN)).toBe(true);
  });

  it("ignora maiúsculas e espaços nas pontas", () => {
    expect(isAdminEmail("  Dono@Exemplo.COM ", ADMIN)).toBe(true);
    expect(isAdminEmail("dono@exemplo.com", "  DONO@exemplo.com  ")).toBe(true);
  });

  it("rejeita qualquer outro e-mail", () => {
    expect(isAdminEmail("visitante@exemplo.com", ADMIN)).toBe(false);
  });

  it("rejeita e-mail parecido, mas diferente", () => {
    expect(isAdminEmail("dono@exemplo.com.br", ADMIN)).toBe(false);
    expect(isAdminEmail("dono+x@exemplo.com", ADMIN)).toBe(false);
    expect(isAdminEmail("xdono@exemplo.com", ADMIN)).toBe(false);
  });

  it("rejeita quem não tem e-mail", () => {
    expect(isAdminEmail(null, ADMIN)).toBe(false);
    expect(isAdminEmail(undefined, ADMIN)).toBe(false);
    expect(isAdminEmail("", ADMIN)).toBe(false);
  });

  it("rejeita todo mundo quando ADMIN_EMAIL não está configurado", () => {
    expect(isAdminEmail("dono@exemplo.com", undefined)).toBe(false);
    expect(isAdminEmail("dono@exemplo.com", "")).toBe(false);
    expect(isAdminEmail("dono@exemplo.com", "   ")).toBe(false);
    expect(isAdminEmail("", "")).toBe(false);
  });
});
