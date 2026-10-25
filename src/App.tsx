import { WorkspaceProvider } from './workspace/WorkspaceProvider.tsx'

function App() {
  return (
    <WorkspaceProvider>
      <main>
        <h1>Gambit Cloud Resources</h1>
      </main>
    </WorkspaceProvider>
  )
}

export default App
