import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getResources } from '../data/getResources.ts'
import type {
  Application,
  CreateApplicationInput,
  Resource,
} from '../types/models.ts'
import { RESOURCES_STATUS } from '../types/workspace.ts'
import type {
  CreateApplicationResult,
  WorkspaceValue,
} from '../types/workspace.ts'
import {
  formatApplicationId,
  getNextApplicationNumber,
} from './applicationIds.ts'
import {
  loadApplications,
  pruneUnknownResources,
  saveApplications,
} from './applicationStorage.ts'
import { buildApplication } from './buildApplication.ts'
import { WORKSPACE_MESSAGES } from '../text/workspaceMessages.ts'
import { WorkspaceContext } from './WorkspaceContext.ts'

type ResourcesState =
  | { status: typeof RESOURCES_STATUS.loading }
  | { status: typeof RESOURCES_STATUS.ready; resources: Resource[] }
  | { status: typeof RESOURCES_STATUS.error; message: string }

const NO_RESOURCES: Resource[] = []

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [resourcesState, setResourcesState] = useState<ResourcesState>({
    status: RESOURCES_STATUS.loading,
  })
  const [applications, setApplications] =
    useState<Application[]>(loadApplications)
  const nextApplicationNumber = useRef(getNextApplicationNumber(applications));

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

  useEffect(() => {
    // Ignore completions after unmount (including StrictMode's dev re-run).
    let ignore = false

    getResources().then(
      (resources) => {
        if (!ignore) {
          setResourcesState({ status: RESOURCES_STATUS.ready, resources })
          setApplications((current) =>
            pruneUnknownResources(current, resources),
          )
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

      const id = formatApplicationId(nextApplicationNumber.current)
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
