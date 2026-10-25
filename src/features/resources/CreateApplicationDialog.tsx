import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { UI_TEXT } from '../../app/uiText.ts'
import { Button } from '../../components/ui/Button.tsx'
import { BUTTON_VARIANT } from '../../components/ui/buttonVariants.ts'
import { Modal } from '../../components/ui/Modal.tsx'
import { TextArea } from '../../components/ui/TextArea.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import { WORKSPACE_MESSAGES } from '../../workspace/messages.ts'
import type { CreateApplicationResult } from '../../workspace/WorkspaceContext.ts'
import styles from './CreateApplicationDialog.module.css'

const TEXT = UI_TEXT.resources.createDialog
const DESCRIPTION_ROWS = 4

export interface ApplicationDraft {
  name: string
  description: string
}

interface CreateApplicationDialogProps {
  selectedCount: number
  onCancel: () => void
  onSubmit: (draft: ApplicationDraft) => CreateApplicationResult
}

export function CreateApplicationDialog({
  selectedCount,
  onCancel,
  onSubmit,
}: CreateApplicationDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const nameRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Immediate feedback; createApplication still validates the input.
    if (!name.trim()) {
      setNameError(WORKSPACE_MESSAGES.nameRequired)
      nameRef.current?.focus()
      return
    }
    setNameError(undefined)

    const result = onSubmit({ name, description })
    if (!result.ok) setFormError(result.message)
  }

  return (
    <Modal
      title={TEXT.title}
      description={TEXT.subtitle(selectedCount)}
      onClose={onCancel}
      initialFocusRef={nameRef}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          ref={nameRef}
          label={TEXT.nameLabel}
          required
          value={name}
          onChange={setName}
          error={nameError}
        />
        <TextArea
          label={TEXT.descriptionLabel}
          optionalText={TEXT.optional}
          rows={DESCRIPTION_ROWS}
          value={description}
          onChange={setDescription}
        />
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        <div className={styles.actions}>
          <Button variant={BUTTON_VARIANT.secondary} onClick={onCancel}>
            {TEXT.cancel}
          </Button>
          <Button type="submit">{TEXT.submit}</Button>
        </div>
      </form>
    </Modal>
  )
}
