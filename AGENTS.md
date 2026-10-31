<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wanderlust Frontend

Single Next.js 16 App Router app (not a monorepo). App entry: `src/app/layout.tsx` + `src/app/page.tsx`. Path alias `@/*` → `./src/*`. Node >= 22 required.

## Commands

- Dev: `npm run dev` (Turbopack is the default bundler in Next 16)
- Lint: `npm run lint` (flat config: eslint-config-next core-web-vitals + TypeScript)
- Typecheck: no script exists — run `npx tsc --noEmit`
- Tests: no test runner is set up. Verification order: `npm run lint` → `npx tsc --noEmit` → `npm run build` (build also typechecks)

## Stack quirks

- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts` + `babel-plugin-react-compiler`). It hard-errors on rules-of-React violations (e.g. mutating props). Don't reflexively add `useMemo`/`memo` — the compiler handles memoization.
- **Tailwind CSS v4**: there is no `tailwind.config`. The theme lives in `src/app/globals.css` (`@theme inline`, oklch CSS variables, `@custom-variant dark`). CSS is compiled through the `@tailwindcss/turbopack` loader rule in `next.config.ts` — it only works under Turbopack.
- **shadcn v4 with `base-nova` style** (`components.json`): UI primitives are `@base-ui/react`, **not Radix**. Copy-pasting older Radix-based shadcn snippets will break. Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.
- `cn` is the `cn` npm package (drop-in replacement for clsx + tailwind-merge), re-exported from `src/lib/utils.ts`.
- **Typed route helpers are globals** in Next 16 — layouts use `LayoutProps<"/">` and pages `PageProps<"/route">` with no import. Type `params`/`searchParams` through these helpers (they are Promises); don't hand-write `{ params: Promise<{ slug: string }> }`.

## Gotchas

- Root-level `tslib-2.9.1.tgz` is untracked and referenced by nothing in `package.json` — leave it alone unless asked.
- `.env*` files are gitignored and none are checked in; add env vars locally only.
- `README.md` is stock create-next-app boilerplate (paths like `app/page.tsx` are stale — code lives under `src/app/`). Don't trust it over the config.
