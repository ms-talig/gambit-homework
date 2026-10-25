# Gambit — gated implementation plan

Global status: NOT STARTED. Only planning artifacts have been prepared. Every stage below requires its own explicit approval. Do not treat checked planning decisions as permission to code.

## Stage 0 — read-only orientation

Read CLAUDE.md, ARCHITECTURE.md, this plan, the assignment PDF, existing package/config/source files, and git status. Inspect visual references. Do not install, edit, run generators, commit or start subagents.

Report in English: current project state, differences from assumptions, any actual conflicts with the brief, and a short stage 1 proposal (files, result, checks). STOP.

## Stage 1 — typed data and local loading boundary

Scope: types/models.ts, data/resources.ts, data/getResources.ts. Include 8–12 varied resources and numeric openIssues. No real server or persistence. Do not build screens yet.

Acceptance: unique resource IDs, varied required enums, Promise<Resource[]> loader, no external requests. Lint/build pass. Explain the data model to Tali. STOP.

## Stage 2 — shared workspace state

Scope: workspace context/provider/hook and minimum root integration. Store resources/loading/error/applications; implement validated createApplication. Start with no groups. Keep relationships normalized.

Acceptance: correct initialization, safe async lifecycle, immutable updates, blank name/empty selection/unknown IDs rejected, valid creation returns new group, no persistence. Lint/build; state which behavior checks were possible without a finished UI. Do not introduce a test runner without approval. STOP.

## Stage 3 — shell, routes and visual foundation

Scope: React Router installation ONLY after explicit dependency approval; AppRoutes, AppLayout, Sidebar, minimal page placeholders, CSS tokens/modules/global foundation.

Acceptance: two navigation destinations, selected-group route, active links, root redirect and unknown-route behavior. Provider survives navigation. Browser back/forward work. Lint/build and actual browser navigation checks. STOP.

## Stage 4 — resource browsing and selection

Scope: needed primitives (Button, fields/SearchInput, Select, Checkbox, Panel, Table), ResourceFilters, ResourceTable, SelectionToolbar, ResourcesPage. No sorting or select-all.

Acceptance: exact required columns; name search plus three AND filters; selection survives filters; hidden selection is visible in count; clear selection; empty/no-result/loading/error states; reset local state on leaving route. Creation dialog is not implemented yet: clearly report this integration as pending rather than claiming a working creation flow. Lint/build and browser checks. STOP.

## Stage 5 — create Application

Scope: accessible Modal, TextArea if needed, CreateApplicationDialog, ResourcesPage creation integration. Propose native dialog/focus behavior before implementation.

Acceptance: create disabled with no selection; required trimmed name; optional description; cancel preserves row selection; form error preserves draft; valid submission adds exactly one group and navigates to its URL; no persistence. Check keyboard focus, Escape and focus restoration when the opener remains mounted. Lint/build. STOP.

## Stage 6 — Application list and SVG graph

Scope: ApplicationsPage, ApplicationList, ApplicationDetails, ApplicationGraph and CSS.

Acceptance: created groups listed; correct selected group based on URL; exact selected resources in graph; readable for one and all sample resources; empty/unselected/missing-group states; refresh behavior explained and handled. Lint/build and browser checks. STOP.

## Stage 7 — integrated review and delivery documentation

Scope: check completed core, fix approved issues, replace starter README with actual run instructions, built scope, tradeoffs, next steps and AI-use account. Proposed single run command: npm install && npm run dev; verify from a clean copy rather than assuming.

Review keyboard use, labels, narrow layouts, graph readability, no runtime console errors and the checklist below. Do not publish or submit. Lint/build and documented clean-copy launch. Report total observed effort and remaining limitations honestly. STOP.

Optional: targeted automated tests or an independent read-only review agent, ONLY after explicit approval of scope/dependencies/delegation. Sorting remains optional and separately approved.

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
- [ ] Lint/build pass; runtime console inspected.
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

For each approved stage append: scope approved, files changed, human decisions/review, checks/results, known limitations, approximate actual effort if measured. Do not invent times or outcomes.
