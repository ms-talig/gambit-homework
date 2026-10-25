import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../src/app/App.tsx'
import { ROUTES } from '../../src/app/routes.ts'
import { UI_TEXT } from '../../src/app/uiText.ts'

describe('App', () => {
  it('redirects the root URL to the Resources page', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: UI_TEXT.resources.title,
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.resources)
  })
})
