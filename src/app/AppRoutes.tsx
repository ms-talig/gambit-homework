import { Navigate, Route, Routes } from 'react-router'
import { ApplicationsPage } from '../features/applications/ApplicationsPage.tsx'
import { ResourcesPage } from '../features/resources/ResourcesPage.tsx'
import { AppLayout } from '../layout/AppLayout.tsx'
import { NotFoundPage } from './NotFoundPage.tsx'
import { ROUTES } from './routes.ts'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.resources} replace />} />
        <Route path={ROUTES.resources} element={<ResourcesPage />} />
        <Route path={ROUTES.applications} element={<ApplicationsPage />} />
        <Route path={ROUTES.applicationDetail} element={<ApplicationsPage />} />
        <Route path={ROUTES.notFound} element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
