import type { InputHTMLAttributes } from 'react'
import { SearchIcon } from './icons.tsx'
import styles from './SearchInput.module.css'

interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  label: string
  value: string
  onChange: (value: string) => void
}

export function SearchInput({
  label,
  value,
  onChange,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <SearchIcon className={styles.icon} />
      <input
        type="search"
        aria-label={label}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </div>
  )
}
