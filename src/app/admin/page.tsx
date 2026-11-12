import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Painel</h1>
      <Suspense fallback={<p>Conferindo acesso…</p>}>
        <AdminHome />
      </Suspense>
    </main>
  );
}

// A leitura da sessão acontece a cada pedido, por isso fica atrás do Suspense.
async function AdminHome() {
  const admin = await requireAdmin();

  return (
    <>
      <p>Você entrou como {admin.email}.</p>
      <p>Os cadastros de projetos, perfil e arquivo acadêmico entram na Fase 3.</p>
      <form action={signOut}>
        <button type="submit" className="rounded border border-foreground/30 px-3 py-2">
          Sair
        </button>
      </form>
    </>
  );
}
