import type { Application, Resource } from '../types/models.ts'

// sessionStorage: created applications survive reloads and typed URLs in this
// browser tab, and are cleared when the tab is closed.
export const APPLICATIONS_STORAGE_KEY = 'gambit.applications'

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  )
}

function isApplication(value: unknown): value is Application {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    (candidate.description === undefined ||
      typeof candidate.description === 'string') &&
    isStringArray(candidate.resourceIds)
  )
}

// Stored data is untrusted: malformed entries are skipped, never thrown.
export function loadApplications(): Application[] {
  try {
    const stored = sessionStorage.getItem(APPLICATIONS_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isApplication) : []
  } catch {
    return []
  }
}

export function saveApplications(applications: Application[]): void {
  try {
    sessionStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    )
  } catch {
    // Storage unavailable or full: the app keeps working in memory.
  }
}

// Drops resource IDs that no longer exist, and applications left empty.
export function pruneUnknownResources(
  applications: Application[],
  resources: Resource[],
): Application[] {
  const knownIds = new Set(resources.map((resource) => resource.id))
  return applications
    .map((application) => ({
      ...application,
      resourceIds: application.resourceIds.filter((id) => knownIds.has(id)),
    }))
    .filter((application) => application.resourceIds.length > 0)
}
