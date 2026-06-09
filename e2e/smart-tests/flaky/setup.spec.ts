import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[flaky] setup: random coin flip ~50%', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.5)
})

test('[flaky] setup: race condition — checks Start Game before mode selected', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  // Very short timeout — flaky on slow CI
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible({ timeout: 50 })
})

test('[flaky] setup: random weighted mode pick is PvA (~20%)', async ({ page }) => {
  const mode = await page.evaluate(() => {
    const modes = ['pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pva', 'pva']
    return modes[Math.floor(Math.random() * modes.length)]
  })
  expect(mode).toBe('pva')
})

test('[flaky] setup: random series length is 10 (~25%)', async ({ page }) => {
  const length = await page.evaluate(() => {
    const lengths = [3, 5, 7, 10]
    return lengths[Math.floor(Math.random() * lengths.length)]
  })
  expect(length).toBe(10)
})
