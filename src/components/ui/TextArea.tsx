import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { Field } from './Field.tsx'
import styles from './Field.module.css'

interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange'
  > {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  optionalText?: string
}

export function TextArea({
  label,
  value,
  onChange,
  error,
  required,
  optionalText,
  ...props
}: TextAreaProps) {
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
      <textarea
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
