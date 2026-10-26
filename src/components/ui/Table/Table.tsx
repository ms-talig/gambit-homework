import type { ReactNode } from 'react'
import styles from './Table.module.css'

export interface TableColumn<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  // Renders the cell as the row's header, so screen readers announce it.
  isRowHeader?: boolean
  className?: string
}

interface TableProps<T> {
  label: string
  rows: readonly T[]
  columns: readonly TableColumn<T>[]
  getRowKey: (row: T) => string
  getRowClassName?: (row: T) => string | undefined
}

export function Table<T>({
  label,
  rows,
  columns,
  getRowKey,
  getRowClassName,
}: TableProps<T>) {
  return (
    <div className={styles.container}>
      <table className={styles.table} aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className={getRowClassName?.(row)}>
              {columns.map((column) =>
                column.isRowHeader ? (
                  <th key={column.id} scope="row" className={column.className}>
                    {column.cell(row)}
                  </th>
                ) : (
                  <td key={column.id} className={column.className}>
                    {column.cell(row)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
