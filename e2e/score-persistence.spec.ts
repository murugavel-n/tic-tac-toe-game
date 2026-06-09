import { test, expect } from '@playwright/test'
import { startPvpGame, changeSetupToPva } from './helpers'

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

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  await page.reload()

  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Draw increments draw counter', async ({ page }) => {
  await playDraw(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('New Series resets scores to zero', async ({ page }) => {
  await playXWin(page)

  await page.getByRole('button', { name: /finish series/i }).click()
  await page.getByRole('button', { name: /new series/i }).click()

  // Back on setup screen — start a new game and verify scores start at 0
  await startPvpGame(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})

test('Change Setup resets scores to zero', async ({ page }) => {
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  await changeSetupToPva(page)

  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})
