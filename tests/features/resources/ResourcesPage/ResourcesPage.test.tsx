import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useParams } from 'react-router'
import { describe, expect, it } from 'vitest'
import { APPLICATION_ID_PARAM, ROUTES } from '../../../../src/routes/paths.ts'
import { UI_TEXT } from '../../../../src/text/uiText.ts'
import { resources } from '../../../../src/data/resources.ts'
import { ResourcesPage } from '../../../../src/features/resources/ResourcesPage/ResourcesPage.tsx'
import { ALL } from '../../../../src/features/resources/resourceFilters.ts'
import type {
  Criticality,
  Environment,
  Provider,
} from '../../../../src/types/models.ts'
import { WORKSPACE_MESSAGES } from '../../../../src/text/workspaceMessages.ts'
import { useWorkspace } from '../../../../src/workspace/useWorkspace.ts'
import { WorkspaceProvider } from '../../../../src/workspace/WorkspaceProvider.tsx'

const TEXT = UI_TEXT.resources
const DIALOG_TEXT = TEXT.createDialog

// Test inputs, type-checked against the model so typos fail to compile.
const AWS: Provider = 'AWS'
const GCP: Provider = 'GCP'
const PRODUCTION: Environment = 'production'
const HIGH: Criticality = 'high'

const WORKSPACE_PROBE_LABEL = 'Workspace probe'

// Stands in for the Applications page: exposes the route parameter and the
// stored applications so tests can assert navigation and created data.
function WorkspaceProbe() {
  const params = useParams<typeof APPLICATION_ID_PARAM>()
  const { applications } = useWorkspace()

  return (
    <output aria-label={WORKSPACE_PROBE_LABEL}>
      {JSON.stringify({
        applicationId: params[APPLICATION_ID_PARAM],
        applications,
      })}
    </output>
  )
}

async function renderResourcesPage() {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ROUTES.resources]}>
      <WorkspaceProvider>
        <Routes>
          <Route path={ROUTES.resources} element={<ResourcesPage />} />
          <Route path={ROUTES.applicationDetail} element={<WorkspaceProbe />} />
        </Routes>
      </WorkspaceProvider>
    </MemoryRouter>,
  )
  await screen.findByRole('table', { name: TEXT.tableLabel })
  return user
}

function resourceIdByName(name: string) {
  const resource = resources.find((candidate) => candidate.name === name)
  if (!resource) throw new Error(`Unknown fixture resource: ${name}`)
  return resource.id
}

async function selectResources(
  user: ReturnType<typeof userEvent.setup>,
  names: string[],
) {
  for (const name of names) {
    await user.click(
      screen.getByRole('checkbox', { name: TEXT.selectResource(name) }),
    )
  }
}

async function openCreateDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', { name: TEXT.createApplication }),
  )
  return screen.getByRole('dialog', { name: DIALOG_TEXT.title })
}

// Resource names are the table's row headers.
function visibleResourceNames() {
  return screen
    .getAllByRole('rowheader')
    .map((header) => header.textContent)
}

