# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontend SPA for StackHR — an HR / Payroll / Spend platform for African SMEs (People Ops, Payroll Ops, Spend Ops, Compliance). React 19 + Vite 8 + TypeScript, talking to a separate REST backend (not in this repo). `StackHR-MVP-Technical-Specification-aligned.md` describes the target product (payroll as a versioned, rule-based tax compliance engine; Admin / Manager / Employee RBAC); treat it as product context, not a description of this code. `docs/*.md` hold backend endpoint contracts for the features being integrated, and `sidebar.md` is the intended nav IA.

## Commands

Package manager is **bun** (use `bun`, not npm/yarn).

```bash
bun install                      # run after every pull — missing deps make Vite fail with "could not be resolved"
bun run dev                      # Vite dev server on :5173
bun run build                    # tsc -b, then vite build
bun run lint                     # ESLint (flat config)
bun test                         # unit tests in tests/*.test.ts (bun:test)
bun test tests/people-api.test.ts          # single file
bun test -t "creates a department"         # single test by name
```

Unit tests exercise the API modules by swapping `http.defaults.adapter` for a stub that captures the outgoing request, then asserting URL/method/body — follow that pattern for new API tests. `tests/auth-flow.e2e.py` is a Playwright script driven by `.agents/skills/webapp-testing/scripts/with_server.py`; note that the `test:e2e:mock` script sets `VITE_USE_MOCK_AUTH`, but nothing in `src/` reads that flag any more.

Deploys are static builds (`netlify.toml`, `render.yaml`) with an SPA fallback rewrite to `index.html`.

## Environment

Copy `.env.example` to `.env`. `VITE_API_BASE_URL` is the backend base (e.g. `http://localhost:3001/v1/api`). The backend sends no CORS headers for localhost, so in dev `vite.config.ts` proxies the URL's path to its origin and `src/lib/env.ts` rewrites `API_BASE_URL` to the bare path; use `resolveApiUrl()` for server-relative file URLs (e.g. document downloads).

`VITE_USE_MOCK_SETTINGS` / `VITE_USE_MOCK_PAYROLL` / `VITE_USE_MOCK_SPEND` default to **mocked** unless set to the string `"false"`.

## Architecture

**Feature folders.** `src/features/<feature>/` each with some of: `api/`, `hooks/`, `pages/`, `components/`, `schemas/` (zod), `types/`, `lib/` (pure helpers), `data/` (static/mock data), `store/` (zustand). Shared UI primitives are in `src/components/ui/`, shared utilities in `src/lib/`. All routes are declared in `src/App.tsx`.

**Data flow: page → hook → api → `http`.**
- `src/lib/http.ts` is the single axios instance (`withCredentials`, cookie session). Its response interceptor **unwraps the `{ success, message, data }` envelope**, so API functions receive `data` directly. A 401 clears the auth session, except on `/auth/*` credential checks (other than `/auth/me`).
- Each feature's `*-api.ts` exports an object of request functions. Features that still have mock backends (settings, team-access, payroll, spend) add a `*-mock-api.ts` with the same shape and a `*-service.ts` that picks one based on the env flag — hooks import the **service**, not the api directly.
- Hooks wrap TanStack Query. Query keys are arrays namespaced by feature (`['people', 'leave', ...]`); mutations invalidate the feature prefix on success. Use `getApiErrorMessage()` from `lib/http.ts` for user-facing errors and `lib/toast.ts`/sonner for notifications. `lib/api-enum.ts` converts between UI and backend enum casing.
- The global `QueryClient` (`src/main.tsx`) doesn't retry 4xx and is cleared whenever the logged-in user changes.

**Auth & roles.** `features/auth/store/auth-store.ts` (zustand `persist`) holds the user; "remember me" decides localStorage vs sessionStorage. `routing/protected-route.tsx` gates on a session and runs `useSyncSession`; `routing/role-route.tsx` redirects roles the backend would 403. Roles are `admin | manager | employee`: `/people`, `/payroll`, `/compliance`, `/reports`, `/settings` are admin-only; `/spend` is admin+manager; `/me/*` is the employee self-service area (wrapped in `EmployeeRecordGate`, which requires an employee record); `/` renders the admin or employee dashboard by role. When adding a page, update both the route in `App.tsx` and `features/dashboard/components/sidebar-nav-data.ts`.

**Forms.** react-hook-form + zod via `@hookform/resolvers`, schemas in each feature's `schemas/`.

## TypeScript / lint gotchas

`tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` and `erasableSyntaxOnly` — unused symbols fail the build, type-only imports must use `import type`, and TS `enum`s / parameter properties are not allowed (use union types / `as const`).

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`, configured CSS-first in `src/index.css` (`@theme` block — there is no `tailwind.config`). Use the semantic tokens (`bg-canvas`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `rounded-card`, `shadow-panel`, …) rather than raw colors; dark mode is handled by redefining those tokens under `prefers-color-scheme`. Merge classes with `cn()` (`src/lib/cn.ts`, clsx + tailwind-merge); component variants use `class-variance-authority` (see `components/ui/button.tsx`). Icons come from `@phosphor-icons/react`; motion from `framer-motion`.

`.agents/skills/` contains project design and testing skills (apple-design, emil-design-eng, frontend-design, design-taste-frontend, tailwind-design-system, webapp-testing, product-marketing). Check them for UI conventions.
