import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// O proxy barra quem não tem sessão antes de a página rodar. Estes testes
// provam a segunda trava: mesmo que alguém passe pelo proxy, `getAdmin` e
// `requireAdmin` só aceitam o e-mail de ADMIN_EMAIL.

const getUser = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: async () => ({ auth: { getUser } }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

const { getAdmin, requireAdmin } = await import("@/lib/auth/session");

beforeEach(() => {
  vi.stubEnv("ADMIN_EMAIL", "dono@exemplo.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
  getUser.mockReset();
});

describe("getAdmin", () => {
  it("devolve o admin quando a sessão é dele", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "dono@exemplo.com" } },
      error: null,
    });

    await expect(getAdmin()).resolves.toEqual({ email: "dono@exemplo.com" });
  });

  it("devolve null sem sessão", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(getAdmin()).resolves.toBeNull();
  });

  it("devolve null quando o Supabase recusa a sessão", async () => {
    getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("invalid JWT"),
    });

    await expect(getAdmin()).resolves.toBeNull();
  });

  it("devolve null para um usuário logado que não é o admin", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "visitante@exemplo.com" } },
      error: null,
    });

    await expect(getAdmin()).resolves.toBeNull();
  });

  it("devolve null para todo mundo sem ADMIN_EMAIL configurado", async () => {
    vi.stubEnv("ADMIN_EMAIL", "");
    getUser.mockResolvedValue({
      data: { user: { email: "dono@exemplo.com" } },
      error: null,
    });

    await expect(getAdmin()).resolves.toBeNull();
  });
});

describe("requireAdmin", () => {
  it("manda ao login quem não é o admin", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "visitante@exemplo.com" } },
      error: null,
    });

    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
  });

  it("deixa o admin passar", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "dono@exemplo.com" } },
      error: null,
    });

    await expect(requireAdmin()).resolves.toEqual({ email: "dono@exemplo.com" });
  });
});
