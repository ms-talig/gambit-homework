# Gambit — gated implementation plan

Global status: Stages 0, 0.5, 0.6 and 1–6 complete. Stage 7 not started. Every stage below requires its own explicit approval. Do not treat checked planning decisions as permission to code.

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
- [ ] Refresh and typed URLs keep groups in the same tab; a new tab starts empty; stale detail URL is handled without crashing.
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

Stage 1 (typed data and local loader, Claude Code; approved by Tali):
- Files added: src/types/models.ts (union types, Resource with openIssues, Application, CreateApplicationInput), src/data/resources.ts (11 resources), src/data/getResources.ts (async local loader).
- Human decisions: Tali required getResources to return independent copies of each resource including its tags array, not just a shallow array copy.
- Dataset: unique IDs r-001..r-011; AWS 5 / GCP 3 / Azure 3; production 6 / staging 3 / development 2; critical 2 / high 4 / medium 3 / low 2; openIssues 0–5. Shared name words ("payment", "api", "analytics", "customer-portal") make search return several rows; AWS + production + high returns three rows for combined-filter checks.
- Checks (run by Claude): test:run passed (existing smoke test); lint passed; build passed (type-checks the fixtures). Ad-hoc Node script (not a committed test) confirmed the counts above and that mutating a returned resource's name and tags left the fixtures and later calls unchanged.
- Limitations: data is not yet used by any screen; no dedicated tests per plan.

Stage 2 (shared workspace state, Claude Code; approved by Tali):
- Files added: src/workspace/WorkspaceContext.ts (context, WorkspaceValue, CreateApplicationResult), WorkspaceProvider.tsx, useWorkspace.ts, buildApplication.ts; tests/workspace/buildApplication.test.ts, tests/workspace/WorkspaceProvider.test.tsx. Modified: src/App.tsx (wrapped in WorkspaceProvider; no visible change).
- Design: resource loading is one discriminated-union state (loading/ready/error), exposed as resources, resourcesStatus and resourcesError; applications start empty; loading effect ignores stale completions. createApplication checks resourcesStatus, then calls pure buildApplication (trim name/description, dedupe IDs, reject blank name, empty selection and unknown IDs), and appends with a functional update.
- Human decisions: Tali required the app-N ID counter to be scoped to the provider instance (useRef) and generated outside the state updater, and the loading-status check to stay in createApplication rather than the pure function. Counter chosen over crypto.randomUUID because randomUUID needs a secure context.
- Checks (run by Claude): test:run passed (3 files, 7 tests; no act warnings); lint passed; build passed.
- Limitations: no UI consumes the workspace yet; error state is not reachable with local fixtures and is not tested.
- Review follow-up (requested by Tali): user-facing messages moved to src/workspace/messages.ts (WORKSPACE_MESSAGES), the ID prefix to a constant, and resource statuses to RESOURCES_STATUS with the type derived from it; tests reference the same constants. test:run, lint and build passed.

Stage 3 (shell, routes and visual foundation, Claude Code; approved by Tali):
- Dependency: react-router 8.5.0 (peers react/react-dom >=19.2.7, Node >=22.22 satisfied; declarative API verified in the package before install). No other package versions changed.
- Files: src/App.tsx moved to src/app/App.tsx (BrowserRouter > WorkspaceProvider > AppRoutes); new src/app/AppRoutes.tsx, routes.ts (ROUTES, APPLICATION_ID_PARAM, applicationPath), uiText.ts (UI_TEXT), NotFoundPage.tsx; src/layout/AppLayout and Sidebar (+ CSS modules); src/components/ui/PageHeader (+ CSS module) and icons.tsx; placeholder ResourcesPage and ApplicationsPage; src/styles/tokens.css and globals.css; src/main.tsx imports. Smoke test moved to tests/app/App.test.tsx and now checks the / → /resources redirect.
- Design: / redirects with replace; /applications and /applications/:applicationId share ApplicationsPage; * shows not-found inside the layout. Sidebar uses NavLink and styles the active link via aria-current, so Applications stays active on detail URLs. Below 720px the sidebar becomes a top bar.
- Checks (run by Claude): test:run passed (3 files, 7 tests); lint passed; build passed; dev server served /, /resources, /applications, /applications/app-1 and /xyz (HTTP 200). Browser checks: assigned to Tali, results not recorded here.
- Limitations: pages are placeholders; the 720px breakpoint is duplicated in two CSS modules because CSS variables cannot be used in media queries.

