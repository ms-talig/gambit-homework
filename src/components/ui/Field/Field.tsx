import type { ReactNode } from 'react'
import styles from './Field.module.css'

const REQUIRED_MARKER = '*'

interface FieldProps {
  inputId: string
  errorId: string
  label: string
  required?: boolean
  optionalText?: string
  error?: string
  children: ReactNode
}

// Shared label and error layout for TextField and TextArea.
export function Field({
  inputId,
  errorId,
  label,
  required,
  optionalText,
  error,
  children,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            {REQUIRED_MARKER}
          </span>
        )}
        {optionalText && (
          <span className={styles.optional}> {optionalText}</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
