import { useParams } from 'react-router'
import { APPLICATION_ID_PARAM } from '../../app/routes.ts'
import { UI_TEXT } from '../../app/uiText.ts'
import { PageHeader } from '../../components/ui/PageHeader.tsx'

export function ApplicationsPage() {
  const params = useParams<typeof APPLICATION_ID_PARAM>()
  const applicationId = params[APPLICATION_ID_PARAM]

  return (
    <>
      <PageHeader
        title={UI_TEXT.applications.title}
        subtitle={UI_TEXT.applications.subtitle}
      />
      {/* Placeholder until Stage 6 resolves the application. */}
      {applicationId && (
        <p>
          {UI_TEXT.applications.selectedLabel} {applicationId}
        </p>
      )}
    </>
  )
}
