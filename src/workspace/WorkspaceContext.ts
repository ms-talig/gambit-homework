import { createContext } from 'react'
import type {
  Application,
  CreateApplicationInput,
  Resource,
} from '../types/models.ts'

export const RESOURCES_STATUS = {
  loading: 'loading',
  ready: 'ready',
  error: 'error',
} as const

export type ResourcesStatus =
  (typeof RESOURCES_STATUS)[keyof typeof RESOURCES_STATUS]

export type CreateApplicationResult =
  | { ok: true; application: Application }
  | { ok: false; message: string }

export interface WorkspaceValue {
  resources: Resource[]
  resourcesStatus: ResourcesStatus
  resourcesError: string | null
  applications: Application[]
  createApplication: (input: CreateApplicationInput) => CreateApplicationResult
}

export const WorkspaceContext = createContext<WorkspaceValue | null>(null)
