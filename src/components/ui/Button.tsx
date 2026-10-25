import type { ButtonHTMLAttributes } from 'react'
import { BUTTON_VARIANT } from './buttonVariants.ts'
import type { ButtonVariant } from './buttonVariants.ts'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({
  variant = BUTTON_VARIANT.primary,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const classNames = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classNames} {...props} />
}
