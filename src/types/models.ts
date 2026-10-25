export type Provider = 'AWS' | 'GCP' | 'Azure'
export type Environment = 'production' | 'staging' | 'development'
export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export interface Resource {
  id: string
  name: string
  type: string
  provider: Provider
  region: string
  environment: Environment
  criticality: Criticality
  owner: string
  tags: string[]
  // Not in the brief's interface, but required as a table column and present
  // in its sample data.
  openIssues: number
}

export interface Application {
  id: string
  name: string
  description?: string
  resourceIds: string[]
}

export interface CreateApplicationInput {
  name: string
  description?: string
  resourceIds: string[]
}
