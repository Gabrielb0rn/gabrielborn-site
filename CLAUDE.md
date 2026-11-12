# Portfólio de Gabriel Born

Portfólio pessoal com painel administrativo próprio, para cadastrar projetos, formação e o arquivo acadêmico sem mexer no código.

Antes de escrever código, leia também o `AGENTS.md`: esta versão do Next.js tem mudanças em relação às anteriores, e a documentação certa está em `node_modules/next/dist/docs/`.

## O que um recrutador deve perceber

Em 10 segundos: quem é o Gabriel, o que ele faz e os melhores projetos, com link para demo e código. Em 1 minuto: que o próprio site é um projeto full stack bem feito.

## Rotas

Públicas:
- `/`: apresentação, disponibilidade e projetos em destaque.
- `/projetos` e `/projetos/[slug]`: estudo de caso com problema, papel, stack, desafios, resultado, galeria e links.
- `/sobre`: história curta, formação, habilidades e currículo em PDF.
- `/arquivo`: atividades acadêmicas, com filtro por curso, ano, trimestre e matéria. Seção secundária.
- `/contato`: formulário que grava em `ContactMessage`.

Admin, só para o e-mail em `ADMIN_EMAIL`:
- `/admin/login`: entrada por link enviado por e-mail.
- `/admin`, `/admin/projetos`, `/admin/arquivo`, `/admin/perfil`, `/admin/mensagens`.

## Stack

- Next.js 16 (App Router, Cache Components, TypeScript estrito, `src/`, Tailwind 4).
- Prisma 7 com Postgres do Supabase, pelo driver `@prisma/adapter-pg`.
- Supabase Auth (`@supabase/ssr`) só para o login do admin. Supabase Storage para imagens.
- GSAP com `useGSAP` e Lenis, a partir da Fase 2.
- Zod em toda entrada. Server Actions para gravar.
- Vitest (unidade) e Playwright (ponta a ponta). GitHub Actions em cada push.
- Deploy na Vercel.

## Como a segurança está montada

- **Sessão em cookie, lida no servidor.** `src/lib/supabase/server.ts`.
- **Duas travas no `/admin`.** `src/proxy.ts` renova a sessão e manda ao login quem não tem sessão válida. `requireAdmin()` e `getAdmin()`, em `src/lib/auth/session.ts`, conferem a sessão com o Supabase e comparam o e-mail com `ADMIN_EMAIL`. A segunda trava é a que vale: o proxy é só um atalho.
- **Não existe tabela de usuários nem papel guardado no banco.** Sem `ADMIN_EMAIL` configurado, ninguém é admin.
- **RLS ligado em todas as tabelas, sem nenhuma regra de acesso.** A chave pública do Supabase não lê nem grava dados. Só o servidor acessa o banco, pelo Prisma.

## Fases

Uma fase por vez. A próxima só começa com a atual funcionando, commitada e com o CI verde. Ao terminar um item, marque aqui.

### Fase 0: fundação
- [x] App criado, TypeScript estrito, ESLint sem avisos
- [x] Schema do Prisma e primeira migration, com RLS
- [x] Sessão em cookie, proxy e trava do `/admin` no servidor
- [x] Testes: regra do e-mail do admin, `getAdmin`/`requireAdmin` e acesso ao `/admin` sem sessão
- [x] CI: lint, tipos, testes, build e testes de ponta a ponta
- [x] Projeto no Supabase criado
- [ ] Migration aplicada no banco (`npm run db:deploy`, depois de preencher o `.env`)
- [x] Repositório no GitHub com o CI passando
- [x] Projeto na Vercel ligado ao repositório
- [ ] Variáveis de ambiente na Vercel e cron `/api/keep-alive` respondendo
- [ ] Login do admin testado de verdade, com o link chegando por e-mail

### Fase 1: direção de arte
- [ ] Análise de 3 a 5 referências: tipografia, grid, ritmo de rolagem, transições
- [ ] `DESIGN.md` com cores, tipografia, espaçamento e princípios de movimento
- [ ] 2 ou 3 protótipos estáticos da primeira tela
- Pronto quando: `DESIGN.md` e um protótipo aprovados.

