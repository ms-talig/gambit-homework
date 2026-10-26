import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App.tsx'
import { ROUTES } from '../src/routes/paths.ts'
import { UI_TEXT } from '../src/text/uiText.ts'

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
