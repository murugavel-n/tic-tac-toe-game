import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[mostly-failing] gameplay: board has 10 cells (always fails)', async ({ page }) => {
  await expect(page.getByRole('gridcell')).toHaveCount(10)
})

test('[mostly-failing] gameplay: random value < 0.15 (~15% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.15)
})

test('[mostly-failing] gameplay: weighted outcome is false (~80% fail rate)', async ({ page }) => {
  const result = await page.evaluate(() => {
    const outcomes = [true, true, false, false, false, false, false, false, false, false]
    return outcomes[Math.floor(Math.random() * outcomes.length)]
  })
  expect(result).toBe(true)
})

test('[mostly-failing] gameplay: random cell index equals 8 (~11% pass rate)', async ({ page }) => {
  const idx = await page.evaluate(() => Math.floor(Math.random() * 9))
  expect(idx).toBe(8)
})
