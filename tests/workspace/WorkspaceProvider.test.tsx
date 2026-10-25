import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useWorkspace } from '../../src/workspace/useWorkspace.ts'
import { RESOURCES_STATUS } from '../../src/workspace/WorkspaceContext.ts'
import { WorkspaceProvider } from '../../src/workspace/WorkspaceProvider.tsx'

function WorkspaceProbe() {
  const { resources, resourcesStatus, applications, createApplication } =
    useWorkspace()

  return (
    <div>
      <p>Status: {resourcesStatus}</p>
      <p>Resources: {resources.length}</p>
      <button
        type="button"
        onClick={() =>
          createApplication({
            name: 'Payments API',
            resourceIds: ['r-001', 'r-002'],
          })
        }
      >
        Create
      </button>
      <ul aria-label="Applications">
        {applications.map((application) => (
          <li key={application.id}>
            {application.id} {application.name}:{' '}
            {application.resourceIds.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  )
}

describe('WorkspaceProvider', () => {
  it('loads resources and adds one created application', async () => {
    const user = userEvent.setup()
    render(
      <WorkspaceProvider>
        <WorkspaceProbe />
      </WorkspaceProvider>,
    )

    expect(
      await screen.findByText(`Status: ${RESOURCES_STATUS.ready}`),
    ).toBeInTheDocument()
    expect(screen.getByText('Resources: 11')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create' }))

    const list = screen.getByRole('list', { name: 'Applications' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Payments API: r-001, r-002')
  })

  it('restores saved applications after a remount and keeps IDs unique', async () => {
    const user = userEvent.setup()
    const renderWorkspace = () =>
      render(
        <WorkspaceProvider>
          <WorkspaceProbe />
        </WorkspaceProvider>,
      )

    // A remount stands in for a page reload in the same tab.
    const { unmount } = renderWorkspace()
    await screen.findByText(`Status: ${RESOURCES_STATUS.ready}`)
    await user.click(screen.getByRole('button', { name: 'Create' }))
    unmount()

    renderWorkspace()
    await screen.findByText(`Status: ${RESOURCES_STATUS.ready}`)
    const list = screen.getByRole('list', { name: 'Applications' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Create' }))
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(new Set(items.map((item) => item.textContent)).size).toBe(2)
  })
})
