import styles from './Checkbox.module.css'

interface CheckboxProps {
  // Accessible name; there is no visible label.
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      className={styles.checkbox}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}
