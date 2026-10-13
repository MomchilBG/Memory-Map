# Memory Map

@AGENTS.md

## Project

Memory Map is an early-stage web app. The repository is a pnpm + Turborepo monorepo that so far contains only the scaffolding; features are tracked as GitHub issues on `MomchilBG/Memory-Map` (use the `gh` CLI to read them).

## Layout

- `apps/web` — the React Router v8 app (framework mode, Vite, Tailwind CSS v4). Next.js was removed in favour of React Router.
- `packages/ui` — shared React components, exported as source (`@repo/ui/*` maps to `src/*.tsx`).
- `packages/typescript-config` — shared `tsconfig` bases.
- `.agents/skills` and `apps/web/react-router` — vendored agent skills tracked by `skills-lock.json`. Do not edit or format them.

## Tooling

- Package manager: pnpm 11 (`packageManager` is pinned). Do not use npm or yarn, and do not commit a `package-lock.json`.
- Node 24 or newer is required by `engines`.
- TypeScript 7.
- Linting: oxlint with type-aware rules enabled (`.oxlintrc.json`, backed by `oxlint-tsgolint`).
- Formatting: oxfmt (`.oxfmtrc.json`). There is no ESLint or Prettier in this repo.
- Line endings are LF everywhere, enforced by `.gitattributes`.

## Commands

Run from the repository root:

- `pnpm dev` — start the dev servers.
- `pnpm build` — build all apps and packages.
- `pnpm lint` / `pnpm lint:fix` — run oxlint.
- `pnpm format` / `pnpm format:fix` — check or apply oxfmt formatting.
- `pnpm check-types` — type-check every package.
- `pnpm exec turbo run lint format check-types` — all checks in one go.

Lint and format are root tasks in `turbo.json` (`//#lint`, `//#format`), not per-package scripts.

## Workflow

- Work on a branch named after the issue, for example `2-add-linter-and-formatter`, and open a PR that closes the issue. Do not commit directly to `main`.
- Before finishing any change, run `pnpm exec turbo run lint format check-types` and fix whatever it reports.
- Always commit and push once the checks pass. Do not leave finished work uncommitted or wait to be asked.

## Roadmap

Planned work, each tracked as an open issue: API, database, auth, storage, the map itself, Electron and offline mode, oRPC with react-query, zod and OpenAPI, shadcn components, CI, E2E tests, Docker, a Render acceptance environment, dependabot, logging, error tracking, analytics and repo rules.
