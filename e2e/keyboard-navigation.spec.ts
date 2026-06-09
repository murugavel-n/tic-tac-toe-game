import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Tab navigates to mode selection buttons', async ({ page }) => {
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundModeButton = false
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const text = await page.evaluate(() => document.activeElement?.textContent?.trim())
    if (text && (text.includes('Player vs Player') || text.includes('Play against Computer'))) {
      foundModeButton = true
      break
    }
  }

  expect(foundModeButton).toBe(true)
})

test('Can select game mode with keyboard', async ({ page }) => {
  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundPvC = false
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const text = await page.evaluate(() => document.activeElement?.textContent?.trim())
    if (text && text.includes('Play against Computer')) {
      foundPvC = true
      break
    }
  }

  expect(foundPvC).toBe(true)

  // Press Enter to navigate to the details step
  await page.keyboard.press('Enter')

  // Should now see the Start Game button (step 2)
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('Can play a full game with keyboard only', async ({ page }) => {
  await startPvpGame(page)

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

  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  const gameStatusDiv = page.locator('.text-center.py-2 p')
  await expect(gameStatusDiv).toBeVisible()

  const emptyCellCount = await page.getByRole('gridcell', { name: /empty/ }).count()
  expect(emptyCellCount).toBeLessThan(9)
})

test('Focus visible on cells', async ({ page }) => {
  await startPvpGame(page)

  const cell = page.getByRole('gridcell', { name: /Row 1, Column 1/ })
  await cell.focus()

  await expect(cell).toBeVisible()

  const className = await cell.getAttribute('class')
  expect(className).toContain('focus-visible:ring-2')
})

test('Next Game button keyboard', async ({ page }) => {
  await startPvpGame(page)

  // X wins top row so Next Game button appears
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 3/ }).click()
  await expect(page.getByText(/Player 1 wins/)).toBeVisible()

  await page.evaluate(() => (document.body as HTMLElement).focus())

  let foundNextGame = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const label = await page.evaluate(() => document.activeElement?.textContent?.trim())
    const ariaLabel = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    if (label === 'Next Game' || ariaLabel === 'Start next game') {
      foundNextGame = true
      break
    }
  }

  expect(foundNextGame).toBe(true)

  await page.keyboard.press('Enter')

  const emptyCells = page.getByRole('gridcell', { name: /empty/ })
  await expect(emptyCells).toHaveCount(9)
})
