export const BUTTON_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
} as const

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]
