# Gambit — gated implementation plan

Global status: Stages 0, 0.5 and 0.6 complete. Feature implementation not started. Every stage below requires its own explicit approval. Do not treat checked planning decisions as permission to code.

Testing rule: from Stage 1 on, each stage proposes its test scenarios in its stage plan, writes the approved tests alongside the implementation, and runs npm run test:run, lint and build. Keep tests proportionate to the timebox and avoid duplicating behavior across suites (ARCHITECTURE §10).

## Stage 0 — read-only orientation

Read CLAUDE.md, ARCHITECTURE.md, this plan, the assignment PDF, existing package/config/source files, and git status. Inspect visual references. Do not install, edit, run generators, commit or start subagents.

Report in English: current project state, differences from assumptions, any actual conflicts with the brief, and a short stage 1 proposal (files, result, checks). STOP.

## Stage 0.6 — test infrastructure

Scope: install vitest, @testing-library/react, @testing-library/dom, @testing-library/user-event and jsdom ONLY after explicit dependency approval. The installation proposal verifies versions and required peer dependencies against React 19, Vite 8 and TypeScript 6, and proposes @testing-library/jest-dom matchers as an option. Add scripts "test": "vitest" (watch) and "test:run": "vitest run" (completion checks). Configure Vitest with the jsdom environment, tests/setup.ts and tests/** discovery; add TypeScript and ESLint coverage for tests/. Add one smoke test (tests/App.test.tsx) proving the setup works. No feature code.

Acceptance: npm run test:run, lint and build pass; production build excludes tests. STOP.

## Stage 1 — typed data and local loading boundary

Scope: types/models.ts, data/resources.ts, data/getResources.ts. Include 8–12 varied resources and numeric openIssues. No real server or persistence. Do not build screens yet.

Acceptance: unique resource IDs, varied required enums, Promise<Resource[]> loader, no external requests. Lint/build pass. No dedicated tests: fixtures are exercised through later integration tests. Explain the data model to Tali. STOP.

## Stage 2 — shared workspace state

Scope: workspace context/provider/hook and minimum root integration. Store resources/loading/error/applications; implement validated createApplication. Start with no groups. Keep relationships normalized.

Acceptance: correct initialization, safe async lifecycle, immutable updates, blank name/empty selection/unknown IDs rejected, valid creation returns new group, no persistence. Tests cover action-level integrity the UI cannot reach: unknown IDs rejected, duplicate IDs removed, valid creation returns the group. Tests/lint/build. STOP.

## Stage 3 — shell, routes and visual foundation

Scope: React Router installation ONLY after explicit dependency approval; AppRoutes, AppLayout, Sidebar, minimal page placeholders, CSS tokens/modules/global foundation.

Acceptance: two navigation destinations, selected-group route, active links, root redirect and unknown-route behavior. Provider survives navigation. Browser back/forward work. No required automated tests. Lint/build and actual browser navigation checks. STOP.

## Stage 4 — resource browsing and selection

Scope: needed primitives (Button, fields/SearchInput, Select, Checkbox, Panel, Table), ResourceFilters, ResourceTable, SelectionToolbar, ResourcesPage. No sorting or select-all.

Acceptance: exact required columns; name search plus three AND filters; selection survives filters; hidden selection is visible in count; clear selection; empty/no-result/loading/error states; reset local state on leaving route. Creation dialog is not implemented yet: clearly report this integration as pending rather than claiming a working creation flow. Integration tests: search plus filters combine (AND); selection survives filtering with hidden count shown. Tests/lint/build and browser checks. STOP.

## Stage 5 — create Application

Scope: accessible Modal, TextArea if needed, CreateApplicationDialog, ResourcesPage creation integration. Propose native dialog/focus behavior before implementation.

Acceptance: create disabled with no selection; required trimmed name; optional description; cancel preserves row selection; form error preserves draft; valid submission adds exactly one group and navigates to its URL; no persistence. Check keyboard focus, Escape and focus restoration when the opener remains mounted. Integration tests: blank/whitespace name rejected with draft preserved; valid submission creates the group and navigates to its URL. jsdom has limited native dialog support, so focus/Escape are browser checks; settle the dialog testing approach in this stage's proposal. Tests/lint/build. STOP.

## Stage 6 — Application list and SVG graph

Scope: ApplicationsPage, ApplicationList, ApplicationDetails, ApplicationGraph and CSS.

Acceptance: created groups listed; correct selected group based on URL; exact selected resources in graph; readable for one and all sample resources; empty/unselected/missing-group states; refresh behavior explained and handled. Integration tests: a created group shows exactly its member resources; a missing Application URL shows the not-found state. Unit-test graph layout only if its logic is non-trivial. Tests/lint/build and browser checks. STOP.

## Stage 7 — integrated review and delivery documentation

Scope: check completed core, fix approved issues, replace starter README with actual run instructions, built scope, tradeoffs, next steps and AI-use account. Proposed single run command: npm install && npm run dev; verify from a clean copy rather than assuming.

Review keyboard use, labels, narrow layouts, graph readability, no runtime console errors and the checklist below. Do not publish or submit. Full test:run, lint/build and documented clean-copy launch. Report total observed effort and remaining limitations honestly. STOP.

Optional: an independent read-only review agent, ONLY after explicit approval of scope/delegation. Sorting remains optional and separately approved.

## End-to-end acceptance checklist

- [ ] Fixtures load; required columns visible.
- [ ] Search is case-insensitive and matches name substrings.
- [ ] Provider/environment/criticality filters work together.
- [ ] No-result state differs from empty data and loading/error.
- [ ] Select multiple rows, filter some away, observe hidden count; all selected IDs reach creation.
- [ ] Clear selection and disabled create behavior work.
- [ ] Blank/whitespace name rejected; optional description allowed.
- [ ] Cancel then reopen gives a fresh form and preserves row selection.
- [ ] Create adds one group, navigates to it, displays exact member resources.
- [ ] Same resource can belong to multiple groups without copies in stored group data.
- [ ] Navigation preserves groups, resets Resources local filters/selection.
- [ ] Back/forward selects expected routes/groups.
- [ ] Refresh clears groups; stale detail URL is handled without crashing.
- [ ] Graph readable with one and maximum fixture count.
- [ ] Keyboard navigation, labels, modal focus/Escape and visible focus checked.
- [ ] test:run, lint and build pass; runtime console inspected.
- [ ] Fresh-copy launch works with documented command.

Record checks as performed, failed, or not checked, with observations. Do not pre-check this list.

## Optional delegation contract

No delegation currently authorized. If later approved, specify agent goal, allowed files, fixed props/types, forbidden areas, dependencies and acceptance checks. Main Claude owns integration and reviews the output. Do not let agents concurrently edit the same files. A bounded read-only review is the preferred first delegation.

## Work and AI-use record

Planning: architecture and gated workflow prepared collaboratively with Tali using Codex. Implementation has not started under this plan.

Stage 0 (read-only orientation, Claude Code): inspected docs, mockups, brief, config, source and git status. Flagged outdated testing instructions in ARCHITECTURE.md and PLAN.md (not yet updated) and that starter cleanup was not a planned stage.

Stage 0.5 (Vite starter cleanup, Claude Code; approved by Tali as an interim stage):
- Scope: remove Vite demo content, keep a minimal working React app. No dependency, config or file-structure changes.
- Files changed: src/main.tsx (removed index.css import), src/App.tsx (minimal heading), index.html (title "Gambit Cloud Resources").
- Removed: src/App.css, src/index.css, src/assets/{hero.png, react.svg, vite.svg}, public/icons.svg. Tali deleted these manually after Claude's delete command was blocked by the permission system.
- Human decisions: Tali approved scope, declined an initial commit, performed file deletion, and owns the visual browser check.
- Checks: no references to removed files; npm run lint passed; npm run build passed; dev server started and served index, main.tsx and favicon (HTTP 200, checked by Claude). Visual browser check: assigned to Tali, result not recorded here.
- Limitations: README still the Vite template (Stage 7); favicon still the Vite logo.

Documentation update (testing strategy, Claude Code; approved by Tali with adjustments):
- Scope: align ARCHITECTURE.md and PLAN.md with the CLAUDE.md testing decision; remove the now-stale sync instruction from CLAUDE.md. No code, config or dependency changes.
- Files changed: ARCHITECTURE.md (§1 scope note, tests/ in §9 tree, new §10 Testing, references renumbered to §11), PLAN.md (status, testing rule, Stage 0.6, per-stage tests, checklist), CLAUDE.md.
- Human decisions: Tali required proportionate tests focused on five priority behaviors, no fixture/trivial-wrapper tests, no duplicated suites, test/test:run scripts, peer-dependency verification including @testing-library/dom, and jest-dom kept as a Stage 0.6 proposal.
- Checks: stale-phrase search and diff review. Lint/build not run (documentation only).

Stage 0.6 (test infrastructure, Claude Code; approved by Tali):
- Compatibility checked first (Node 24.20, React 19.3, Vite 8.3, TypeScript 6.0): all engines and peer ranges satisfied; existing dependency versions unchanged.
- Installed dev dependencies: vitest 5.0.5, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/user-event 14.6.8, @testing-library/jest-dom 7.0.1, jsdom 30.1.3.
- Files changed: package.json/package-lock.json (dev dependencies, "test": "vitest", "test:run": "vitest run"), vite.config.ts (test block: jsdom, tests/**/*.test.{ts,tsx}, tests/setup.ts), tsconfig.json (reference), new tsconfig.test.json (extends app config, includes tests/), new tests/setup.ts (jest-dom matchers, RTL cleanup), new tests/App.test.tsx (smoke test for the heading). ESLint needed no change: its **/*.{ts,tsx} pattern already lints tests/.
- Checks (run by Claude): test:run passed (1 file, 1 test); lint passed; build passed and type-checks tests/ through tsc -b; no test code in dist.
- Limitations: npm reported unapproved install scripts for optional fsevents; left unapproved, not needed for tests.

For each approved stage append: scope approved, files changed, human decisions/review, checks/results, known limitations, approximate actual effort if measured. Do not invent times or outcomes.
