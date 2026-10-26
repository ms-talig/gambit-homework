import { createContext } from 'react'
import type { WorkspaceValue } from '../types/workspace.ts'

export const WorkspaceContext = createContext<WorkspaceValue | null>(null)
