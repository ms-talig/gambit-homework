import { useState } from 'react'
import { UI_TEXT } from '../../app/uiText.ts'
import { PageHeader } from '../../components/ui/PageHeader.tsx'
import { useWorkspace } from '../../workspace/useWorkspace.ts'
import { RESOURCES_STATUS } from '../../workspace/WorkspaceContext.ts'
import { ResourceFilters } from './ResourceFilters.tsx'
import { DEFAULT_FILTERS, filterResources } from './resourceFilters.ts'
import { ResourceTable } from './ResourceTable.tsx'
import styles from './ResourcesPage.module.css'
import { SelectionToolbar } from './SelectionToolbar.tsx'

const TEXT = UI_TEXT.resources

export function ResourcesPage() {
  const { resources, resourcesStatus, resourcesError } = useWorkspace()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([])

  const visibleResources = filterResources(resources, filters)
  const visibleIds = new Set(visibleResources.map((resource) => resource.id))
  const hiddenSelectedCount = selectedResourceIds.filter(
    (resourceId) => !visibleIds.has(resourceId),
  ).length

  function toggleResource(resourceId: string) {
    setSelectedResourceIds((current) =>
      current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId],
    )
  }

  function renderContent() {
    if (resourcesStatus === RESOURCES_STATUS.loading) {
      return (
        <p className={styles.message} role="status">
          {TEXT.loading}
        </p>
      )
    }
    if (resourcesStatus === RESOURCES_STATUS.error) {
      return (
        <p className={styles.message} role="alert">
          {resourcesError}
        </p>
      )
    }
    if (resources.length === 0) {
      return <p className={styles.message}>{TEXT.empty}</p>
    }
    if (visibleResources.length === 0) {
      return <p className={styles.message}>{TEXT.noResults}</p>
    }
    return (
      <ResourceTable
        resources={visibleResources}
        selectedResourceIds={selectedResourceIds}
        onToggleResource={toggleResource}
      />
    )
  }

  return (
    <>
      <PageHeader title={TEXT.title} subtitle={TEXT.subtitle} />
      <div className={styles.content}>
        <ResourceFilters value={filters} onChange={setFilters} />
        {renderContent()}
        <SelectionToolbar
          selectedCount={selectedResourceIds.length}
          hiddenSelectedCount={hiddenSelectedCount}
          onClear={() => setSelectedResourceIds([])}
        />
      </div>
    </>
  )
}
