# Gambit frontend take-home — working agreement

Read ARCHITECTURE.md and PLAN.md before proposing work. These describe the agreed design; they do not authorize implementing all stages.

## Collaboration: strictly incremental

- Use English for all plans, explanations, completion reports, documentation, code comments, and user-facing application text. Explain one stage at a time in clear language.
- First session is READ ONLY: inspect the project and planning documents, report discrepancies, propose stage 1, then STOP.
- Before each implementation stage, explain the outcome, files to change, dependencies, and checks. Wait for explicit approval.
- Approval for one stage is not approval for the next. Implement only the approved stage, verify it, summarize, and STOP.
- Do not install or upgrade dependencies without explicit approval for that installation. React Router is an agreed design choice, but installation still needs approval.
- Do not spawn subagents, commit, push, publish, or deploy without explicit approval. Do not modify Git history.
- Do not enable auto-approval/skip-permissions modes or change permission settings.
- Preserve user changes. Report unexpected state before making conflicting changes.
- Do not invent requirements or add optional features to fill spare time.
- If blocked, explain the precise issue and propose a bounded next step. Do not silently expand scope.

## Current stack baseline

Checked package.json on 2026-10-25: React/React DOM 19, TypeScript ~6.0, Vite 8 with @vitejs/plugin-react, ESLint 10 flat config. Recheck actual files before work; do not upgrade this baseline automatically.

TypeScript has separate app/node project configs. Follow their restrictions, including type-only imports where required. No router, state library, formatter, or test runner is currently declared.

- npm run dev — development server
- npm run build — tsc -b && vite build
- npm run lint — eslint .
- npm run preview — production preview

## Scope and verification

- Client memory only. No backend, JSON Server, localStorage, sessionStorage, or IndexedDB.
- Use CSS Modules and shared CSS variables. Reusable UI components live in src/components/ui.
- Use the course code as a reference, not a wholesale copy. Adapt to TypeScript and accessibility requirements.
- Run relevant checks for the approved change, normally lint and build after implementation. Report passed, failed, and not checked separately.
- Lint/build do not prove UI behavior. Use the browser acceptance checklist in PLAN.md and state who performed each check.
- Report remaining limitations honestly. Never claim a browser check or automated test that was not performed.
- Keep a short factual AI-use record in PLAN.md after approved stages, for the final README. Documentation updates for the completed stage are part of its scope.

## Completion report format

1. What changed and why (brief English).
2. Files changed.
3. Checks and observed results.
4. Limitations or unresolved issues.
5. Proposed next stage — STOP and wait.


## Testing strategy and file organization

- Use Vitest, React Testing Library, user-event, and jsdom.
- Focus on integration tests for user behavior. Add unit tests
  for standalone logic where useful.
- E2E testing is outside the current scope.

### Test location

- Keep all test files in a root-level `tests/` directory.
- Mirror the relevant `src/` directory structure inside `tests/`.
- Do not place test files alongside production source files.
- Keep shared test setup in `tests/setup.ts`.
- Example:
  `src/features/resources/ResourcesPage.tsx`
  → `tests/features/resources/ResourcesPage.test.tsx`.

### Incremental workflow

- Before installing test dependencies or changing configuration,
  propose the changes and wait for explicit approval.
- Configure test discovery and TypeScript support for `tests/`.
- Before implementing each feature, propose its test scenarios
  as part of the stage plan.
- Write the approved tests alongside the feature implementation.
- Test observable behavior rather than internal component state.
- Run relevant tests, lint, and build after implementation.
- Report passed, failed, and unperformed checks, then stop.

This section supersedes earlier guidance that treated automated
testing as optional or placed test files alongside source files.
Update ARCHITECTURE.md and PLAN.md to match this decision during
the next explicitly approved documentation step.
