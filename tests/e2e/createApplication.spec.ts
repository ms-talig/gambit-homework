import { expect, test } from '@playwright/test'
import { resources } from '../../src/data/resources.ts'
import { ROUTES } from '../../src/routes/paths.ts'
import { UI_TEXT } from '../../src/text/uiText.ts'

const RESOURCES_TEXT = UI_TEXT.resources
const DIALOG_TEXT = RESOURCES_TEXT.createDialog
const GRAPH_TEXT = UI_TEXT.applications.graph

const APPLICATION_NAME = 'Payments API'
const MEMBER_NAMES = ['payments-api-prod', 'payments-db']
const APPLICATION_URL = new RegExp(`${ROUTES.applications}/[^/]+$`)

test('creates an application that survives a page reload', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(ROUTES.resources)

  for (const name of MEMBER_NAMES) {
    await page
      .getByRole('checkbox', { name: RESOURCES_TEXT.selectResource(name) })
      .check()
  }
  await page
    .getByRole('button', { name: RESOURCES_TEXT.createApplication })
    .click()

  const dialog = page.getByRole('dialog', { name: DIALOG_TEXT.title })
  await dialog
    .getByRole('textbox', { name: DIALOG_TEXT.nameLabel })
    .fill(APPLICATION_NAME)
  await dialog.getByRole('button', { name: DIALOG_TEXT.submit }).click()

  await expect(page).toHaveURL(APPLICATION_URL)

  const expectedMembers = resources
    .filter((resource) => MEMBER_NAMES.includes(resource.name))
    .map((resource) =>
      GRAPH_TEXT.memberSummary(resource.name, resource.type, resource.provider),
    )
  const members = page
    .getByRole('list', { name: GRAPH_TEXT.membersLabel(APPLICATION_NAME) })
    .getByRole('listitem')

  await expect(members).toHaveText(expectedMembers)

  // Applications live in sessionStorage, which jsdom tests cannot reload.
  await page.reload()

  await expect(
    page.getByRole('heading', { level: 2, name: APPLICATION_NAME }),
  ).toBeVisible()
  await expect(members).toHaveText(expectedMembers)
})

// jsdom has limited native <dialog> support, so focus and Escape are checked here.
test('closes the create dialog with Escape and returns focus', async ({
  page,
}) => {
  await page.goto(ROUTES.resources)

  const checkbox = page.getByRole('checkbox', {
    name: RESOURCES_TEXT.selectResource(MEMBER_NAMES[0]),
  })
  await checkbox.check()
  const createButton = page.getByRole('button', {
    name: RESOURCES_TEXT.createApplication,
  })
  await createButton.click()

  const dialog = page.getByRole('dialog', { name: DIALOG_TEXT.title })
  const nameInput = dialog.getByRole('textbox', { name: DIALOG_TEXT.nameLabel })
  await expect(nameInput).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(createButton).toBeFocused()
  await expect(checkbox).toBeChecked()
})
