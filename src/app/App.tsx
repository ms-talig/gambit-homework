import { BrowserRouter } from 'react-router'
import { WorkspaceProvider } from '../workspace/WorkspaceProvider.tsx'
import { AppRoutes } from './AppRoutes.tsx'

function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </BrowserRouter>
  )
}

export default App;
