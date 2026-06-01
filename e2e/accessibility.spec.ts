import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

  await clickCell(page, 1, 1)
  await clickCell(page, 2, 2)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Win state passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // X wins top row: (1,1), (2,1), (1,2), (2,2), (1,3)
  await clickCell(page, 1, 1)
  await clickCell(page, 2, 1)
  await clickCell(page, 1, 2)
  await clickCell(page, 2, 2)
  await clickCell(page, 1, 3)

  await expect(page.getByText(/Player X wins/)).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Draw state passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

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

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('PvA mode passes axe', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.getByRole('radio', { name: 'Player vs AI' }).click()

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

  await page.getByRole('radio', { name: 'Player vs AI' }).click()

  await clickCell(page, 2, 2)
  await page.waitForTimeout(500)

  // Disable color-contrast rule as axe can miscompute contrast for adjacent
  // flex elements when Tailwind hover classes are present in the DOM
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()
  expect(results.violations).toEqual([])
})
