import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// All assertions are intentionally wrong — these tests always fail.

test('[always-failing] setup: expects a non-existent Reset button', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Reset Everything/i })).toBeVisible()
})

test('[always-failing] setup: heading says Chess (wrong)', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Chess/i })).toBeVisible()
})

test('[always-failing] setup: Start Game visible before selecting mode (wrong)', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('[always-failing] setup: expects 10 mode buttons (wrong: there are 2)', async ({ page }) => {
  await expect(page.getByRole('button')).toHaveCount(10)
})

test('[always-failing] setup: series option 99 exists (wrong)', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await expect(page.getByRole('radio', { name: '99' })).toBeVisible()
})
