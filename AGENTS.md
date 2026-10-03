# AGENTS.md

NestJS + TypeORM + PostgreSQL task/project REST API. Single package, ESM (`"type": "module"`).

## Commands

- `npm run build` — nest build → `dist/`
- `npm run start:dev` — watch-mode dev server
- `npm run lint` — oxlint (`src/`, `test/`); no ESLint
- `npm run format` — prettier write on `src/**` and `test/**`
- `npm test` — vitest unit tests (`**/*.spec.ts`, globals enabled)
- `npm run test:e2e` — vitest with `vitest.config.e2e.ts` (`**/*.e2e-spec.ts`)
- Single test file: `npx vitest run src/projects/projects.service.spec.ts`

## Environment / DB gotchas

- Requires a running PostgreSQL; `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` have **no defaults** — app fails fast via zod validation without them. See `.env.example` / `.env`.
- `TypeOrmModule` uses `synchronize: true` (autoLoadEntities; schema auto-synced — no migrations). Data shape changes come from entity edits.
- e2e test (`test/app.e2e-spec.ts`) boots the full `AppModule`, so it needs the DB env vars and a reachable Postgres — it is not self-contained.
- App port and DB config come from `src/config/configuration.ts` + zod schema in `src/config/env.schema.ts`; add new env vars to both the schema and `configuration()`.

## Code conventions that differ from defaults

- NodeNext ESM: local imports in `src/` and `test/` use the `.js` extension (e.g. `import { AppModule } from './app.module.js'`). Keep this in new files.
- Vitest configs live at repo root (`vitest.config.ts`, `vitest.config.e2e.ts`); globals: true and vite-tsconfig-paths are set — don't import `describe`/`it`.
- Modules: `src/projects`, `src/tasks`, `src/config`; entrypoints `src/main.ts` → `AppModule` in `src/app.module.ts`.
- DTOs exist but are mostly empty stubs (`CreateTaskDto {}`); validation is not wired via class-validator/zod pipes — don't assume validation happens.
- Services throw plain `Error` for not-found, not Nest `NotFoundException` (see `projects.service.ts`); `findOne` returns a Promise but the check `if (!project)` runs before await in `findOne` (bug pattern to be aware of when editing).

## Verification order

`npm run lint` → `npm test` → (DB available?) `npm run test:e2e`.
