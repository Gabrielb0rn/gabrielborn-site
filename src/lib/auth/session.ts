import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./admin-email";

export type Admin = { email: string };

/**
 * Devolve o admin logado, ou null.
 *
 * `getUser()` confere a sessão com o servidor de autenticação do Supabase, em
 * vez de confiar no conteúdo do cookie. Toda página e toda ação do /admin
 * passa por aqui: o proxy só renova a sessão, não autoriza nada.
 */
export async function getAdmin(): Promise<Admin | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (error || !email) return null;
  if (!isAdminEmail(email, process.env.ADMIN_EMAIL)) return null;

  return { email };
}

/** Para páginas: manda ao login quem não é o admin. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
