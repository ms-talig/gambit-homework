import type { ReactNode } from 'react'
import styles from './VisuallyHidden.module.css'

// Text for screen readers only, e.g. a header for a column of checkboxes.
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className={styles.hidden}>{children}</span>
}
