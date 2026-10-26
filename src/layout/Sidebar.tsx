import { NavLink } from 'react-router'
import { ROUTES } from '../app/routes.ts'
import { UI_TEXT } from '../text/uiText.ts'
import { DatabaseIcon, GridIcon } from '../components/ui/icons.tsx'
import { GambitLogo } from './GambitLogo.tsx'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  {
    to: ROUTES.resources,
    label: UI_TEXT.resources.navLabel,
    Icon: DatabaseIcon,
  },
  {
    to: ROUTES.applications,
    label: UI_TEXT.applications.navLabel,
    Icon: GridIcon,
  },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <GambitLogo className={styles.logo} label={UI_TEXT.brandName} />
        <p className={styles.title}>{UI_TEXT.appTitle}</p>
      </div>
      <nav aria-label={UI_TEXT.navigationLabel}>
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <li key={to}>
              {/* NavLink sets aria-current="page" on the active link, including
                  nested URLs such as /applications/:applicationId. */}
              <NavLink to={to} className={styles.link}>
                <Icon className={styles.icon} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
