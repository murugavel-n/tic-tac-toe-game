import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

// All assertions are intentionally wrong — these tests always fail.

test('[always-failing] gameplay: board has 10 cells (wrong: 9)', async ({ page }) => {
  await expect(page.getByRole('gridcell')).toHaveCount(10)
})

test('[always-failing] gameplay: Player 2 goes first (wrong)', async ({ page }) => {
  await expect(page.getByText(/Player 2's turn/i)).toBeVisible()
})

test('[always-failing] gameplay: clicking cell places O (wrong: places X)', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await expect(page.getByRole('gridcell', { name: 'Row 1, Column 1, O' })).toBeVisible()
})

test('[always-failing] gameplay: Finish Series button does not exist (wrong)', async ({ page }) => {
  await expect(page.getByRole('button', { name: /finish series/i })).not.toBeVisible()
})

test('[always-failing] gameplay: Next Game visible before game ends (wrong)', async ({ page }) => {
  await expect(page.getByRole('button', { name: /next game/i })).toBeVisible()
})
