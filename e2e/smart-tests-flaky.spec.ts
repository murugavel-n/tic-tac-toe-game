import { test, expect } from '@playwright/test'
import { startPvpGame } from './helpers'

// These E2E tests are flaky — they pass or fail non-deterministically.
// SmartTests should detect and flag these.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[flaky] race condition: check turn label immediately after navigation (no wait)', async ({
  page,
}) => {
  // Navigates and immediately checks without waiting for render to settle.
  // Depending on render timing, the text may or may not be present yet.
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
  // Intentionally no waitForSelector — flaky depending on JS execution speed
  const visible = await page.getByText(/Player 1's turn/i).isVisible()
  expect(visible).toBe(true)
})

test('[flaky] random coin flip passes ~50% of the time', async ({ page }) => {
  await startPvpGame(page)
  // Evaluates a random value in the browser context
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.5)
})

test('[flaky] short timeout race: element may or may not have appeared', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  // Uses an intentionally very short timeout — may time out on slow runs
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible({
    timeout: 50,
  })
})

test('[flaky] random browser value in range (passes ~40% of the time)', async ({ page }) => {
  await startPvpGame(page)
  const value = await page.evaluate(() => Math.floor(Math.random() * 10))
  // Passes for values 0–3 (4 out of 10)
  expect(value).toBeLessThan(4)
})
