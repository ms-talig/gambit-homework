import { Link, useParams } from 'react-router'
import { APPLICATION_ID_PARAM, ROUTES } from '../../app/routes.ts'
import { UI_TEXT } from '../../app/uiText.ts'
import { PageHeader } from '../../components/ui/PageHeader.tsx'
import { Panel } from '../../components/ui/Panel.tsx'
import type { Resource } from '../../types/models.ts'
import { useWorkspace } from '../../workspace/useWorkspace.ts'
import { ApplicationDetails } from './ApplicationDetails.tsx'
import { ApplicationList } from './ApplicationList.tsx'
import styles from './ApplicationsPage.module.css'

const TEXT = UI_TEXT.applications

export function ApplicationsPage() {
  const { applications, resources } = useWorkspace()
  const params = useParams<typeof APPLICATION_ID_PARAM>()
  const applicationId = params[APPLICATION_ID_PARAM]
  const hasApplications = applications.length > 0

  // The URL is the only source of the selected application.
  const selectedApplication = applicationId
    ? applications.find((application) => application.id === applicationId)
    : undefined

  function renderDetails() {
    if (selectedApplication) {
      const resourcesById = new Map(
        resources.map((resource) => [resource.id, resource]),
      )
      const members = selectedApplication.resourceIds.flatMap(
        (resourceId): Resource[] => {
          const resource = resourcesById.get(resourceId)
          return resource ? [resource] : []
        },
      )
      return (
        <ApplicationDetails
          application={selectedApplication}
          resources={members}
        />
      )
    }

    if (applicationId) {
      return (
        <div className={styles.message}>
          <p>{TEXT.notFound.message}</p>
          <Link to={ROUTES.applications}>{TEXT.notFound.link}</Link>
        </div>
      )
    }

    if (!hasApplications) {
      return (
        <div className={styles.message}>
          <p>{TEXT.empty.message}</p>
          <Link to={ROUTES.resources}>{TEXT.empty.link}</Link>
        </div>
      )
    }

    return <p className={styles.message}>{TEXT.selectPrompt}</p>
  }

  return (
    <>
      <PageHeader title={TEXT.title} subtitle={TEXT.subtitle} />
      <div className={hasApplications ? styles.layout : undefined}>
        {hasApplications && (
          <Panel>
            <ApplicationList
              applications={applications}
              selectedApplicationId={applicationId}
            />
          </Panel>
        )}
        <Panel>{renderDetails()}</Panel>
      </div>
    </>
  )
}
