import { prisma } from "@/lib/prisma";

/**
 * Chamado uma vez por dia pelo cron da Vercel (vercel.json), para o projeto
 * gratuito do Supabase não pausar por falta de uso. A Vercel envia
 * "Authorization: Bearer <CRON_SECRET>" sozinha.
 *
 * Grava a hora num registro único da tabela Heartbeat. É uma escrita de
 * verdade, que não toca em nenhum dado do site.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const at = new Date();
  await prisma.heartbeat.upsert({
    where: { id: "main" },
    create: { id: "main", at },
    update: { at },
  });

  return Response.json({ ok: true, at: at.toISOString() });
}
