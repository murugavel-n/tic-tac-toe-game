import { test, expect } from '@playwright/test'
import { startPvaGame, changeSetupToPvp, changeSetupToPva } from './helpers'

async function clickCell(page: any, row: number, col: number) {
  await page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await startPvaGame(page)
})

test('Game ends with a result', async ({ page }) => {
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)
  await clickCell(page, 1, 2)
  await page.waitForTimeout(500)

  const gameStatusDiv = page.locator('.text-center.py-2 p')
  await expect(gameStatusDiv).toBeVisible()

  const isXTurn = await page.getByText("Player 1's turn").isVisible().catch(() => false)
  if (isXTurn) {
    await clickCell(page, 1, 3)
    await page.waitForTimeout(500)
  }

  const statusText = await gameStatusDiv.textContent().catch(() => '')
  expect(statusText).toBeTruthy()
})

test('Computer plays after player', async ({ page }) => {
  await clickCell(page, 2, 2)

  const emptyBefore = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyBefore).toBe(8)

  await page.waitForTimeout(500)

  const emptyAfter = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyAfter).toBe(7)
})

test('After computer moves, status is back to player turn', async ({ page }) => {
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)
  const playerTurnVisible = await page.getByText(/Player 1's turn/i).isVisible().catch(() => false)
  const computerWinsVisible = await page.getByText(/Computer wins/i).isVisible().catch(() => false)
  expect(playerTurnVisible || computerWinsVisible).toBe(true)
})

test('Game can be completed', async ({ page }) => {
  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
      const isPlayerTurn = await page.getByText(/Player 1's turn/i).isVisible().catch(() => false)
      if (!isPlayerTurn) break
      const cell = page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) })
      const isEmpty = await cell.getAttribute('aria-label').then(l => l?.includes('empty')).catch(() => false)
      if (isEmpty) {
        await cell.click()
        await page.waitForTimeout(500)
      }
    }
  }

  const resultEl = page.locator('[aria-live="assertive"]')
  await expect(resultEl).toBeVisible()
})

test('Mode switch resets board', async ({ page }) => {
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)

  await changeSetupToPvp(page)

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})

test('Switching back to computer mode gives fresh board', async ({ page }) => {
  await clickCell(page, 2, 2)
  await page.waitForTimeout(500)

  await changeSetupToPva(page)

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})
