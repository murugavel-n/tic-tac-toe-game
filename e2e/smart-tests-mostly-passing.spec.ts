import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

// These E2E tests pass most of the time (~80–90%) but fail occasionally.
// SmartTests should classify these as "mostly passing".

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[mostly-passing] always passes: board has 9 cells', async ({ page }) => {
  await startPvpGame(page)
  await expect(page.getByRole('gridcell')).toHaveCount(9)
})

test('[mostly-passing] random browser value < 0.85 (passes ~85% of the time)', async ({
  page,
}) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.85)
})

test('[mostly-passing] random pick from weighted outcomes (passes ~80% of the time)', async ({
  page,
}) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => {
    const outcomes = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
    return outcomes[Math.floor(Math.random() * outcomes.length)]
  })
  expect(value).toBe(1)
})

test('[mostly-passing] random value < 0.9 (passes ~90% of the time)', async ({ page }) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.9)
})
