import type {
  Criticality,
  Environment,
  Provider,
  Resource,
} from '../../types/models.ts'

export const ALL = 'all'

type FilterOption<T extends string> = T | typeof ALL

export interface ResourceFiltersValue {
  search: string
  provider: FilterOption<Provider>
  environment: FilterOption<Environment>
  criticality: FilterOption<Criticality>
}

export const DEFAULT_FILTERS: ResourceFiltersValue = {
  search: '',
  provider: ALL,
  environment: ALL,
  criticality: ALL,
}

function matchesOption<T extends string>(filter: FilterOption<T>, value: T) {
  return filter === ALL || filter === value
}

// Case-insensitive name search combined with every attribute filter (AND).
export function filterResources(
  resources: Resource[],
  filters: ResourceFiltersValue,
): Resource[] {
  const search = filters.search.trim().toLowerCase()

  return resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(search) &&
      matchesOption(filters.provider, resource.provider) &&
      matchesOption(filters.environment, resource.environment) &&
      matchesOption(filters.criticality, resource.criticality),
  )
}
