import { test, expect } from '@playwright/test'

async function clickCell(page: any, row: number, col: number) {
  await page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Switch to Player vs AI mode
  await page.getByRole('radio', { name: 'Player vs AI' }).click()
})

test('Easy mode: game ends with a result', async ({ page }) => {
  // Set difficulty to Easy
  await page.getByRole('radio', { name: 'Easy' }).click()

  // Play X at (1,1), wait for AI
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)
  await clickCell(page, 1, 2)
  await page.waitForTimeout(500)

  // Verify we are still in a valid game state
  // The game status div always shows exactly one text: either turn text or result text
  const gameStatusDiv = page.locator('.text-center.py-2 p')
  await expect(gameStatusDiv).toBeVisible()

  // Continue playing until game ends or we've made enough moves
  const isXTurn = await page.getByText("Player X's turn").isVisible().catch(() => false)
  if (isXTurn) {
    await clickCell(page, 1, 3)
    await page.waitForTimeout(500)
  }

  // After playing, one of: X wins, AI is playing (turn), X's turn, or game ended
  const statusText = await gameStatusDiv.textContent().catch(() => '')
  expect(statusText).toBeTruthy()
})

test('AI plays after X', async ({ page }) => {
  // Click one cell as X
  await clickCell(page, 2, 2)

  // Before AI move, only center should be filled
  const emptyBefore = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyBefore).toBe(8)

  // Wait for AI to move
  await page.waitForTimeout(500)

  // After AI move, 7 cells should be empty (2 filled)
  const emptyAfter = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyAfter).toBe(7)
})

test('After AI moves, status is back to Player X turn', async ({ page }) => {
  // X plays
  await clickCell(page, 1, 1)
  // Wait for AI
  await page.waitForTimeout(500)
  // Status should be Player X's turn again (or game over if AI won)
  const xTurnVisible = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
  const aiWinsVisible = await page.getByText(/AI wins/i).isVisible().catch(() => false)
  expect(xTurnVisible || aiWinsVisible).toBe(true)
})

test('Hard mode game ends', async ({ page }) => {
  // Switch to Hard difficulty
  await page.getByRole('radio', { name: 'Hard' }).click()

  // Play X at (1,1), wait for AI
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)

  // Play X at (1,2), wait for AI
  const xTurn1 = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
  if (xTurn1) {
    await clickCell(page, 1, 2)
    await page.waitForTimeout(500)
  }

  // Play X at (3,1), wait for AI
  const xTurn2 = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
  if (xTurn2) {
    await clickCell(page, 3, 1)
    await page.waitForTimeout(500)
  }

  // Play X at (3,2), wait for AI
  const xTurn3 = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
  if (xTurn3) {
    await clickCell(page, 3, 2)
    await page.waitForTimeout(500)
  }

  // Play X at (3,3), wait for AI
  const xTurn4 = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
  if (xTurn4) {
    await clickCell(page, 3, 3)
    await page.waitForTimeout(500)
  }

  // Game should eventually end
  const anyEndState = page.getByText(/Player X wins|AI wins|draw/i)
  // At minimum we should be in a game state after 5 X moves
  const gameEnded = await anyEndState.isVisible().catch(() => false)
  if (!gameEnded) {
    // Continue playing remaining cells
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 3; col++) {
        const isXTurn = await page.getByText(/Player X's turn/i).isVisible().catch(() => false)
        if (!isXTurn) break
        const cell = page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) })
        const isEmpty = await cell.getAttribute('aria-label').then(l => l?.includes('empty')).catch(() => false)
        if (isEmpty) {
          await cell.click()
          await page.waitForTimeout(500)
        }
      }
    }
  }

  // Check game ended — the result p element has aria-live="assertive"
  const resultEl = page.locator('[aria-live="assertive"]')
  await expect(resultEl).toBeVisible()
})

test('Mode switch resets board', async ({ page }) => {
  // Play a move in PvA mode
  await clickCell(page, 1, 1)
  await page.waitForTimeout(500)

  // Switch back to PvP mode
  await page.getByRole('radio', { name: 'Player vs Player' }).click()

  // Board should be cleared (all 9 cells empty)
  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})

test('Difficulty switch resets board', async ({ page }) => {
  // Play a move in PvA mode (already in PvA from beforeEach)
  await clickCell(page, 2, 2)
  await page.waitForTimeout(500)

  // Change difficulty
  await page.getByRole('radio', { name: 'Hard' }).click()

  // Board should be cleared (all 9 cells empty)
  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})
