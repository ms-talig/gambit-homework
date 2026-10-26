export const APPLICATION_ID_PARAM = 'applicationId'

export const ROUTES = {
  resources: '/resources',
  applications: '/applications',
  applicationDetail: `/applications/:${APPLICATION_ID_PARAM}`,
  notFound: '*',
} as const

export function applicationPath(applicationId: string): string {
  return `${ROUTES.applications}/${encodeURIComponent(applicationId)}`
}
