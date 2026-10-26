import { useEffect, useId, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  description?: string
  onClose: () => void
  initialFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode
}

// Open while mounted: render it conditionally. The native modal dialog
// provides focus containment, an inert background and Escape (cancel).
export function Modal({
  title,
  description,
  onClose,
  initialFocusRef,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    dialog.showModal()
    initialFocusRef?.current?.focus()

    return () => {
      dialog.close()
      // Return focus to the opener if it is still on the page.
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [initialFocusRef])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Let the owner unmount the dialog instead of the browser closing it.
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      {children}
    </dialog>
  )
}
