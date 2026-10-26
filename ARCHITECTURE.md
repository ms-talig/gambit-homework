# Gambit — architecture and component contracts

Status: agreed planning baseline, not blanket implementation authorization. Read CLAUDE.md for approval gates. Small contract refinements should be proposed before the relevant stage, not silently assumed.

## 1. Product and boundaries

Browse cloud resources, search/filter them, select several, create a named logical Application, list created Applications, and show a selected Application as a central graph node connected to its resources.

The assignment targets implementation, pragmatic scope, no backend, client-held state, and a fresh-clone run command. README must cover running, built scope, next steps, and AI use. Prioritize core behavior over abstractions or polish. Track effort honestly; report if the chosen scope threatens the timebox.

Agreed: React + TypeScript + Vite, React Router 8 declarative routing, CSS Modules, shared CSS design variables, local async resource loading, one WorkspaceProvider, client state with created Applications saved to sessionStorage, plain SVG graph, small local reusable UI library.

Not included: backend, JSON Server, persistence beyond the current browser tab, authentication, live cloud data, configurable columns, pagination, editing/deleting groups, graph dragging/zooming, external issue tracking. Sorting is deferred until core requirements work and needs a separate approved stage. E2E testing is out of scope. Automated tests use Vitest and React Testing Library (§10); their installation needs its own approved stage.

## 2. Data model

```ts
type Provider = "AWS" | "GCP" | "Azure";
type Environment = "production" | "staging" | "development";
type Criticality = "low" | "medium" | "high" | "critical";

interface Resource {
  id: string;
  name: string;
  type: string;
  provider: Provider;
  region: string;
  environment: Environment;
  criticality: Criticality;
  owner: string;
  tags: string[];
  openIssues: number;
}

interface Application {
  id: string;
  name: string;
  description?: string;
  resourceIds: string[];
}

interface CreateApplicationInput {
  name: string;
  description?: string;
  resourceIds: string[];
}
```

The brief omits openIssues from its interface but requires it in the table and provides it in sample data. Include it as a number and document this assumption.

Store resources once. Applications store resourceIds, not embedded resource copies. Do not add applicationIds to Resources. Resolve group members from the shared resources when rendering. A resource may belong to more than one Application. Names need not be unique; IDs must be unique.

Provide 8–12 varied sample resources. Start with zero Applications. Mockup groups are illustrative only.

## 3. Loading and shared state

data/resources.ts contains the sample dataset. getResources(): Promise<Resource[]> is a local asynchronous boundary; it does not make an HTTP request. No forced artificial delay is required.

WorkspaceProvider owns resources, applications, resource loading status/error, and createApplication. Load resources on provider initialization. Keep the provider mounted across route changes; do not reload for each page. Handle effect cleanup so stale asynchronous completions cannot update obsolete state. Development StrictMode may rerun effects; do not misreport this as duplicate production navigation loading.

useWorkspace exposes this context and gives a clear error if called outside its provider. Shared state may use simple React state; no Redux/Zustand dependency is necessary.

Proposed action contract:

```ts
type CreateApplicationResult =
  | { ok: true; application: Application }
  | { ok: false; message: string };

// synchronous client operation, no HTTP request
createApplication(input: CreateApplicationInput): CreateApplicationResult;
```

Trim name/description; reject blank name, empty selection, unavailable resource data, or unknown resource IDs. Deduplicate resource IDs. Generate the ID once per creation action, outside any state updater that React might re-evaluate. Append using the current state safely. Return the created Application so the caller can navigate to it. Form validation provides immediate feedback; the shared action protects data integrity.

Created Applications are saved to sessionStorage (decided by Tali after Stage 6): they survive refreshes and typed URLs in the same tab and are cleared when the tab closes. Resources always reload from the fixtures. Stored data is untrusted: malformed entries are skipped, resource IDs that no longer exist are dropped once resources load, and the app-N counter continues after the highest saved ID. If storage is unavailable, the app keeps working in memory. No localStorage or IndexedDB. Browser back/forward changes routes, not data history; it does not undo group creation.

## 4. Routes and shell

```text
App
└── BrowserRouter
    └── WorkspaceProvider
        └── AppRoutes
            └── AppLayout
                ├── Sidebar
                └── Outlet (current page)
```

- / redirects to /resources using replace.
- /resources → ResourcesPage.
- /applications → ApplicationsPage with list and selection prompt.
- /applications/:applicationId → same ApplicationsPage with selected group details/graph.
- Unrecognized URL → concise not-found view with navigation back.

