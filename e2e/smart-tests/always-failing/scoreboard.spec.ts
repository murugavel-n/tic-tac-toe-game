import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

// All assertions are intentionally wrong — these tests always fail.

test('[always-failing] scoreboard: is not on the page (wrong: it is)', async ({ page }) => {
  await expect(page.getByRole('region', { name: /score board/i })).not.toBeVisible()
})

test('[always-failing] scoreboard: X starts at 5 (wrong: starts at 0)', async ({ page }) => {
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('5', { exact: true })).toBeVisible()
})

test('[always-failing] scoreboard: series badge shows 99 games (wrong)', async ({ page }) => {
  await expect(page.getByText(/99 games/)).toBeVisible()
})

test('[always-failing] scoreboard: draw count is 7 before any game (wrong)', async ({ page }) => {
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('7', { exact: true })).toBeVisible()
})
