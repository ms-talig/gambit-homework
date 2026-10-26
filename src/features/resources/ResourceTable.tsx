import { UI_TEXT } from '../../text/uiText.ts'
import { Badge } from '../../components/ui/Badge.tsx'
import { Checkbox } from '../../components/ui/Checkbox.tsx'
import { Table } from '../../components/ui/Table.tsx'
import type { TableColumn } from '../../components/ui/Table.tsx'
import type { Resource } from '../../types/models.ts'
import styles from './ResourceTable.module.css'

const TEXT = UI_TEXT.resources

interface ResourceTableProps {
  resources: Resource[]
  selectedResourceIds: string[]
  onToggleResource: (resourceId: string) => void
  // Selects or clears every row currently shown; hidden rows are untouched.
  onToggleAllShown: (selected: boolean) => void
}

export function ResourceTable({
  resources,
  selectedResourceIds,
  onToggleResource,
  onToggleAllShown,
}: ResourceTableProps) {
  const selectedIds = new Set(selectedResourceIds)
  const shownSelectedCount = resources.filter((resource) =>
    selectedIds.has(resource.id),
  ).length
  const allShownSelected =
    resources.length > 0 && shownSelectedCount === resources.length

  const columns: TableColumn<Resource>[] = [
    {
      id: 'select',
      header: (
        <Checkbox
          label={TEXT.selectAllShown}
          checked={allShownSelected}
          indeterminate={shownSelectedCount > 0 && !allShownSelected}
          onChange={onToggleAllShown}
        />
      ),
      cell: (resource) => (
        <Checkbox
          label={TEXT.selectResource(resource.name)}
          checked={selectedIds.has(resource.id)}
          onChange={() => onToggleResource(resource.id)}
        />
      ),
      className: styles.selectCell,
    },
    {
      id: 'name',
      header: TEXT.columns.name,
      cell: (resource) => resource.name,
      isRowHeader: true,
    },
    {
      id: 'type',
      header: TEXT.columns.type,
      cell: (resource) => resource.type,
    },
    {
      id: 'provider',
      header: TEXT.columns.provider,
      cell: (resource) => resource.provider,
    },
    {
      id: 'environment',
      header: TEXT.columns.environment,
      cell: (resource) => resource.environment,
    },
    {
      id: 'criticality',
      header: TEXT.columns.criticality,
      // CSS module classes are named after the criticality values.
      cell: (resource) => (
        <Badge className={styles[resource.criticality]}>
          {resource.criticality}
        </Badge>
      ),
    },
    {
      id: 'openIssues',
      header: TEXT.columns.openIssues,
      cell: (resource) => resource.openIssues,
    },
  ]

  return (
    <Table
      label={TEXT.tableLabel}
      rows={resources}
      columns={columns}
      getRowKey={(resource) => resource.id}
      getRowClassName={(resource) =>
        selectedIds.has(resource.id) ? styles.selectedRow : undefined
      }
    />
  )
}
