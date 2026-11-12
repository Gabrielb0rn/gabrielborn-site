# Portfólio de Gabriel Born

Site pessoal com painel administrativo próprio. Em construção: a base do projeto está pronta, e o site público começa depois da definição do design.

## Stack

- Next.js 16 (App Router, Cache Components) e TypeScript estrito
- Prisma 7 com Postgres do Supabase
- Supabase Auth para o login do administrador
- Tailwind 4
- Vitest e Playwright, com GitHub Actions em cada push

## Decisões técnicas

- **Só o servidor acessa o banco.** Todas as tabelas têm RLS ligado e nenhuma regra de acesso. A chave pública do Supabase não lê nem grava dados.
- **O `/admin` tem duas travas.** O proxy barra quem chega sem sessão válida. Cada página e cada ação confere de novo a sessão com o Supabase e compara o e-mail com o do administrador.
- **Não existe tabela de usuários.** O administrador é definido por uma variável de ambiente, então não há papel no banco para alguém alterar.
- **O build falha com qualquer erro de tipo ou de lint.**

## Rodar localmente

Requer Node 22 ou mais novo e um projeto no Supabase.

```bash
npm install
cp .env.example .env   # preencha os valores
npm run db:deploy
npm run dev
```

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Os testes de ponta a ponta rodam contra o build e não precisam de banco: eles provam que o `/admin` e o `/api/keep-alive` rejeitam quem não tem acesso.
