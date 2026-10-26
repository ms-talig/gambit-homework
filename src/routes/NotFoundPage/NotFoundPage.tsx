import { Link } from 'react-router'
import { PageHeader } from '../../components/ui/PageHeader/PageHeader.tsx'
import { ROUTES } from '../paths.ts'
import { UI_TEXT } from '../../text/uiText.ts'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title={UI_TEXT.notFound.title}
        subtitle={UI_TEXT.notFound.message}
      />
      <Link to={ROUTES.resources}>{UI_TEXT.notFound.backLink}</Link>
    </>
  )
}
