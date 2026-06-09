import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

// These E2E tests always fail — intentional wrong assertions for SmartTests.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[always-failing] setup screen shows a non-existent button', async ({ page }) => {
  // Wrong: this button does not exist
  await expect(page.getByRole('button', { name: /Reset Everything/i })).toBeVisible()
})

test('[always-failing] board has 10 cells (wrong: it has 9)', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('gridcell')).toHaveCount(10)
})

test('[always-failing] Player 2 goes first (wrong: Player 1 goes first)', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByText(/Player 2's turn/i)).toBeVisible()
})

test('[always-failing] score board is not on the page (wrong: it is)', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('region', { name: /score board/i })).not.toBeVisible()
})

test('[always-failing] title says Chess (wrong: it says Tic Tac Toe)', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Chess/i })).toBeVisible()
})
