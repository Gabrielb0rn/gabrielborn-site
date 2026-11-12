import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client do Supabase para Server Components, Server Actions e Route Handlers.
 * A sessão fica em cookies, então o servidor enxerga quem está logado.
 * Usado só para autenticação: os dados do site passam pelo Prisma.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components não podem gravar cookies. Sem problema: o
            // proxy (src/proxy.ts) renova a sessão antes de a página renderizar.
          }
        },
      },
    },
  );
}
