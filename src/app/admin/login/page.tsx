import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Entrar no painel</h1>
      <Suspense fallback={null}>
        <LinkProblem searchParams={searchParams} />
      </Suspense>
      <LoginForm />
    </main>
  );
}

// Lê a URL, então fica atrás do Suspense: o resto da página é estático.
async function LinkProblem({
  searchParams,
}: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { erro } = await searchParams;
  if (erro !== "link") return null;

  return (
    <p role="alert" className="text-sm">
      Esse link não vale mais ou não tem acesso. Peça um link novo abaixo.
    </p>
  );
}
