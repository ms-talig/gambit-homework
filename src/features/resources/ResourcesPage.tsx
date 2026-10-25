import { UI_TEXT } from '../../app/uiText.ts'
import { PageHeader } from '../../components/ui/PageHeader.tsx'

export function ResourcesPage() {
  return (
    <PageHeader
      title={UI_TEXT.resources.title}
      subtitle={UI_TEXT.resources.subtitle}
    />
  )
}
