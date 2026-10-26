# Gambit — Cloud Resources

A small client-side React app for browsing cloud resources, grouping them into
**Applications**, and viewing each Application as a graph of its resources.

## How to run

Requires Node.js 22.22 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

Other scripts:


| Command            | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `npm run test:run` | Run the test suite once (Vitest)                 |
| `npm run test:e2e` | Run the end-to-end tests in Chromium (Playwright) |
| `npm run lint`     | Lint with ESLint                                 |
| `npm run build`    | Type-check and build                             |
| `npm run preview`  | Serve the production build                       |

The first time you run the end-to-end tests, install the browser with `npx playwright install chromium`.


## What I built

**Resources page**

- Resource table with the required columns. The data is mock data, loaded through a local async loader (no backend).
- Case-insensitive name search plus provider, environment and criticality filters, all combined.
- Multi-row selection that survives filtering. The toolbar shows how many selected rows are hidden by the current filters.
- Separate loading, error, empty and no-results states.

**Create Application**

- Accessible modal dialog (native `<dialog>`) with a required name and an optional description.
- After creating, the app goes straight to the new Application.

**Applications page**

- List of created Applications. The selected one comes from the URL (`/applications/:id`), so links and back/forward work.
- Plain SVG graph with the Application in the center and its resources around it, plus a screen-reader list of the same members.
- A friendly "not found" state for unknown or stale Application URLs.

**UI component library**

I built a small component library in `src/components/ui` so the screens are put together from reusable building blocks instead of one-off markup.

- **Generic:** the components don't know anything about resources or Applications. They take plain props such as `label`, `value` and `onChange`, so they could be reused in another app as they are.
- **Components:** Button, TextField, TextArea, SearchInput, Select, Checkbox, Badge, Panel, PageHeader, Table, Modal, VisuallyHidden and a shared Field wrapper for labels and errors.
- **Styling:** each component has its own CSS Module. They all use the same design tokens (CSS variables for colors, spacing, radii and font sizes in `src/styles/tokens.css`), so the look stays consistent and can be changed in one place.
- **Accessibility built in:** components use native elements (`<button>`, `<select>`, `<dialog>`, `<table>`). Fields link their labels and error messages automatically, and the Modal handles focus and Escape. Every screen that uses them gets this for free.
- **Clear layering:** the feature components in `src/features` handle the domain logic and use the UI components for display. The app shell (sidebar, layout, logo) lives separately in `src/components/layout`.

**Under the hood**

