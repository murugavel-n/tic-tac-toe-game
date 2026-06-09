import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[mostly-passing] gameplay: board has 9 cells (always passes)', async ({ page }) => {
  await expect(page.getByRole('gridcell')).toHaveCount(9)
})

test('[mostly-passing] gameplay: random value < 0.85 (~85% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.85)
})

test('[mostly-passing] gameplay: random cell index is not 8 (~88% pass rate)', async ({ page }) => {
  const idx = await page.evaluate(() => Math.floor(Math.random() * 9))
  expect(idx).not.toBe(8)
})

test('[mostly-passing] gameplay: weighted outcome is true (~80% pass rate)', async ({ page }) => {
  const result = await page.evaluate(() => {
    const outcomes = [true, true, true, true, true, true, true, true, false, false]
    return outcomes[Math.floor(Math.random() * outcomes.length)]
  })
  expect(result).toBe(true)
})
