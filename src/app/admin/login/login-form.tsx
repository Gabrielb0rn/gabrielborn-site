"use client";

import { useActionState } from "react";
import { requestLoginLink, type LoginState } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    requestLoginLink,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="email" className="text-sm font-medium">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="rounded border border-foreground/30 bg-transparent px-3 py-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-foreground px-3 py-2 font-medium text-background disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar link de entrada"}
      </button>
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {state?.message}
      </p>
    </form>
  );
}
