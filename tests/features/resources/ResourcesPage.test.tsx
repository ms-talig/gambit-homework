import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { UI_TEXT } from '../../../src/app/uiText.ts'
import { ResourcesPage } from '../../../src/features/resources/ResourcesPage.tsx'
import { ALL } from '../../../src/features/resources/resourceFilters.ts'
import type {
  Criticality,
  Environment,
  Provider,
} from '../../../src/types/models.ts'
import { WorkspaceProvider } from '../../../src/workspace/WorkspaceProvider.tsx'

const TEXT = UI_TEXT.resources

// Test inputs, type-checked against the model so typos fail to compile.
const AWS: Provider = 'AWS'
const PRODUCTION: Environment = 'production'
const HIGH: Criticality = 'high'

async function renderResourcesPage() {
  const user = userEvent.setup()
  render(
    <WorkspaceProvider>
      <ResourcesPage />
    </WorkspaceProvider>,
  )
  await screen.findByRole('table', { name: TEXT.tableLabel })
  return user
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
})
