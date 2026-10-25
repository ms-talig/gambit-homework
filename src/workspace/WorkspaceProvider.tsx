import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getResources } from '../data/getResources.ts'
import type {
  Application,
  CreateApplicationInput,
  Resource,
} from '../types/models.ts'
import { buildApplication } from './buildApplication.ts'
import { WORKSPACE_MESSAGES } from './messages.ts'
import { RESOURCES_STATUS, WorkspaceContext } from './WorkspaceContext.ts'
import type {
  CreateApplicationResult,
  WorkspaceValue,
} from './WorkspaceContext.ts'

type ResourcesState =
  | { status: typeof RESOURCES_STATUS.loading }
  | { status: typeof RESOURCES_STATUS.ready; resources: Resource[] }
  | { status: typeof RESOURCES_STATUS.error; message: string }

const NO_RESOURCES: Resource[] = []
const APPLICATION_ID_PREFIX = 'app-'

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [resourcesState, setResourcesState] = useState<ResourcesState>({
    status: RESOURCES_STATUS.loading,
  })
  const [applications, setApplications] = useState<Application[]>([])
  const nextApplicationNumber = useRef(1);

  useEffect(() => {
    // Ignore completions after unmount (including StrictMode's dev re-run).
    let ignore = false

    getResources().then(
      (resources) => {
        if (!ignore) {
          setResourcesState({ status: RESOURCES_STATUS.ready, resources })
        }
      },
      () => {
        if (!ignore) {
          setResourcesState({
            status: RESOURCES_STATUS.error,
            message: WORKSPACE_MESSAGES.resourcesLoadFailed,
          })
        }
      },
    )

    return () => {
      ignore = true
    }
  }, [])

  const createApplication = useCallback(
    (input: CreateApplicationInput): CreateApplicationResult => {
      if (resourcesState.status !== RESOURCES_STATUS.ready) {
        return { ok: false, message: WORKSPACE_MESSAGES.resourcesUnavailable }
      }

      const id = `${APPLICATION_ID_PREFIX}${nextApplicationNumber.current}`
      const result = buildApplication(input, resourcesState.resources, id)

      if (result.ok) {
        nextApplicationNumber.current += 1
        setApplications((current) => [...current, result.application])
      }

      return result
    },
    [resourcesState],
  )

  const value = useMemo<WorkspaceValue>(
    () => ({
      resources:
        resourcesState.status === RESOURCES_STATUS.ready
          ? resourcesState.resources
          : NO_RESOURCES,
      resourcesStatus: resourcesState.status,
      resourcesError:
        resourcesState.status === RESOURCES_STATUS.error
          ? resourcesState.message
          : null,
      applications,
      createApplication,
    }),
    [resourcesState, applications, createApplication],
  )

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>
}
