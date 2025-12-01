# Repository Guidelines

## Project Structure & Module Organization
- App Router: use `app/`. Co-locate route components — `app/.../page.tsx` with a matching `actions.ts` for server actions.
- API routes: store handlers in `app/api/<route>/route.ts` (one `route.ts` per endpoint).
- Components: keep shared UI in `components/` with ShadCN primitives under `components/ui`. Always start from these primitives.
- Shared code: `hooks/`, `lib/`, and `utils/` (TypeScript, named exports).
- Static assets: `public/` (served from `/`).
- Tests: none exist yet; when contributing, add tests near the changed code.

## Build, Test, and Development Commands
- Dev: `npm run dev` — start Next.js with HMR.
- Build: `npm run build` — production build.
- Start: `npm run start` — serve the production build.
- Lint: `npm run lint` — ESLint for Next.js + TS.
- Format: `npm run format` — Prettier (project standard).
- Type-check: `npm run typecheck` — `tsc --noEmit`.
- Tests (once added): `npm test` (unit), `npm run e2e` (Playwright, optional).

## Coding Style & Naming Conventions
- Language: TypeScript-only; 4-space indentation; rely on Prettier for formatting.
- Files: components `PascalCase.tsx`; hooks `useSomething.ts`; utilities `camelCase.ts`.
- Routes: dynamic segments `[id]`; API handlers live under `app/api/.../route.ts`.
- CSS: Tailwind ONLY for component styling. Avoid CSS Modules and ad-hoc global CSS (keep `app/globals.css` minimal).
- UI: compose from ShadCN components in `components/ui`; extend via lightweight wrappers in `components/`.

## Testing Guidelines
- Current state: no tests. Add tests for new functionality and bug fixes.
- Unit/integration: colocate `*.test.ts(x)` with the source or under a nearby `__tests__/`.
- Use `@testing-library/react` for DOM behavior; mock `next/navigation` as needed.
- Coverage: target ≥ 80% for changed lines to start.
- Commands: `npm test -- --watch` locally; `npm test -- --coverage` in CI.

## Commit & Pull Request Guidelines
- Commits: conventional style (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Imperative subject ≤ 72 chars.
- PRs: include a clear description, linked issues, and screenshots/GIFs for UI changes. Note accessibility/performance impacts.
- Checks: PRs must pass lint, type-check, build, and tests (when present). Update docs when behavior changes.

## Security & Configuration Tips
- Secrets: never commit. Use `.env.local` for development and provide `env.example` placeholders.
- Images: whitelist domains in `next.config.js` via `images.domains`.
- Headers: add security headers via `next.config.js` or middleware.
