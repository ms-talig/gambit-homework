import { UI_TEXT } from '../../text/uiText.ts'
import { SearchInput } from '../../components/ui/SearchInput.tsx'
import { Select } from '../../components/ui/Select.tsx'
import type { SelectOption } from '../../components/ui/Select.tsx'
import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from '../../types/models.ts'
import { ALL } from './resourceFilters.ts'
import type { ResourceFiltersValue } from './resourceFilters.ts'
import styles from './ResourceFilters.module.css'

const TEXT = UI_TEXT.resources

function withAllOption<T extends string>(
  values: readonly T[],
): SelectOption<T | typeof ALL>[] {
  return [
    { value: ALL, label: TEXT.filters.all },
    ...values.map((value) => ({ value, label: value })),
  ]
}

const PROVIDER_OPTIONS = withAllOption(PROVIDERS)
const ENVIRONMENT_OPTIONS = withAllOption(ENVIRONMENTS)
const CRITICALITY_OPTIONS = withAllOption(CRITICALITIES)

interface ResourceFiltersProps {
  value: ResourceFiltersValue
  onChange: (value: ResourceFiltersValue) => void
}

export function ResourceFilters({ value, onChange }: ResourceFiltersProps) {
  return (
    <div className={styles.filters}>
      <SearchInput
        className={styles.search}
        label={TEXT.searchLabel}
        placeholder={TEXT.searchPlaceholder}
        value={value.search}
        onChange={(search) => onChange({ ...value, search })}
      />
      <Select
        label={TEXT.filters.provider}
        options={PROVIDER_OPTIONS}
        value={value.provider}
        onChange={(provider) => onChange({ ...value, provider })}
      />
      <Select
        label={TEXT.filters.environment}
        options={ENVIRONMENT_OPTIONS}
        value={value.environment}
        onChange={(environment) => onChange({ ...value, environment })}
      />
      <Select
        label={TEXT.filters.criticality}
        options={CRITICALITY_OPTIONS}
        value={value.criticality}
        onChange={(criticality) => onChange({ ...value, criticality })}
      />
    </div>
  )
}
