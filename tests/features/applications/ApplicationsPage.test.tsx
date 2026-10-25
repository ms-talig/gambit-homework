import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../../../src/app/AppRoutes.tsx'
import { applicationPath, ROUTES } from '../../../src/app/routes.ts'
import { UI_TEXT } from '../../../src/app/uiText.ts'
import { resources } from '../../../src/data/resources.ts'
import { WorkspaceProvider } from '../../../src/workspace/WorkspaceProvider.tsx'

const RESOURCES_TEXT = UI_TEXT.resources
const TEXT = UI_TEXT.applications

function renderApp(initialPath: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </MemoryRouter>,
  )
  return user
}

describe('ApplicationsPage', () => {
  it('shows exactly the member resources of a created application', async () => {
    const user = renderApp(ROUTES.resources)
    const applicationName = 'Payments API'
    const memberNames = ['payments-api-prod', 'payments-db']

    for (const name of memberNames) {
      await user.click(
        await screen.findByRole('checkbox', {
          name: RESOURCES_TEXT.selectResource(name),
        }),
      )
    }
    await user.click(
      screen.getByRole('button', { name: RESOURCES_TEXT.createApplication }),
    )
    const dialog = screen.getByRole('dialog')
    await user.type(
      within(dialog).getByRole('textbox', {
        name: RESOURCES_TEXT.createDialog.nameLabel,
      }),
      applicationName,
    )
    await user.click(
      within(dialog).getByRole('button', {
        name: RESOURCES_TEXT.createDialog.submit,
      }),
    )

    expect(
      await screen.findByRole('heading', { level: 2, name: applicationName }),
    ).toBeInTheDocument()

    const list = screen.getByRole('navigation', { name: TEXT.listLabel })
    expect(within(list).getByRole('link')).toHaveAttribute(
      'aria-current',
      'page',
    )

    const members = screen.getByRole('list', {
      name: TEXT.graph.membersLabel(applicationName),
    })
    const expectedMembers = resources
      .filter((resource) => memberNames.includes(resource.name))
      .map((resource) =>
        TEXT.graph.memberSummary(resource.name, resource.type, resource.provider),
      )
    expect(
      within(members)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(expectedMembers)
  })

  it('handles a missing application URL', async () => {
    const user = renderApp(applicationPath('app-999'))

    expect(screen.getByText(TEXT.notFound.message)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: TEXT.notFound.link }))
    expect(screen.getByText(TEXT.empty.message)).toBeInTheDocument()
  })
})