### Fase 2: site público com dados de seed
- [ ] `prisma/seed.ts` com o perfil e os projetos reais
- [ ] Base de animação: `useGSAP` com escopo por componente, Lenis, `prefers-reduced-motion`
- [ ] Home, lista de projetos, estudo de caso, sobre, contato
- [ ] Leituras com `use cache` e `cacheTag`, refeitas quando o admin salva
- [ ] Imagens comprimidas, pelo `next/image`
- Pronto quando: Lighthouse 90 ou mais em desempenho e acessibilidade na home, no celular e no computador.

### Fase 3: painel admin
- [ ] Cadastro de projetos com Zod, upload de imagens e ordenação por arrastar
- [ ] Cadastro de perfil, formação e habilidades. Caixa de mensagens
- [ ] Um teste por ação de escrita provando que ela rejeita quem não é o admin
- Pronto quando: um projeto criado no admin aparece na home, com teste Playwright cobrindo isso.

### Fase 4: arquivo acadêmico
- [ ] `scripts/import-legacy.ts` lê os arquivos exportados do banco antigo e pode rodar de novo sem duplicar (`legacyId`)
- [ ] Normalização: tipos escritos de dois jeitos, colunas duplicadas, ano e trimestre como números
- [ ] Tudo entra como rascunho, para revisão no admin antes de publicar
- [ ] Página `/arquivo` com os filtros. Notas e nomes de professores não aparecem
- Pronto quando: as atividades reais estão publicadas.

### Fase 5: acabamento
- [ ] Título, descrição e imagem de compartilhamento por página. `sitemap.xml` e `robots.txt`
- [ ] README com GIF, link da demo, stack e decisões técnicas
- [ ] Domínio próprio
- [ ] Revisão final de código, acessibilidade e desempenho

## Regras de trabalho

- O build falha com erro de tipo ou de lint. Nunca ligar `ignoreBuildErrors` nem desligar regras para passar.
- Prisma só no servidor. Nunca importar `@/lib/prisma` em componente client.
- Toda ação de escrita começa chamando `getAdmin()` e valida a entrada com Zod. Não confiar no proxy nem na interface.
- Toda tabela nova ganha `ENABLE ROW LEVEL SECURITY` na migration que a cria. Use `prisma migrate dev --create-only` e edite o SQL.
- Cada rota devolve só os campos que a tela usa. Nunca o registro inteiro.
- Texto vindo do banco nunca entra como HTML sem filtro. Nada de `dangerouslySetInnerHTML` com conteúdo do banco.
- Nada simulado: tela que não funciona não entra. Sem dado inventado no seed que possa ser lido como real.
- Segredos só no `.env`. O `.env.example` acompanha toda variável nova, sem valores.
- Versões fixas no `package.json` e `package-lock.json` no git.
- Commits pequenos, em português: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`.
- Imagens no Supabase Storage, nunca hotlink de terceiros. Sem marcas ou logos de empresas reais.
- Datas em UTC no banco, exibidas em `America/Sao_Paulo`.

## Design

- Antes de escrever qualquer interface: seguir o `DESIGN.md` aprovado na Fase 1. Até lá, as telas usam o mínimo de estilo.
- Evitar cara de template: grade de cards idênticos, gradiente decorativo, rótulo em caixa alta acima de todo título, fundo quase preto com um único acento neon.
- Movimento com intenção: um momento orquestrado por página, mais as respostas às ações do usuário. Animações com escopo por componente e limpeza ao desmontar. Respeitar `prefers-reduced-motion`.
- Mobile primeiro. Foco de teclado visível. Contraste AA.
- Textos de interface em português claro. Botão diz o que faz ("Salvar projeto", não "Enviar").

## Comandos

```bash
npm run dev        # desenvolvimento
npm run lint       # ESLint, sem avisos
npm run typecheck  # tipos das rotas + tsc
npm test           # Vitest
npm run build      # build de produção
npm run test:e2e   # Playwright, contra o build
npm run db:migrate # cria e aplica migration em desenvolvimento
npm run db:deploy  # aplica as migrations no banco
```