Stage 4 (resource browsing and selection, Claude Code; approved by Tali):
- Files: src/types/models.ts (PROVIDERS/ENVIRONMENTS/CRITICALITIES constants, types derived); src/components/ui Button (+ buttonVariants.ts), SearchInput, Select, Checkbox, Badge, VisuallyHidden, Table, each with a CSS module, plus Search/ChevronDown icons; src/features/resources resourceFilters.ts, ResourceFilters, ResourceTable, SelectionToolbar, ResourcesPage (+ CSS modules); src/app/uiText.ts (all Resources text); tokens.css (badge, selected-row, control and icon-size tokens); tests/features/resources/ResourcesPage.test.tsx.
- Design: filters and selected IDs live in ResourcesPage (reset on leaving the route); visible rows and hidden-selected count are derived, not stored. Search is case-insensitive substring on name; filters combine with AND; "All" removes a restriction. Loading, error, empty-data and no-results states are distinct. Name cells are row headers; row checkboxes have resource-specific accessible names; the table scrolls horizontally inside its container.
- Contract adjustments (kept minimal at Tali's request): SearchInput is standalone (TextField deferred to Stage 5, when the dialog needs it); no Panel yet; Badge and VisuallyHidden added for criticality pills and the checkbox column header; Select and SearchInput generate or take accessible labels instead of an id prop. Create Application button deferred to Stage 5 with the dialog.
- Human decisions: Tali required the combined-filter test to exercise search, provider, environment and criticality together.
- Checks (run by Claude): test:run passed (4 files, 9 tests); lint passed; build passed. Browser checks (Stage 3 navigation and Stage 4 screen): assigned to Tali, results not recorded here.
- Limitations: no sorting or select-all (out of scope); creation flow pending Stage 5.

Stage 5 (create Application, Claude Code; approved by Tali):
- Files: new src/components/ui Modal, Field (shared label/error layout), TextField, TextArea (+ CSS modules); new src/features/resources/CreateApplicationDialog (+ CSS module); SelectionToolbar (Create button, canCreate/onCreate); ResourcesPage (dialog state, submit, navigation); uiText.ts (dialog text); tokens.css (shadow, backdrop); tests/setup.ts (dialog stand-in); ResourcesPage.test.tsx (router wrapper, two new tests).
- Design: native <dialog> opened with showModal while mounted (rendered conditionally, so each opening has a fresh draft); initial focus on the name field; focus returns to the opener on close if it still exists; Escape (cancel event) and Cancel close and discard the draft but keep the row selection; backdrop clicks do not close, to avoid losing input. Blank names get immediate field feedback (aria-invalid + aria-describedby, focus moved to the field); createApplication still validates; other failures show as an alert with the draft kept. Success closes the dialog, clears the selection and navigates to applicationPath(id).
- Human decisions: Tali approved native dialog semantics with a minimal test-only showModal/close stand-in (jsdom lacks both), and required the success test to verify exactly one Application with the selected resource IDs in addition to navigation.
- Checks (run by Claude): test:run passed (4 files, 11 tests); lint passed; build passed. Focus containment, Escape, focus restoration and backdrop behavior need the browser: assigned to Tali, results not recorded here.
- Limitations: the Applications page is still a placeholder (Stage 6), so after creation it shows only the selected ID.

Stage 6 (Application list and SVG graph, Claude Code; approved by Tali):
- Files: src/features/applications ApplicationsPage (replaces placeholder), ApplicationList, ApplicationDetails, ApplicationGraph, graphLayout.ts (+ CSS modules); src/components/ui Panel (+ CSS module), CubeIcon; VisuallyHidden now renders a div so it can wrap a list; uiText.ts (Applications text; placeholder label removed); tokens.css (on-accent colors, xs font size); tests/features/applications ApplicationsPage.test.tsx and graphLayout.test.ts.
- Design: the selected application comes only from the URL; the page resolves member resources by ID from shared state. States: empty (link to Resources), list + select prompt, not found (explains in-memory data and refresh, links to /applications), list + details. Graph: pure deterministic layout places nodes evenly on an ellipse, growing it until no boxes overlap; the SVG scales to its panel down to 80% and then scrolls inside the panel so labels stay readable; long labels are shortened with an ellipsis. The SVG is one labelled image; a visually hidden list gives screen readers the member names and types.
- Measured layout: 1–2 nodes ~232px wide, 3–6 ~680px, 11 nodes ~1024×588px (scrolls inside the panel below ~820px).
- Checks (run by Claude): test:run passed (6 files, 24 tests: member list matches the created selection exactly; missing URL shows not-found and its link works; no overlaps and in-bounds layout for 1–11 nodes); lint passed; build passed. Browser checks: assigned to Tali, results not recorded here.
- Limitations: no per-type node icons from the mockup; with all 11 resources the graph needs horizontal scrolling in narrower windows.

Post-Stage 6 change: tab-scoped persistence (Claude Code; requested and approved by Tali):
- Trigger: during browser QA, Tali found that typing a URL (a full page load) cleared all Applications, and decided this was unacceptable. Memory-only state cannot survive a page load, so the documented "no browser storage" rule was lifted for sessionStorage only.
- Files: new src/workspace/applicationStorage.ts (load with shape validation, save, prune unknown resource IDs) and applicationIds.ts (ID format, next number after the highest saved ID); WorkspaceProvider (lazy load, save on change, prune once resources load; counter starts after saved IDs); uiText.ts (not-found message); tests/setup.ts (clear storage between tests); tests: sidebar navigation keeps applications (ApplicationsPage), remount restores applications with unique IDs (WorkspaceProvider), malformed data and pruning (applicationStorage). CLAUDE.md, ARCHITECTURE.md §1/§3/§4 and the checklist updated.
- Checks (run by Claude): test:run passed (7 files, 28 tests); lint passed; build passed. Browser check of reload/typed-URL behavior: assigned to Tali.
- Limitations: data is per tab (a new tab starts empty); closing the tab clears it.

Post-Stage 6 change: header select-all (Claude Code; requested by Tali, reversing the earlier "omit select-all" decision):
- Behavior: acts on shown rows only; partially checked when some shown rows are selected; hidden selections are never changed.
- Files: Checkbox (optional indeterminate, set as a DOM property), ResourceTable (header checkbox, onToggleAllShown), ResourcesPage (toggleAllShown), uiText.ts (selectAllShown; unused column label removed), ARCHITECTURE.md §7; test in ResourcesPage.test.tsx.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed. Browser check: assigned to Tali.

Stage 7, part 1: review fixes (Claude Code; read-only review reported first, fixes 1–6 approved by Tali):
- Long unbroken names/descriptions overflowed the Applications list (found by Tali): body overflow-wrap: break-word; list descriptions clamp to 2 lines.
- Docs: CLAUDE.md router line corrected; ARCHITECTURE.md §1 and §6 component contracts updated to what was built (Field, Badge, VisuallyHidden added; SearchInput standalone; fields generate ids; Modal behavior; Checkbox indeterminate; Table props).
- Dialog: name error clears as soon as the name is valid; name limited to 60 and description to 300 characters (UI limits).
- uiText.ts: one resourceNoun helper replaces five copies of the singular/plural logic; unused --shadow-sm token removed.
- Checks (run by Claude): test:run passed (7 files, 29 tests; blank-name test now also checks the error clears); lint passed; build passed.
- Open: favicon and per-route tab titles (optional polish, awaiting Tali's decision); README, fresh-clone check and final report pending.

Documentation move (Claude Code; approved by Tali):
- ARCHITECTURE.md, PLAN.md and visuals/ moved into docs/ with git mv; CLAUDE.md stays in the root because Claude Code loads it from there. Current path references updated in CLAUDE.md and ARCHITECTURE.md §11; earlier log entries left as written.
- Checks: reference search only. No code or config changes, so test:run, lint and build were not run.

Workspace types refactor (Claude Code; proposed by Tali, plan approved by Tali):
- RESOURCES_STATUS, ResourcesStatus, CreateApplicationResult and WorkspaceValue moved from src/workspace/WorkspaceContext.ts to new src/types/workspace.ts; WorkspaceContext.ts now only creates the context. Imports updated in WorkspaceProvider, useWorkspace, buildApplication, ResourcesPage, CreateApplicationDialog and tests/workspace/WorkspaceProvider.test.tsx; ARCHITECTURE.md §9 file listing updated. No behavior change.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed. No browser check (no visible change).

Text constants move (Claude Code; approved by Tali):
- src/app/uiText.ts → src/text/uiText.ts and src/workspace/messages.ts → src/text/workspaceMessages.ts (git mv). Reason: both hold user-facing text; the new neutral folder means features and the workspace no longer import text from the app shell. Kept as two files (screen text vs. validation/error messages). Imports updated in 13 source and 4 test files; ARCHITECTURE.md §9 tree updated. No behavior change.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed.

Random application IDs (Claude Code; approved by Tali):
- Replaced the app-N counter with crypto.randomUUID(). The counter needed recovery logic after sessionStorage restores (src/workspace/applicationIds.ts, a useRef); random IDs cannot collide with restored ones, so that file was deleted. The Stage 2 objection (secure context) does not apply to how the app is served: localhost for dev/preview, HTTPS for any deployment.
- Files: WorkspaceProvider.tsx; applicationIds.ts deleted; ARCHITECTURE.md §3 (also documents that Applications left with no resources are removed); STUDY_REPORT.md. Existing remount test still checks restored applications and unique IDs.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed. Browser check of creation and reload: assigned to Tali.

Component folders (Claude Code; requested by Tali):
- Every component in src/layout, src/components/ui and src/features now has its own folder with its .tsx and .module.css (git mv, 47 files). Single-consumer helpers moved in with their component (Button/buttonVariants.ts, ApplicationGraph/graphLayout.ts); shared helpers stay at the folder root (components/ui/icons.tsx, features/resources/resourceFilters.ts). Tests moved to mirror the new paths. Relative imports rewritten by a one-off script that resolved each import against the old layout. CLAUDE.md test-location example and ARCHITECTURE.md §9/§10 updated. No behavior change.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed.

Layout under components (Claude Code; requested by Tali):
- src/layout moved to src/components/layout (git mv, 6 files); imports updated in AppRoutes.tsx and Sidebar.tsx. components/ui stays strictly generic; components/layout is the app shell and may use routes and app text. CLAUDE.md and ARCHITECTURE.md §9 updated. Features stay top-level in src/features.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed.

Routing folder (Claude Code; requested by Tali):
- src/app split up: App.tsx moved to src/App.tsx (next to main.tsx); AppRoutes.tsx, routes.ts (renamed paths.ts; exports unchanged) and NotFoundPage (own folder) moved to src/routes/. tests/app/App.test.tsx moved to tests/App.test.tsx. Imports updated in 11 files; ARCHITECTURE.md §9 and STUDY_REPORT.md paths updated. No behavior change.
- Checks (run by Claude): test:run passed (7 files, 29 tests); lint passed; build passed.

Stage 7, part 2: README (Claude Code; requested by Tali):
- README.md rewritten from the Vite template to the four sections the brief asks for: how to run, what was built, next steps, AI use. Content taken from ARCHITECTURE.md and this log; no new claims.
- Sections added at Tali's request: UI component library, data loading and state management (why React Context, not Redux/Zustand), a note on sessionStorage as a no-backend tradeoff. Mock-data count removed from the text.
- Checks (run by Claude): fresh git clone in a temp folder, npm install, test:run passed (29 tests), dev server served /resources (HTTP 200). Lint/build not rerun (documentation only). Visual browser check of the fresh copy not performed.

For each approved stage append: scope approved, files changed, human decisions/review, checks/results, known limitations, approximate actual effort if measured. Do not invent times or outcomes.
