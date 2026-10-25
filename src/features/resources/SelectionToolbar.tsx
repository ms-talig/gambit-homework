import { UI_TEXT } from '../../app/uiText.ts'
import { Button } from '../../components/ui/Button.tsx'
import { BUTTON_VARIANT } from '../../components/ui/buttonVariants.ts'
import styles from './SelectionToolbar.module.css'

const TEXT = UI_TEXT.resources

interface SelectionToolbarProps {
  selectedCount: number
  hiddenSelectedCount: number
  canCreate: boolean
  onClear: () => void
  onCreate: () => void
}

export function SelectionToolbar({
  selectedCount,
  hiddenSelectedCount,
  canCreate,
  onClear,
  onCreate,
}: SelectionToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <p className={styles.summary} role="status">
        <span className={styles.count}>
          {TEXT.selectedCount(selectedCount)}
        </span>
        {hiddenSelectedCount > 0 && (
          <span className={styles.hidden}>
            {TEXT.hiddenSelectedCount(hiddenSelectedCount)}
          </span>
        )}
      </p>
      <div className={styles.actions}>
        <Button
          variant={BUTTON_VARIANT.secondary}
          onClick={onClear}
          disabled={selectedCount === 0}
        >
          {TEXT.clearSelection}
        </Button>
        <Button onClick={onCreate} disabled={!canCreate}>
          {TEXT.createApplication}
        </Button>
      </div>
    </div>
  )
}