Sidebar uses route-aware links; Applications remains active for a selected group URL. Do not duplicate current page or selected application ID in React state. WorkspaceProvider stays above routed screens.

If an Application ID is absent (e.g. a URL from a closed tab), show a friendly not-found state and link to /applications. Never invent group data to satisfy a stale URL.

## 5. State ownership


| State                                            | Owner                   | Lifetime                                       |
| ------------------------------------------------ | ----------------------- | ---------------------------------------------- |
| Resources, Applications, resource loading/error  | WorkspaceProvider       | Current app session                            |
| Search, provider/environment/criticality filters | ResourcesPage           | Until leaving Resources                        |
| Selected resource IDs                            | ResourcesPage           | Until leaving Resources or successful creation |
| Create dialog open                               | ResourcesPage           | Current page                                   |
| Draft name, description, form errors             | CreateApplicationDialog | Current dialog opening                         |
| Current page / selected Application              | URL through Router      | Browser navigation                             |


Do not store filtered resources, selected count, group member objects, or graph positions as redundant application state. Compute them from their inputs. With 8–12 items, straightforward array operations suffice.

## 6. Reusable UI components

UI primitives know nothing about resources or Applications. Use native semantic controls where possible and TypeScript-compatible native props. Controlled inputs receive value/checked and change callbacks; do not keep duplicate copies internally.


| Component   | Contract / responsibility                                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button      | children, variant (primary/secondary), normal button props including disabled/type/onClick. Default type=button; submit explicitly.                                                                                |
| Field       | Shared label, required/optional marker and linked error message for TextField and TextArea.                                                                                                                        |
| TextField   | label, value, onChange, optional error, required, optionalText, ref, native input props. Generates its own id; error linked via aria-describedby; aria-required instead of native validation.                      |
| TextArea    | Same field conventions, multiline control.                                                                                                                                                                         |
| SearchInput | Standalone (not built on TextField): accessible label, type=search, search icon; reports text, never filters data itself.                                                                                          |
| Select      | label, options [{value,label}], value, onChange; wraps native select and generates its own id. Used three times for filters.                                                                                       |
| Checkbox    | checked, accessible label, onChange, optional indeterminate (used by the select-all header).                                                                                                                       |
| Modal       | title, optional description, onClose, initialFocusRef, children. Native dialog opened with showModal while mounted (render conditionally). Escape closes; backdrop clicks do not; focus returns to the opener.       |
| Panel       | children and className; consistent surface styling, no business state.                                                                                                                                             |
| Table       | label, rows, columns, getRowKey, optional getRowClassName. Columns have stable id, header and cell renderer, optional row-header cell. Semantic table; no resource knowledge.                                       |
| Badge       | Pill shape only; the caller supplies colors through className (criticality colors live in the feature).                                                                                                            |
| VisuallyHidden | Content for screen readers only (checkbox column header, graph member list).                                                                                                                                    |


Create primitives as they are needed, not a speculative design system. Do not recreate a custom dropdown keyboard interaction model when native select suffices. The instructor's modal/dropdown code needs accessibility improvements; do not copy it unchanged. Do not import the instructor's custom router.

## 7. Resources screen contracts

```text
ResourcesPage
├── ResourceFilters → SearchInput + 3 × Select
├── ResourceTable → Table<Resource> + Checkbox
├── SelectionToolbar → Button
└── CreateApplicationDialog → Modal + TextField + TextArea + Button
```

ResourcesPage reads useWorkspace. It owns filters/selection/modal visibility and passes derived data/callbacks to children.

```ts
interface ResourceFiltersValue {
  search: string;
  provider: Provider | "all";
  environment: Environment | "all";
  criticality: Criticality | "all";
}
```


| Component               | Inputs                                               | Reports to parent                                                 | Local business state               |
| ----------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| ResourceFilters         | value: ResourceFiltersValue                          | onChange(nextValue)                                               | None                               |
| ResourceTable           | resources: Resource[], selectedResourceIds: string[] | onToggleResource(id)                                              | None                               |
| SelectionToolbar        | selectedCount, hiddenSelectedCount                   | onClear(), onCreate()                                             | None                               |
| CreateApplicationDialog | selectedCount                                        | onCancel(), onSubmit({name, description}) returning success/error | Draft fields and validation errors |


Page combines dialog fields with its selected IDs and calls createApplication. The generic Modal never knows about createApplication.

