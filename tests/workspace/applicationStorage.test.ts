import { describe, expect, it } from 'vitest'
import { resources } from '../../src/data/resources.ts'
import {
  APPLICATIONS_STORAGE_KEY,
  loadApplications,
  pruneUnknownResources,
} from '../../src/workspace/applicationStorage.ts'

const VALID_APPLICATION = {
  id: 'app-1',
  name: 'Payments API',
  resourceIds: ['r-001'],
}

describe('applicationStorage', () => {
  it('ignores malformed stored data instead of throwing', () => {
    sessionStorage.setItem(APPLICATIONS_STORAGE_KEY, '{not json')
    expect(loadApplications()).toEqual([])

    sessionStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify([VALID_APPLICATION, { id: 2 }, null, 'text']),
    )
    expect(loadApplications()).toEqual([VALID_APPLICATION])
  })

  it('drops unknown resource IDs and applications left empty', () => {
    const pruned = pruneUnknownResources(
      [
        { ...VALID_APPLICATION, resourceIds: ['r-001', 'r-999'] },
        { id: 'app-2', name: 'Stale', resourceIds: ['r-999'] },
      ],
      resources,
    )

    expect(pruned).toEqual([VALID_APPLICATION])
  })
})
