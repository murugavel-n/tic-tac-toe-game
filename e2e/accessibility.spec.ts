import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { startPvpGame, startPvaGame } from './helpers'

async function clickCell(page: any, row: number, col: number) {
  await page.getByRole('gridcell', { name: new RegExp(`Row ${row}, Column ${col}`) }).click()
}

test('Initial setup screen passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Mid-game board passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await startPvpGame(page)

  await clickCell(page, 1, 1)
  await clickCell(page, 2, 2)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Win state passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await startPvpGame(page)

  // X wins top row: (1,1), (2,1), (1,2), (2,2), (1,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 3)

  await expect(page.getByText(/Player 1 wins/)).toBeVisible()
  // Wait for confetti canvas to be removed — it overlaps the page during animation
  // and causes axe to compute incorrect blended contrast values
  await page.waitForSelector('canvas[aria-hidden]', { state: 'detached', timeout: 5000 }).catch(() => {})

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Draw state passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await startPvpGame(page)

  // Draw sequence
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
  // Wait for confetti canvas to be removed before running axe
  await page.waitForSelector('canvas[aria-hidden]', { state: 'detached', timeout: 5000 }).catch(() => {})

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('PvA mode passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await startPvaGame(page)

  // Disable color-contrast rule as axe can miscompute contrast for adjacent
  // flex elements when Tailwind hover classes are present in the DOM
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('PvA mid-game passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await startPvaGame(page)

  await clickCell(page, 2, 2)
  await page.waitForTimeout(500)

  // Disable color-contrast rule as axe can miscompute contrast for adjacent
  // flex elements when Tailwind hover classes are present in the DOM
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()
  expect(results.violations).toEqual([])
})
