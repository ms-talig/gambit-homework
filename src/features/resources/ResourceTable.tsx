import { UI_TEXT } from '../../app/uiText.ts'
import { Badge } from '../../components/ui/Badge.tsx'
import { Checkbox } from '../../components/ui/Checkbox.tsx'
import { Table } from '../../components/ui/Table.tsx'
import type { TableColumn } from '../../components/ui/Table.tsx'
import { VisuallyHidden } from '../../components/ui/VisuallyHidden.tsx'
import type { Resource } from '../../types/models.ts'
import styles from './ResourceTable.module.css'

const TEXT = UI_TEXT.resources

interface ResourceTableProps {
  resources: Resource[]
  selectedResourceIds: string[]
  onToggleResource: (resourceId: string) => void
}

export function ResourceTable({
  resources,
  selectedResourceIds,
  onToggleResource,
}: ResourceTableProps) {
  const selectedIds = new Set(selectedResourceIds)

  const columns: TableColumn<Resource>[] = [
    {
      id: 'select',
      header: <VisuallyHidden>{TEXT.columns.select}</VisuallyHidden>,
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
