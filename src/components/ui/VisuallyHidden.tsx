import type { ReactNode } from 'react'
import styles from './VisuallyHidden.module.css'

// Content for screen readers only, e.g. a header for a column of checkboxes.
// A div, so it can also wrap block content such as lists.
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <div className={styles.hidden}>{children}</div>
}
