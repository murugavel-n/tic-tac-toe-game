import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

// These E2E tests fail most of the time (~80–90%) but pass occasionally.
// SmartTests should classify these as "mostly failing".

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[mostly-failing] always fails: board has 10 cells (wrong: it has 9)', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('gridcell')).toHaveCount(10)
})

test('[mostly-failing] random browser value < 0.15 (passes ~15% of the time)', async ({
  page,
}) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.15)
})

test('[mostly-failing] random pick from weighted outcomes (passes ~20% of the time)', async ({
  page,
}) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => {
    const outcomes = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    return outcomes[Math.floor(Math.random() * outcomes.length)]
  })
  expect(value).toBe(1)
})

test('[mostly-failing] random value < 0.1 (passes ~10% of the time)', async ({ page }) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.1)
})
