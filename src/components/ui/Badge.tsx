import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  // Supplies the colors; the badge only defines shape and spacing.
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
