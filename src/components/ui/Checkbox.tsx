import { useEffect, useRef } from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  // Accessible name; there is no visible label.
  label: string
  checked: boolean
  // Partially checked ("–"), e.g. a select-all box when only some are chosen.
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({
  label,
  checked,
  indeterminate = false,
  onChange,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // indeterminate is a DOM property only; it has no HTML attribute.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={inputRef}
      type="checkbox"
      aria-label={label}
      className={styles.checkbox}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}
