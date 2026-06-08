import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

async function clickCell(page: any, row: number, col: number) {
  await page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await startPvpGame(page)
})

test('X wins on top row', async ({ page }) => {
  // X: (1,1), O: (2,1), X: (1,2), O: (2,2), X: (1,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 3)

  await expect(page.getByText(/Player 1 wins/)).toBeVisible()

  // Check winning highlight on top row cells
  const cell11 = page.getByRole('gridcell', { name: /Row 1, Column 1/ })
  const cell12 = page.getByRole('gridcell', { name: /Row 1, Column 2/ })
  const cell13 = page.getByRole('gridcell', { name: /Row 1, Column 3/ })
  await expect(cell11).toHaveClass(/bg-yellow-200/)
  await expect(cell12).toHaveClass(/bg-yellow-200/)
  await expect(cell13).toHaveClass(/bg-yellow-200/)
})

test('X wins on left column', async ({ page }) => {
  // X: (1,1), O: (1,2), X: (2,1), O: (1,3), X: (3,1)
  await clickCell(page, 1, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 3)
  await clickCell(page, 3, 1)

  await expect(page.getByText(/Player 1 wins/)).toBeVisible()
})

test('X wins on diagonal', async ({ page }) => {
  // X: (1,1), O: (1,2), X: (2,2), O: (1,3), X: (3,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 3)
  await clickCell(page, 3, 3)

  await expect(page.getByText(/Player 1 wins/)).toBeVisible()
})

test('O wins', async ({ page }) => {
  // X: (1,1), O: (2,1), X: (1,2), O: (2,2), X: (3,3), O: (2,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 3, 3)
  await clickCell(page, 2, 3)

  await expect(page.getByText(/Player 2 wins/)).toBeVisible()
})

test('Draw game', async ({ page }) => {
  // Fill board with no winner:
  // Play order: (1,1)X, (1,2)O, (1,3)X, (2,1)O, (2,3)X, (2,2)O, (3,1)X, (3,3)O, (3,2)X
  await clickCell(page, 1, 1) // X index 0
  await clickCell(page, 1, 2) // O index 1
  await clickCell(page, 1, 3) // X index 2
  await clickCell(page, 2, 1) // O index 3
  await clickCell(page, 2, 3) // X index 5
  await clickCell(page, 2, 2) // O index 4
  await clickCell(page, 3, 1) // X index 6
  await clickCell(page, 3, 3) // O index 8
  await clickCell(page, 3, 2) // X index 7

  await expect(page.getByText("It's a draw! 🤝")).toBeVisible()
})

test('Status updates after moves', async ({ page }) => {
  // Initially Player 1's turn
  await expect(page.getByText(/Player 1's turn/)).toBeVisible()

  // After X plays, it should be Player 2's turn
  await clickCell(page, 1, 1)
  await expect(page.getByText(/Player 2's turn/)).toBeVisible()

  // After O plays, it should be Player 1's turn again
  await clickCell(page, 2, 2)
  await expect(page.getByText(/Player 1's turn/)).toBeVisible()
})

test('New Game resets board', async ({ page }) => {
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 2)

  await page.getByRole('button', { name: /new game/i }).click()

  // All 9 cells should be empty
  const cells = page.getByRole('gridcell', { name: /empty/ })
  await expect(cells).toHaveCount(9)
})

test('Cannot click filled cell', async ({ page }) => {
  await clickCell(page, 1, 1) // X plays

  // The cell is now disabled — attempt to click it with force (bypasses enabled check)
  // The game logic should ignore clicks on filled cells
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click({ force: true })

  // The cell should still show X — aria-label should say "X"
  const cell = page.getByRole('gridcell', { name: /Row 1, Column 1/ })
  await expect(cell).toHaveAttribute('aria-label', 'Row 1, Column 1, X')

  // The turn should now be Player 2's (only one move was counted)
  await expect(page.getByText(/Player 2's turn/)).toBeVisible()
})
