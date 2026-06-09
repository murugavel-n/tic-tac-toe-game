import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[always-passing] gameplay: board renders 9 cells', async ({ page }) => {
  await expect(page.getByRole('gridcell')).toHaveCount(9)
})

test('[always-passing] gameplay: Player 1 goes first', async ({ page }) => {
  await expect(page.getByText(/Player 1's turn/i)).toBeVisible()
})

test('[always-passing] gameplay: clicking a cell places a mark', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await expect(page.getByRole('gridcell', { name: 'Row 1, Column 1, X' })).toBeVisible()
})

test('[always-passing] gameplay: turn switches after a move', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await expect(page.getByText(/Player 2's turn/i)).toBeVisible()
})

test('[always-passing] gameplay: X wins top row correctly', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 3/ }).click()
  await expect(page.getByText(/Player 1 wins/i)).toBeVisible()
})

test('[always-passing] gameplay: Finish Series button visible during game', async ({ page }) => {
  await expect(page.getByRole('button', { name: /finish series/i })).toBeVisible()
})

test('[always-passing] gameplay: Next Game button appears after game ends', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 3/ }).click()
  await expect(page.getByRole('button', { name: /next game/i })).toBeVisible()
})
