import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[mostly-passing] scoreboard: is visible (always passes)', async ({ page }) => {
  await expect(page.getByRole('region', { name: /score board/i })).toBeVisible()
})

test('[mostly-passing] scoreboard: random value < 0.9 (~90% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.9)
})

test('[mostly-passing] scoreboard: weighted series length is short (~80% pass rate)', async ({
  page,
}) => {
  const length = await page.evaluate(() => {
    const lengths = [3, 3, 3, 3, 5, 5, 5, 5, 10, 10]
    return lengths[Math.floor(Math.random() * lengths.length)]
  })
  expect(length).toBeLessThan(7)
})

test('[mostly-passing] scoreboard: random index is not 9 (~100% pass rate)', async ({ page }) => {
  const idx = await page.evaluate(() => Math.floor(Math.random() * 9))
  expect(idx).not.toBe(9)
})
