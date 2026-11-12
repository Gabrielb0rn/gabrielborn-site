import "dotenv/config";
import { defineConfig } from "prisma/config";

// A CLI do Prisma (migrate, studio) usa a conexão direta, porta 5432.
// O app em execução usa DATABASE_URL (pooler), em src/lib/prisma.ts.
// `prisma generate` não abre conexão, então roda sem DIRECT_URL (no CI, por exemplo).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? "",
  },
});