Table columns fixed: selection, name, type, provider, environment, criticality, open issues. No user-configurable columns. Selection uses IDs, not array indices. Row checkboxes have resource-specific labels. Header select-all (added at Tali's request after Stage 6) acts on the rows currently shown: it selects all shown rows, or clears them when all are selected, and never changes rows hidden by filters. It is partially checked when only some shown rows are selected.

Search matches part of name, case-insensitively. Filters combine using AND. "all" means no restriction for that attribute. Filtering is entirely local.

Keep selection when filtering hides rows. Clearly display selected count and hidden selected count, with Clear selection. Create is disabled with no selection or unavailable resources. No search results is distinct from loading, error, and an empty dataset.

Leaving Resources resets local filters and selection. Cancel/Escape closes the dialog and discards its draft, but preserves selected rows. On successful creation: close dialog, clear selection, navigate to /applications/{newId}. On validation failure: preserve input and display the error.

## 8. Applications screen contracts

```text
ApplicationsPage
├── ApplicationList
└── ApplicationDetails
    └── ApplicationGraph
```


| Component          | Inputs                              | Responsibility                                                                   |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------------- |
| ApplicationsPage   | Context and URL                     | Resolve selected group and member Resources; choose empty/not-found/detail state |
| ApplicationList    | applications, selectedApplicationId | List name/count and route links; mark selected group                             |
| ApplicationDetails | application, resources              | Heading, optional description, member count, graph                               |
| ApplicationGraph   | application, resources              | Render SVG central group, resource nodes, connecting lines                       |


No groups: explain how to create one and link to Resources. Groups but no selected ID: list plus selection prompt. Missing ID: friendly not-found message. No duplicate selected-ID state.

Graph must accommodate 1 through all sample resources, not just the three in the mock. Use a computed deterministic layout with readable labels and viewBox; adapt available area or allow contained scrolling rather than making labels illegible. No graph library. Give SVG an accessible title/description and provide readable member names/types, including an accessible text representation if needed. Avoid redundant state for layout positions.

## 9. Files and styling

```text
src/
  app/                 App.tsx, AppRoutes.tsx
  layout/              AppLayout.tsx, Sidebar.tsx
  workspace/           WorkspaceProvider.tsx, WorkspaceContext.ts, useWorkspace.ts
  data/                resources.ts, getResources.ts
  types/               models.ts
  features/resources/  page, filters, domain table, toolbar, creation dialog
  features/applications/ page, list, details, graph
  components/ui/       shared primitives and generic Table
  styles/              globals.css, tokens.css
tests/                 root-level; mirrors src/, no tests beside source files
  setup.ts             shared test setup
  workspace/           e.g. WorkspaceProvider.test.tsx
  features/resources/  e.g. ResourcesPage.test.tsx
  features/applications/ e.g. ApplicationsPage.test.tsx
```

Place component .module.css files beside components. Shared tokens cover colors, spacing, radii and typography. Match supplied mockups' light surfaces, blue accent, sidebar and spacing, not their literal demo groups or unsupported controls. Keep controls keyboard-accessible, focus visible, labels readable and layout usable on narrower screens. Do not add Tailwind or another UI system without approval.

## 10. Testing

Tools: Vitest, React Testing Library, @testing-library/user-event, jsdom. No E2E framework in current scope.

Location: all tests live in a root-level tests/ directory that mirrors src/ (src/features/resources/ResourcesPage.tsx → tests/features/resources/ResourcesPage.test.tsx). Never place tests beside production files. Shared setup lives in tests/setup.ts. Test discovery, TypeScript and lint coverage for tests/ are configured in the test-infrastructure stage (PLAN.md Stage 0.6).

Scope is proportionate to the 1–2 hour timebox. Priority behaviors:

- Search and filters working together.
- Selection surviving filtering.
- Invalid Application creation being rejected.
- Successful creation showing the correct member resources.
- Missing Application URLs being handled.

Prefer integration tests that render real components with the providers they need, interact through user-event, and assert what the user sees using accessible queries (role, label, text). Add standalone unit tests only where meaningful logic warrants them. Do not test individual fixture attributes or trivial wrappers, and do not duplicate the same behavior across suites. Test observable behavior, not internal state.

Limits: jsdom performs no layout and has limited native dialog/focus support. Visual checks, focus and modal behavior still need the browser checklist in PLAN.md; tests do not replace it.

## 11. References and interpretation

- Original brief: Gambit_FE_TakeHome.docx.pdf, supplied separately.
- visuals/ contains the approved Resources/dialog and Applications mockups.
- Optional course source: 282-wrapup (1).zip, supplied separately; Table/SortableTable/Button/Panel demonstrate composition, not mandatory dependencies.
- User decisions explicitly override illustrative mock details. If the brief and plan conflict, report the exact discrepancy before implementation.

