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

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('New Game clears board', async ({ page }) => {
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 2)

  await page.getByRole('button', { name: /new game/i }).click()

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})

test('New Game keeps score', async ({ page }) => {
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: /new game/i }).click()

  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Reset Scores zeros all', async ({ page }) => {
  await playXWin(page)

  await page.getByRole('button', { name: /reset all scores/i }).click()

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})

test('Reset Scores persists after reload', async ({ page }) => {
  await playXWin(page)
  await page.getByRole('button', { name: /reset all scores/i }).click()

  await page.reload()

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})

test('Mode switch clears board', async ({ page }) => {
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 2)

  await changeSetupToPva(page)

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})

test('Change Setup resets scores', async ({ page }) => {
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  // Change setup should reset scores
  await changeSetupToPvp(page)

  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})
