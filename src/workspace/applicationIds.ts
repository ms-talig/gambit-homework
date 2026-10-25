import type { Application } from '../types/models.ts'

const APPLICATION_ID_PREFIX = 'app-'

export function formatApplicationId(applicationNumber: number): string {
  return `${APPLICATION_ID_PREFIX}${applicationNumber}`
}

// The number after the highest existing app-N ID, so restored applications
// never collide with new ones.
export function getNextApplicationNumber(
  applications: Application[],
): number {
  const numbers = applications
    .filter((application) => application.id.startsWith(APPLICATION_ID_PREFIX))
    .map((application) =>
      Number(application.id.slice(APPLICATION_ID_PREFIX.length)),
    )
    .filter(Number.isInteger)

  return Math.max(0, ...numbers) + 1
}
