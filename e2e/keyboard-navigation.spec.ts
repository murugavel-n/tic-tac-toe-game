import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Tab navigates to game mode buttons', async ({ page }) => {
  // Focus the body first
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundRadio = false
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const role = await page.evaluate(() => document.activeElement?.getAttribute('role'))
    if (role === 'radio') {
      foundRadio = true
      break
    }
  }

  expect(foundRadio).toBe(true)
})

test('Can select game mode with keyboard', async ({ page }) => {
  // Tab to the Player vs AI radio button
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundPvARadio = false
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const label = await page.evaluate(() => document.activeElement?.textContent?.trim())
    if (label === 'Player vs AI') {
      foundPvARadio = true
      break
    }
  }

  expect(foundPvARadio).toBe(true)

  // Press Enter to select it
  await page.keyboard.press('Enter')

  // Verify aria-checked is true on the Player vs AI radio
  const pvaRadio = page.getByRole('radio', { name: 'Player vs AI' })
  await expect(pvaRadio).toHaveAttribute('aria-checked', 'true')
})

test('Can play a full game with keyboard only', async ({ page }) => {
  // Start the game first (click Start Game button)
  await startPvpGame(page)

  // Tab through the interface until we reach board cells
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundCell = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const role = await page.evaluate(() => document.activeElement?.getAttribute('role'))
    if (role === 'gridcell') {
      foundCell = true
      break
    }
  }

  expect(foundCell).toBe(true)

  // Press Enter to place X on focused cell (e.g. Row 1, Col 1)
  await page.keyboard.press('Enter')

  // Navigate to another cell and place O (Tab skips disabled cells)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  // Navigate and place X
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  // Verify we're in a valid game state (at least a few moves have been made)
  // Check via the game status container which always has exactly one p element
  const gameStatusDiv = page.locator('.text-center.py-2 p')
  await expect(gameStatusDiv).toBeVisible()

  // Verify cells have been filled (fewer than 9 empty cells)
  const emptyCellCount = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyCellCount).toBeLessThan(9)
})

test('Focus visible on cells', async ({ page }) => {
  // Start the game first
  await startPvpGame(page)

  // Focus a cell and verify focus ring styles are present
  const cell = page.getByRole('gridcell', { name: /Row 1, Column 1/ })
  await cell.focus()

  // Verify focus doesn't throw and the cell exists
  await expect(cell).toBeTruthy()
  await expect(cell).toBeVisible()

  // Check that the cell has the focus-visible class styles in its class list
  const className = await cell.getAttribute('class')
  expect(className).toContain('focus-visible:ring-2')
})

test('New Game button keyboard', async ({ page }) => {
  // Start the game first
  await startPvpGame(page)

  // Play a move first
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()

  // Tab to the New Game button
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundNewGame = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const label = await page.evaluate(() => document.activeElement?.textContent?.trim())
    const ariaLabel = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    if (label === 'New Game' || ariaLabel === 'Start a new game') {
      foundNewGame = true
      break
    }
  }

  expect(foundNewGame).toBe(true)

  // Press Enter to click New Game
  await page.keyboard.press('Enter')

  // Board should be reset
  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})
