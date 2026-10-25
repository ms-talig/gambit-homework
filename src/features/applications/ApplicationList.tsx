import { Link } from 'react-router'
import { applicationPath } from '../../app/routes.ts'
import { UI_TEXT } from '../../app/uiText.ts'
import { CubeIcon } from '../../components/ui/icons.tsx'
import type { Application } from '../../types/models.ts'
import styles from './ApplicationList.module.css'

const TEXT = UI_TEXT.applications

interface ApplicationListProps {
  applications: Application[]
  selectedApplicationId?: string
}

export function ApplicationList({
  applications,
  selectedApplicationId,
}: ApplicationListProps) {
  return (
    <nav aria-label={TEXT.listLabel}>
      <ul className={styles.list}>
        {applications.map((application) => (
          <li key={application.id}>
            <Link
              to={applicationPath(application.id)}
              className={styles.item}
              aria-current={
                application.id === selectedApplicationId ? 'page' : undefined
              }
            >
              <span className={styles.icon}>
                <CubeIcon />
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{application.name}</span>
                <span className={styles.meta}>
                  {TEXT.resourceCount(application.resourceIds.length)}
                </span>
                {application.description && (
                  <span className={`${styles.meta} ${styles.description}`}>
                    {application.description}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
