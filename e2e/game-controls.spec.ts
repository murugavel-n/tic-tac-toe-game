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

test('Next Game clears board', async ({ page }) => {
  await playXWin(page)

  await page.getByRole('button', { name: /next game/i }).click()

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})

test('Next Game keeps score', async ({ page }) => {
  await playXWin(page)

  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: /next game/i }).click()

  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('Finish Series shows results popup', async ({ page }) => {
  await playXWin(page)

  await page.getByRole('button', { name: /finish series/i }).click()

  await expect(page.getByRole('dialog', { name: /series complete/i })).toBeVisible()
})

test('New Series in popup navigates to setup screen', async ({ page }) => {
  await page.getByRole('button', { name: /finish series/i }).click()
  await page.getByRole('button', { name: /new series/i }).click()

  await expect(page.getByRole('button', { name: /Player vs Player/ })).toBeVisible()
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

  await changeSetupToPvp(page)

  await expect(scoreBoard.getByText('1', { exact: true })).toHaveCount(0)
  await expect(scoreBoard.getByText('0', { exact: true }).first()).toBeVisible()
})
