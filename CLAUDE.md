# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo is the **early scaffold** for the StackHR web app (a React + Vite + TypeScript rebuild). Right now `src/` still contains the unmodified default Vite template (`App.tsx` renders the Vite/React starter page) — there is no routing, state management, API layer, auth, or backend code here yet. Don't assume any of the infrastructure described below already exists in this repo; check before relying on it.

`StackHR-MVP-Technical-Specification-aligned.md` documents the **target product** (a live, deployed HR/Payroll/Spend platform for African SMEs) that this codebase is presumably being built toward or alongside. Key facts from that spec worth knowing when working here:

- Product: unifies People Ops, Payroll Ops, and Spend Ops (employees, leave, payroll/tax compliance, expenses, reimbursements, salary advances, approvals, RBAC) for African SMEs, beta live at app.stackhr.app.
- Target stack per the spec: BetterAuth (auth), NeonDB PostgreSQL + Postgres RLS (multi-tenant, `org_id`-scoped), Cloudflare R2 (storage), Sendbyte (email), Anchor (NGN payments, test mode), Vercel (hosting, auto-deploy on push), Sentry (errors), GA4 (analytics), Playwright (E2E). **None of these are wired into this repo yet** — `package.json` currently only has `react`, `react-dom`, and Vite tooling.
- Payroll is designed as a rule-based compliance engine: tax rules (e.g. `NG-2026-v1`, `NG-2025`) are versioned and selected automatically by payroll period, kept separate from the payroll engine version and from per-run settings snapshots, so historical runs never silently change when rules are updated later.
- Roles are Admin / Manager / Employee, access is purely role-based (no tier-based feature gating yet).

Treat the spec as background/context for product direction, not as a description of code that exists in this checkout.

## Commands

Package manager is **bun** (`bun.lock` is present — use `bun`, not `npm`/`yarn`).

```bash
bun install       # install dependencies
bun run dev        # start Vite dev server with HMR
bun run build       # type-check (tsc -b) then production build via Vite
bun run lint        # ESLint over the whole repo
bun run preview     # preview the production build locally
```

There is no test script configured in `package.json` yet. The `webapp-testing` skill (`.agents/skills/webapp-testing/`) is available for writing Playwright-based browser tests against the dev server when testing is needed — see `scripts/with_server.py --help` for managing the dev server lifecycle during automated tests.

## Architecture notes

- Build tooling: Vite 8 + `@vitejs/plugin-react`, TypeScript ~6 in project-references mode (`tsconfig.json` → `tsconfig.app.json` for `src/`, `tsconfig.node.json` for Vite config). `tsconfig.app.json` has `noUnusedLocals`/`noUnusedParameters`/`verbatimModuleSyntax` enabled — unused imports/vars and non-type-only type imports will fail the build.
- Linting: flat ESLint config (`eslint.config.js`) using `typescript-eslint` recommended rules, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-flavored). `dist` is ignored.
- Styling is plain CSS with custom properties (see `src/index.css`, `src/App.css`) — **Tailwind is not installed** despite a `tailwind-design-system` skill being present in `.agents/skills/`; don't assume Tailwind classes will work without adding the dependency first.
- Icons are served as an SVG sprite from `public/icons.svg` and referenced via `<use href="/icons.svg#...">`.
- `.agents/skills/` holds project-level agent skills pulled in via `skills-lock.json` (apple-design, emil-design-eng, tailwind-design-system, webapp-testing) — consult these for design/UI conventions and testing workflows when relevant to the task at hand.
