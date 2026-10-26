import { Outlet } from 'react-router'
import styles from './AppLayout.module.css'
import { Sidebar } from '../Sidebar/Sidebar.tsx'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
