import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin-email";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Destino do link de entrada enviado por e-mail.
 * Troca o código por uma sessão e só deixa passar o e-mail do admin.
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL("/admin/login?erro=link", request.url);
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(loginUrl);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !isAdminEmail(data.user?.email, process.env.ADMIN_EMAIL)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
