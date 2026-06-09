import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

// These E2E tests always pass — stable baseline for SmartTests.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[always-passing] setup screen is visible on load', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Player vs Player/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Play against Computer/ })).toBeVisible()
})

test('[always-passing] Start Game button appears after mode selection', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('[always-passing] board renders 9 cells after starting a game', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('gridcell')).toHaveCount(9)
})

test('[always-passing] Player 1 turn shown at start', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByText(/Player 1's turn/i)).toBeVisible()
})

test('[always-passing] clicking a cell places a mark', async ({ page }) => {
  await startPvpGame(page)
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await expect(
    page.getByRole('gridcell', { name: /Row 1, Column 1/ })
  ).not.toHaveAttribute('aria-label', 'Row 1, Column 1, empty')
})

test('[always-passing] Finish Series button is visible during game', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('button', { name: /finish series/i })).toBeVisible()
})

test('[always-passing] score board is visible', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('region', { name: /score board/i })).toBeVisible()
})
