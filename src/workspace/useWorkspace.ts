import { useContext } from 'react'
import { WorkspaceContext } from './WorkspaceContext.ts'
import type { WorkspaceValue } from './WorkspaceContext.ts'

export function useWorkspace(): WorkspaceValue {
  const value = useContext(WorkspaceContext)
  if (!value) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider.')
  }
  return value
}
