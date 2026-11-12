import { expect, test } from "@playwright/test";

// Um token com cara de JWT, mas assinado por ninguém.
const FAKE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjMiLCJlbWFpbCI6ImRvbm9AZXhlbXBsby5jb20iLCJleHAiOjQxMDI0NDQ4MDB9." +
  "assinatura-invalida";

test.describe("/admin sem sessão válida", () => {
  test("sem cookie nenhum, vai para o login", async ({ request }) => {
    const response = await request.get("/admin", { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/admin/login");
  });

  test("um cookie inventado não abre o painel", async ({ request }) => {
    // Era assim que o portfólio antigo deixava entrar: bastava o cookie existir.
    const response = await request.get("/admin", {
      maxRedirects: 0,
      headers: { cookie: "sb-access-token=x; sb-refresh-token=y" },
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/admin/login");
  });

  test("um cookie de sessão com token forjado não abre o painel", async ({ request }) => {
    const session = JSON.stringify({
      access_token: FAKE_JWT,
      refresh_token: "forjado",
      token_type: "bearer",
      expires_at: 4102444800,
      user: { id: "123", email: "dono@exemplo.com" },
    });
    const cookie = `sb-localhost-auth-token=${encodeURIComponent(session)}`;

    const response = await request.get("/admin", {
      maxRedirects: 0,
      headers: { cookie },
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/admin/login");
  });

  test("subpáginas do admin também ficam fechadas", async ({ request }) => {
    const response = await request.get("/admin/projetos", { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/admin/login");
  });
});

test.describe("páginas abertas", () => {
  test("a home responde", async ({ request }) => {
    const response = await request.get("/");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Gabriel Born");
  });

  test("a tela de login responde sem sessão", async ({ request }) => {
    const response = await request.get("/admin/login");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Entrar no painel");
  });
});

test.describe("/api/keep-alive", () => {
  test("recusa quem não manda o segredo", async ({ request }) => {
    const response = await request.get("/api/keep-alive");

    expect(response.status()).toBe(401);
  });

  test("recusa segredo errado", async ({ request }) => {
    const response = await request.get("/api/keep-alive", {
      headers: { authorization: "Bearer errado" },
    });

    expect(response.status()).toBe(401);
  });
});