- React 19, TypeScript, Vite, React Router, CSS Modules with shared CSS variables.
- Unit and integration tests with Vitest and React Testing Library, plus Playwright end-to-end tests (see [Tests](#tests)).

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Tests

All tests live in `tests/`, which mirrors the `src/` folder structure. Vitest runs the unit and integration tests in jsdom, a simulated browser (`npm run test:run`). React Testing Library renders components and finds elements the way a user would, by role and label; user-event simulates clicks and typing; jest-dom adds DOM assertions such as `toBeInTheDocument`. Playwright runs the end-to-end tests in a real Chromium browser (`npm run test:e2e`).

| Kind | File | Tools | What it covers |
|---|---|---|---|
| Unit | [buildApplication.test.ts](tests/workspace/buildApplication.test.ts) | Vitest | Trims the name and description, removes duplicate IDs, rejects unknown IDs, a blank name or an empty selection |
| Unit | [applicationStorage.test.ts](tests/workspace/applicationStorage.test.ts) | Vitest, jsdom (its sessionStorage) | Ignores malformed data in sessionStorage; drops resource IDs that no longer exist |
| Unit | [graphLayout.test.ts](tests/features/applications/ApplicationGraph/graphLayout.test.ts) | Vitest | No overlapping nodes and everything stays in bounds, for 1 up to all resources |
| Integration | [WorkspaceProvider.test.tsx](tests/workspace/WorkspaceProvider.test.tsx) | Vitest, React Testing Library, user-event, jest-dom | Loads resources, creates an Application, restores saved Applications after a remount with unique IDs |
| Integration | [ResourcesPage.test.tsx](tests/features/resources/ResourcesPage/ResourcesPage.test.tsx) | Vitest, React Testing Library, user-event, jest-dom | Search combined with filters, selection kept when filters hide rows, the header checkbox, a blank name rejected with the draft kept, a valid create that opens the new Application |
| Integration | [ApplicationsPage.test.tsx](tests/features/applications/ApplicationsPage/ApplicationsPage.test.tsx) | Vitest, React Testing Library, user-event, jest-dom | An Application shows exactly its member resources, a missing Application URL, Applications kept when navigating with the sidebar |
| Smoke | [App.test.tsx](tests/App.test.tsx) | Vitest, React Testing Library, jest-dom | The root URL redirects to Resources |
| End-to-end | [createApplication.spec.ts](tests/e2e/createApplication.spec.ts) | Playwright (Chromium) | Creates an Application, checks its graph, then reloads the page and checks it is still there (sessionStorage) |
| End-to-end | [createApplication.spec.ts](tests/e2e/createApplication.spec.ts) | Playwright (Chromium) | Escape closes the create dialog, focus returns to the Create Application button and the selection is kept |

The end-to-end tests cover what jsdom can't: a real page reload, and native dialog focus and Escape.

## Data loading and state management

### How data loads at startup

1. When the app starts, `WorkspaceProvider` mounts once at the top of the app, above the router's pages.
2. It reads any Applications already saved for this tab (see the note on sessionStorage below).
3. It calls `getResources()`, an async function that returns a Promise of the resources, just like an API call would. It doesn't make a real HTTP request; it returns copies of the mock data. So swapping in a real API later only means changing this one function.
4. While the Promise is pending, the Resources page shows a loading state. When it resolves, the resources are stored and the table renders. If it fails, an error state is shown instead.
5. The resources are loaded only once. Moving between pages doesn't reload them, because the provider stays mounted.

### Why React Context and not a state library

The app's shared state is small: the list of resources, its loading status, the created Applications, and one action, `createApplication`. One React Context with a provider (`WorkspaceProvider`) and a `useWorkspace()` hook covers all of it.

I didn't use Redux, Zustand or a similar library because at this scale it would add a dependency, boilerplate and new concepts without solving a real problem:

- **Little shared state.** Only a few values are shared between pages, so plain React state (`useState`) inside one provider is enough.
- **Updates are rare.** State only changes when resources finish loading or an Application is created. The usual weakness of Context (every consumer re-renders on each change) doesn't matter here. The context value is also memoized, so it only changes when the data really changes.
- **Everything else stays local.** Search text, filters, row selection and the dialog draft live in the page or component that uses them, and the selected Application comes from the URL. Only data that several pages need goes into the shared state.
- **Clean data model.** Resources are stored once, and Applications keep only resource IDs, not copies. One resource can belong to several Applications, and nothing gets out of sync.
- **Validation in one place.** `createApplication` checks the input (non-empty name, at least one resource, no unknown resource IDs) before saving, so the UI can't add invalid data.

If the app grew (more shared data, frequent updates, server caching), I'd reconsider. For example, TanStack Query for server data or Zustand/Redux Toolkit for complex client state.

## A note on sessionStorage

Created Applications are saved in `sessionStorage`. I know this isn't ideal, and I wouldn't do it if there were a server to save them to.

The brief asks for a client-only app with no backend. With state kept only in memory, every refresh or typed URL wiped all created Applications, and links to an Application stopped working. `sessionStorage` keeps the data consistent within one browser tab: it survives refreshes and typed URLs and is cleared when the tab closes. A new tab starts empty.

To keep it safe, stored data is treated as untrusted. Malformed entries are skipped, and resource IDs that no longer exist are dropped. With a real API, this would be replaced by saving Applications on the server.

## What I'd do next

- Edit and delete Applications.
- Table sorting.
- Icons for each resource type in the graph, and zoom/pan for large groups (big graphs currently scroll sideways in narrow windows).
- A real API and persistence beyond the browser tab.
- More end-to-end tests, such as keyboard-only navigation and back/forward.
- Replace the default Vite favicon.

## Where I used AI

- **Planning:** I worked out the architecture and a stage-by-stage plan with Codex
([docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/PLAN.md](docs/PLAN.md)).
- **Implementation:** Claude Code wrote the code and tests one stage at a time. Rules in [CLAUDE.md](CLAUDE.md) required my approval before each stage and before installing any dependency.
- **My role:** I approved or changed each stage plan, reviewed the results, and made the product decisions. For example: saving Applications in `sessionStorage` after I found that a typed URL cleared them, adding select-all, and the folder structure. I also did the browser checks.
- **Checks:** after every stage, Claude Code ran the tests, lint and build. The full log of decisions and checks is in [docs/PLAN.md](docs/PLAN.md#work-and-ai-use-record).

