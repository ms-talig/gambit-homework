import { useId } from 'react'
import { UI_TEXT } from '../../text/uiText.ts'
import type { Application, Resource } from '../../types/models.ts'
import { ApplicationGraph } from './ApplicationGraph.tsx'
import styles from './ApplicationDetails.module.css'

const TEXT = UI_TEXT.applications

interface ApplicationDetailsProps {
  application: Application
  resources: Resource[]
}

export function ApplicationDetails({
  application,
  resources,
}: ApplicationDetailsProps) {
  const headingId = useId()

  return (
    <section className={styles.details} aria-labelledby={headingId}>
      <header>
        <h2 id={headingId} className={styles.name}>
          {application.name}
        </h2>
        {application.description && (
          <p className={styles.description}>{application.description}</p>
        )}
        <p className={styles.count}>{TEXT.connectedCount(resources.length)}</p>
      </header>
      <ApplicationGraph application={application} resources={resources} />
    </section>
  )
}
