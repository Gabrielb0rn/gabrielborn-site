"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminEmail } from "@/lib/auth/admin-email";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { ok: boolean; message: string } | null;

const emailSchema = z.email();

/**
 * Envia o link de entrada por e-mail.
 *
 * A resposta é a mesma para qualquer e-mail válido, para não revelar qual é o
 * do admin. O link só é enviado de fato quando o e-mail é o de ADMIN_EMAIL.
 */
export async function requestLoginLink(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { ok: false, message: "Digite um e-mail válido." };
  }

  if (isAdminEmail(parsed.data, process.env.ADMIN_EMAIL)) {
    const requestHeaders = await headers();
    const origin =
      requestHeaders.get("origin") ?? `https://${requestHeaders.get("host")}`;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });

    if (error) {
      return {
        ok: false,
        message: "Não foi possível enviar o link agora. Tente de novo em instantes.",
      };
    }
  }

  return {
    ok: true,
    message: "Se este e-mail tiver acesso, o link de entrada chega em instantes.",
  };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
