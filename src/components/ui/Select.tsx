import { useId } from 'react'
import { ChevronDownIcon } from './icons.tsx'
import styles from './Select.module.css'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectProps<T extends string> {
  label: string
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
}: SelectProps<T>) {
  const id = useId()

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <select
          id={id}
          className={styles.select}
          value={value}
          // Safe: the only selectable values are the typed options above.
          onChange={(event) => onChange(event.target.value as T)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.chevron} />
      </div>
    </div>
  )
}
