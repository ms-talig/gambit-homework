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
            {application.name}: {application.resourceIds.join(', ')}
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
})
