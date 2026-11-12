import { defineConfig } from "@playwright/test";

const PORT = 3100;

// Os testes rodam contra o build de produção, com valores de mentira para o
// Supabase. Nenhum deles depende de banco ou de login real: o objetivo é provar
// que quem não tem sessão válida fica de fora.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "chave-de-teste",
      ADMIN_EMAIL: "dono@exemplo.com",
      CRON_SECRET: "segredo-de-teste",
      DATABASE_URL: "postgresql://teste:teste@localhost:5432/teste",
    },
  },
});
