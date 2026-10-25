import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest globals are disabled, so React Testing Library cannot register
// its automatic cleanup; unmount rendered trees after each test here.
// Saved applications must not leak between tests.
afterEach(() => {
  cleanup()
  sessionStorage.clear()
})

// jsdom lacks HTMLDialogElement.showModal/close. Test-only stand-ins that just
// toggle `open`; focus containment and Escape are checked in a real browser.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.open = false
}
