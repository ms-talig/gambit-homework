import type { Resource } from '../types/models.ts'
import { resources } from './resources.ts'

// Local async boundary standing in for an API call; no HTTP request is made.
// Each resource and its tags array is copied so callers cannot mutate the
// shared fixtures.
export async function getResources(): Promise<Resource[]> {
  return resources.map((resource) => ({
    ...resource,
    tags: [...resource.tags],
  }))
}
