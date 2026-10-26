import { describe, expect, it } from 'vitest'
import { resources } from '../../src/data/resources.ts'
import { buildApplication } from '../../src/workspace/buildApplication.ts'
import { WORKSPACE_MESSAGES } from '../../src/text/workspaceMessages.ts'

describe('buildApplication', () => {
  it('builds an application with trimmed name and description', () => {
    const result = buildApplication(
      {
        name: '  Payments API  ',
        description: '  Payment processing  ',
        resourceIds: ['r-001', 'r-002'],
      },
      resources,
      'app-1',
    )

    expect(result).toEqual({
      ok: true,
      application: {
        id: 'app-1',
        name: 'Payments API',
        description: 'Payment processing',
        resourceIds: ['r-001', 'r-002'],
      },
    })
  })

  it('removes duplicate resource IDs and omits a blank description', () => {
    const result = buildApplication(
      {
        name: 'Payments API',
        description: '   ',
        resourceIds: ['r-001', 'r-002', 'r-001'],
      },
      resources,
      'app-1',
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.application.resourceIds).toEqual(['r-001', 'r-002'])
    expect(result.application).not.toHaveProperty('description')
  })

  it('rejects unknown resource IDs', () => {
    const result = buildApplication(
      { name: 'Payments API', resourceIds: ['r-001', 'r-999'] },
      resources,
      'app-1',
    )

    expect(result).toEqual({
      ok: false,
      message: WORKSPACE_MESSAGES.unknownResources,
    })
  })

  it('rejects a blank name', () => {
    const result = buildApplication(
      { name: '   ', resourceIds: ['r-001'] },
      resources,
      'app-1',
    )

    expect(result).toEqual({
      ok: false,
      message: WORKSPACE_MESSAGES.nameRequired,
    })
  })

  it('rejects an empty selection', () => {
    const result = buildApplication(
      { name: 'Payments API', resourceIds: [] },
      resources,
      'app-1',
    )

    expect(result).toEqual({
      ok: false,
      message: WORKSPACE_MESSAGES.selectionRequired,
    })
  })
})
