import { test, expect } from '@playwright/test'
import { startPvpGame, changeSetupToPva, changeSetupToPvp } from './helpers'

async function clickCell(page: any, row: number, col: number) {
  await page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) }).click()
}

async function playXWin(page: any) {
  // X wins top row: (1,1), (2,1), (1,2), (2,2), (1,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 3)
  await expect(page.getByText(/Player 1 wins/)).toBeVisible()
}

async function playDraw(page: any) {
  // Draw sequence: X(1,1) O(1,2) X(1,3) O(2,1) X(2,3) O(2,2) X(3,1) O(3,3) X(3,2)
  await clickCell(page, 1, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 1, 3)
  await clickCell(page, 2, 1)
  await clickCell(page, 2, 3)
  await clickCell(page, 2, 2)
  await clickCell(page, 3, 1)
  await clickCell(page, 3, 3)
  await clickCell(page, 3, 2)
  await expect(page.getByText("It's a draw! 🤝")).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('Score increments on X win (PvP)', async ({ page }) => {
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Score persists after reload', async ({ page }) => {
  await playXWin(page)

  // Verify score is 1
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  // Reload page — setup is saved so the game view should persist
  await page.reload()

  // Score should still be 1
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Draw increments draw counter', async ({ page }) => {
  await playDraw(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Reset Score clears scores', async ({ page }) => {
  await playXWin(page)

  // Click Reset Scores
  await page.getByRole('button', { name: /reset all scores/i }).click()

  // All scores should show 0
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  const scoreValues = scoreBoard.getByText('0', { exact: true })
  await expect(scoreValues.first()).toBeVisible()

  // Score of 1 should no longer be present inside the score board
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
})

test('Reset Score persists after reload', async ({ page }) => {
  await playXWin(page)
  await page.getByRole('button', { name: /reset all scores/i }).click()

  // Reload — setup is persisted so game view should show
  await page.reload()

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})

test('PvA scores tracked separately from PvP', async ({ page }) => {
  // Record a PvP win first (score = 1)
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  // Switch to PvA via Change Setup
  await changeSetupToPva(page)

  // PvA score should be 0 (separate from PvP)
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()

  // Switch back to PvP via Change Setup
  await changeSetupToPvp(page)

  // PvP score should still be 1
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})
