import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[mostly-failing] setup: heading says Chess (always fails)', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Chess/i })).toBeVisible()
})

test('[mostly-failing] setup: random value < 0.15 (~15% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.15)
})

test('[mostly-failing] setup: weighted mode pick is pva (~20% pass rate)', async ({ page }) => {
  const mode = await page.evaluate(() => {
    const modes = ['pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pva', 'pva']
    return modes[Math.floor(Math.random() * modes.length)]
  })
  expect(mode).toBe('pva')
})

test('[mostly-failing] setup: random value < 0.1 (~10% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.1)
})
