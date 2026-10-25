import type { CreateApplicationInput, Resource } from '../types/models.ts'
import { WORKSPACE_MESSAGES } from './messages.ts'
import type { CreateApplicationResult } from './WorkspaceContext.ts'

// Validates creation input against the supplied resources and builds the
// Application. Pure: the caller owns ID generation and state updates.
export function buildApplication(
  input: CreateApplicationInput,
  resources: Resource[],
  id: string,
): CreateApplicationResult {
  const name = input.name.trim()
  if (!name) {
    return { ok: false, message: WORKSPACE_MESSAGES.nameRequired }
  }

  const resourceIds = [...new Set(input.resourceIds)]
  if (resourceIds.length === 0) {
    return { ok: false, message: WORKSPACE_MESSAGES.selectionRequired }
  }

  const knownIds = new Set(resources.map((resource) => resource.id))
  if (resourceIds.some((resourceId) => !knownIds.has(resourceId))) {
    return { ok: false, message: WORKSPACE_MESSAGES.unknownResources }
  }

  const description = input.description?.trim()

  return {
    ok: true,
    application: {
      id,
      name,
      ...(description ? { description } : {}),
      resourceIds,
    },
  }
}
