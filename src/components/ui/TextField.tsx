import { useId } from 'react'
import type { InputHTMLAttributes, Ref } from 'react'
import { Field } from './Field.tsx'
import styles from './Field.module.css'

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  optionalText?: string
  ref?: Ref<HTMLInputElement>
}

export function TextField({
  label,
  value,
  onChange,
  error,
  required,
  optionalText,
  ref,
  ...props
}: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <Field
      inputId={id}
      errorId={errorId}
      label={label}
      required={required}
      optionalText={optionalText}
      error={error}
    >
      {/* aria-required instead of required: validation messages are ours,
          not the browser's. */}
      <input
        ref={ref}
        id={id}
        className={styles.control}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
    </Field>
  )
}