describe('ResourcesPage', () => {
  it('combines name search with provider, environment and criticality filters', async () => {
    const user = await renderResourcesPage()

    await user.selectOptions(screen.getByLabelText(TEXT.filters.provider), AWS)
    expect(visibleResourceNames()).toEqual([
      'payments-api-prod',
      'payments-db',
      'payment-receipts',
      'audit-logs',
      'ci-deploy-role',
    ])

    await user.selectOptions(
      screen.getByLabelText(TEXT.filters.environment),
      PRODUCTION,
    )
    expect(visibleResourceNames()).toEqual([
      'payments-api-prod',
      'payments-db',
      'payment-receipts',
      'audit-logs',
    ])

    await user.selectOptions(
      screen.getByLabelText(TEXT.filters.criticality),
      HIGH,
    )
    expect(visibleResourceNames()).toEqual([
      'payments-db',
      'payment-receipts',
      'audit-logs',
    ])

    // Uppercase input checks that search is case-insensitive.
    await user.type(screen.getByLabelText(TEXT.searchLabel), 'PAY')
    expect(visibleResourceNames()).toEqual(['payments-db', 'payment-receipts'])

    await user.type(screen.getByLabelText(TEXT.searchLabel), 'xyz')
    expect(screen.getByText(TEXT.noResults)).toBeInTheDocument()
  })

  it('keeps selected resources when filters hide them', async () => {
    const user = await renderResourcesPage()
    const provider = screen.getByLabelText(TEXT.filters.provider)

    await user.click(
      screen.getByRole('checkbox', {
        name: TEXT.selectResource('payments-api-prod'),
      }),
    )
    await user.click(
      screen.getByRole('checkbox', {
        name: TEXT.selectResource('website-assets'),
      }),
    )
    expect(screen.getByText(TEXT.selectedCount(2))).toBeInTheDocument()

    await user.selectOptions(provider, AWS)
    expect(visibleResourceNames()).not.toContain('website-assets')
    expect(screen.getByText(TEXT.selectedCount(2))).toBeInTheDocument()
    expect(screen.getByText(TEXT.hiddenSelectedCount(1))).toBeInTheDocument()

    await user.selectOptions(provider, ALL)
    expect(
      screen.getByRole('checkbox', {
        name: TEXT.selectResource('website-assets'),
      }),
    ).toBeChecked()

    await user.click(
      screen.getByRole('button', { name: TEXT.clearSelection }),
    )
    expect(screen.getByText(TEXT.selectedCount(0))).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: TEXT.selectResource('payments-api-prod'),
      }),
    ).not.toBeChecked()
  })

  it('selects and clears only the shown rows with the header checkbox', async () => {
    const user = await renderResourcesPage()
    const selectAll = screen.getByRole('checkbox', {
      name: TEXT.selectAllShown,
    })

    // An AWS row selected before filtering must survive select-all changes.
    await selectResources(user, ['payments-db'])
    await user.selectOptions(screen.getByLabelText(TEXT.filters.provider), GCP)
    expect(selectAll).not.toBeChecked()

    await selectResources(user, ['website-assets'])
    expect(selectAll).toBePartiallyChecked()

    await user.click(selectAll)
    expect(selectAll).toBeChecked()
    for (const checkbox of screen.getAllByRole('checkbox', {
      name: (accessibleName) => accessibleName !== TEXT.selectAllShown,
    })) {
      expect(checkbox).toBeChecked()
    }
    expect(screen.getByText(TEXT.selectedCount(4))).toBeInTheDocument()
    expect(screen.getByText(TEXT.hiddenSelectedCount(1))).toBeInTheDocument()

    await user.click(selectAll)
    expect(selectAll).not.toBeChecked()
    expect(screen.getByText(TEXT.selectedCount(1))).toBeInTheDocument()
    expect(screen.getByText(TEXT.hiddenSelectedCount(1))).toBeInTheDocument()
  })

  it('rejects a blank application name and keeps the draft', async () => {
    const user = await renderResourcesPage()
    await selectResources(user, ['payments-api-prod'])
    const dialog = await openCreateDialog(user)

    const nameInput = within(dialog).getByRole('textbox', {
      name: DIALOG_TEXT.nameLabel,
    })
    const descriptionInput = within(dialog).getByRole('textbox', {
      name: (accessibleName) =>
        accessibleName.startsWith(DIALOG_TEXT.descriptionLabel),
    })
    await user.type(descriptionInput, 'Payment processing')
    await user.type(nameInput, '   ')
    await user.click(
      within(dialog).getByRole('button', { name: DIALOG_TEXT.submit }),
    )

    expect(nameInput).toBeInvalid()
    expect(nameInput).toHaveAccessibleDescription(
      WORKSPACE_MESSAGES.nameRequired,
    )
    expect(descriptionInput).toHaveValue('Payment processing')
    expect(screen.getByRole('dialog', { name: DIALOG_TEXT.title })).toBe(dialog)

    await user.type(nameInput, 'Payments API')
    expect(nameInput).toBeValid()
    expect(nameInput).not.toHaveAccessibleDescription()
  })

  it('creates one application from the selection and opens it', async () => {
    const user = await renderResourcesPage()
    const selectedNames = ['payments-api-prod', 'payments-db']
    await selectResources(user, selectedNames)
    const dialog = await openCreateDialog(user)

    await user.type(
      within(dialog).getByRole('textbox', { name: DIALOG_TEXT.nameLabel }),
      'Payments API',
    )
    await user.click(
      within(dialog).getByRole('button', { name: DIALOG_TEXT.submit }),
    )

    const probe = await screen.findByLabelText(WORKSPACE_PROBE_LABEL)
    const { applicationId, applications } = JSON.parse(
      probe.textContent ?? '',
    )
    expect(applications).toHaveLength(1)
    expect(applications[0]).toMatchObject({
      name: 'Payments API',
      resourceIds: selectedNames.map(resourceIdByName),
    })
    expect(applicationId).toBe(applications[0].id)
  })
})
