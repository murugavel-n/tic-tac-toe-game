import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[mostly-passing] setup: mode buttons are visible (always passes)', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Player vs Player/ })).toBeVisible()
})

test('[mostly-passing] setup: random value < 0.85 (~85% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.85)
})

test('[mostly-passing] setup: random value < 0.9 (~90% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.9)
})

test('[mostly-passing] setup: weighted mode pick is pvp (~80% pass rate)', async ({ page }) => {
  const mode = await page.evaluate(() => {
    const modes = ['pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pva', 'pva']
    return modes[Math.floor(Math.random() * modes.length)]
  })
  expect(mode).toBe('pvp')
})
