# Study report — code walkthrough Q&A

Answers to questions about the code, file by file, for the homework review.

## src/app/App.tsx

`App` is the top-level component. It doesn't render any UI of its own. It only nests three layers:

```tsx
<BrowserRouter>
  <WorkspaceProvider>
    <AppRoutes />
  </WorkspaceProvider>
</BrowserRouter>
```

1. **`BrowserRouter`** (from `react-router`) connects the app to the browser URL and history. Any component inside it can use routing (`Routes`, `Link`, `NavLink`, `useNavigate`, `useParams`). It goes on the outside so that everything below it can use routing.
2. **`WorkspaceProvider`** (`src/workspace/WorkspaceProvider.tsx`) holds the state shared across the app: the resources list and the Applications saved in `sessionStorage`. It shares that state through React Context, and components read it with the `useWorkspace` hook.
3. **`AppRoutes`** (`src/app/AppRoutes.tsx`) picks which page to render for the current URL.

**Why `WorkspaceProvider` sits above the routes:** the Resources page and the Applications page use the same data. Because the provider is outside `AppRoutes`, it stays mounted when the user moves between pages. Its state is not reset, and resources are not loaded again on every navigation.

## src/workspace — WorkspaceContext.ts, WorkspaceProvider.tsx, useWorkspace.ts

These three files work together to share one piece of state, the "workspace", with the whole app without passing props down through every component.

### Q: Why do we need both a context and a provider? What is the difference?

They do different jobs:

| | `WorkspaceContext.ts` | `WorkspaceProvider.tsx` |
|---|---|---|
| What it is | The **channel**: an empty "pipe" created with `createContext` | The **source**: a component that owns the state and puts it into the pipe |
| Contains | One line: `createContext<WorkspaceValue \| null>(null)` | `useState`, `useEffect`, `useCallback`, `useMemo`, the loading logic, the `sessionStorage` saving, and `createApplication` |
| Has logic? | No | Yes, all of it |
| Renders? | No | Yes: `<WorkspaceContext value={value}>{children}</WorkspaceContext>` |

**The context** only says *what shape* the shared data has (the `WorkspaceValue` type) and gives React a key to look it up by. Its default value is `null`, which means "no provider found above this component".

**The provider** is a normal React component that:
- loads the resources (`getResources()`) and tracks their status: `loading` / `ready` / `error`
- loads Applications from `sessionStorage` on start (`loadApplications`) and saves them on every change (`saveApplications`)
- removes saved Applications that point to resources that no longer exist (`pruneUnknownResources`)
- provides `createApplication`, which validates the input, gives the new Application the next id, and adds it to state
- packs all of that into one `value` object and passes it to the context

**The third file, `useWorkspace.ts`**, is how components *read* the value. It calls `useContext(WorkspaceContext)` and throws a clear error if the value is `null`, which means someone forgot the provider. This also means components get a `WorkspaceValue` type and never have to handle `null` themselves.

So the flow is: **Provider writes → Context carries → `useWorkspace` reads.**

### Q: Is `useWorkspace` a custom hook? Does it use the provider?

**Yes, it's a custom hook.** In React, a custom hook is any function whose name starts with `use` and that calls other hooks inside it. `useWorkspace` calls React's built-in `useContext`. The `use` prefix also tells the `react-hooks` ESLint rules to enforce the Rules of Hooks on it, such as "only call at the top level of a component, never inside a condition".

**It doesn't use the provider directly.** It never imports `WorkspaceProvider`; it only imports `WorkspaceContext`. `useContext(WorkspaceContext)` asks React for the value of the **nearest `WorkspaceContext` above this component in the tree**. That value is the one `WorkspaceProvider` put there. So the hook *depends on* the provider at runtime without *knowing about* it in code:

- **In the code:** `useWorkspace` → `WorkspaceContext` ← `WorkspaceProvider`. Both depend on the context, not on each other.
- **At runtime:** the component has to be rendered inside `<WorkspaceProvider>`, as set up in `App.tsx`. If it isn't, `useContext` returns the default `null`, and the hook throws `useWorkspace must be used within a WorkspaceProvider.`

**Why wrap `useContext` in a custom hook** instead of calling `useContext(WorkspaceContext)` in every component:
1. **One `null` check in one place.** Components get a plain `WorkspaceValue`, never `WorkspaceValue | null`.
2. **A clear error message** when the provider is missing, instead of a confusing "cannot read property of null" somewhere later.
3. **Simpler imports.** Components import one hook and never touch the context object itself.

### Q: Where do the workspace types live, and why there?

In `src/types/workspace.ts`: `RESOURCES_STATUS` (the `loading` / `ready` / `error` constants), `ResourcesStatus`, `CreateApplicationResult` and `WorkspaceValue`.

They used to live in `WorkspaceContext.ts`. That meant files that never use the context still imported from a React context file just to get a type or constant: `ResourcesPage` (`RESOURCES_STATUS`), `CreateApplicationDialog` and the pure function `buildApplication` (`CreateApplicationResult`). Moving them to `types/` follows the same pattern as `Resource` and `Application` in `types/models.ts`: shared types come from `types/`, and `WorkspaceContext.ts` holds only the context. This was a refactor decision made during code review; behavior did not change.

### Q: Why are they in separate files instead of one?

1. **Fast Refresh (hot reload in dev).** The project uses the ESLint rule `eslint-plugin-react-refresh` (`reactRefresh.configs.vite` in `eslint.config.js`). Vite's Fast Refresh can only hot-update a file that exports *only components*. If `WorkspaceProvider.tsx` also exported the context object or the hook, the rule would warn, and editing the file would reload the whole page and lose state. That's why the non-component exports live in `.ts` files.
2. **Separation of concerns.** The contract (types in `types/workspace.ts`, the context in `WorkspaceContext.ts`) is separate from the implementation (the state logic). Components that only consume the data import the hook and types and never depend on the provider's internals.
3. **Testing.** A test can render `<WorkspaceProvider>` around a component, or provide its own value through `WorkspaceContext` directly.

### Details worth knowing in WorkspaceProvider

- **`useMemo` for `value`:** without it, every render of the provider would create a new object, and every component using `useWorkspace` would re-render even when nothing changed. With it, consumers re-render only when `resourcesState`, `applications`, or `createApplication` change.
- **`useCallback` for `createApplication`:** keeps the function the same between renders, so it doesn't break the `useMemo` above. It only changes when `resourcesState` changes, because it reads the resources.
- **`useRef` for `nextApplicationNumber`:** the id counter must survive re-renders, but changing it shouldn't cause a re-render, and that's exactly what a ref is for. It starts from the highest id already saved (`getNextApplicationNumber`).
- **Lazy initial state `useState(loadApplications)`:** passing the function (not `loadApplications()`) means `sessionStorage` is read only once, on the first render.
- **`ignore` flag in the loading effect:** if the component unmounts before `getResources()` finishes (including StrictMode's dev re-run), the cleanup sets `ignore = true`, so the late result is dropped instead of setting state.
- **Discriminated union `ResourcesState`:** `resources` exists only when `status` is `ready`, and `message` exists only when it's `error`. TypeScript then won't allow reading resources while they are still loading.
- **`NO_RESOURCES` constant:** a single shared empty array. A new `[]` on every render would be a new reference each time and would cause extra re-renders.
- **`<WorkspaceContext value={...}>`:** React 19 lets you render the context itself as the provider. Older React needed `<WorkspaceContext.Provider value={...}>`.
