import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[flaky] gameplay: random coin flip ~50%', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.5)
})

test('[flaky] gameplay: random cell index assertion (~44%)', async ({ page }) => {
  // Picks a random index 0–8; asserts it's one of the first 4
  const idx = await page.evaluate(() => Math.floor(Math.random() * 9))
  expect(idx).toBeLessThan(4)
})

test('[flaky] gameplay: random pick — expects current player to be O (~50%)', async ({ page }) => {
  const player = await page.evaluate(() => (Math.random() < 0.5 ? 'Player 1' : 'Player 2'))
  expect(player).toBe('Player 2')
})

test('[flaky] gameplay: short timeout — Player 1 turn text appears in 10ms', async ({ page }) => {
  await expect(page.getByText(/Player 1's turn/i)).toBeVisible({ timeout: 10 })
})
