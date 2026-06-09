import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[mostly-failing] scoreboard: shows 99 score (always fails)', async ({ page }) => {
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('99', { exact: true })).toBeVisible()
})

test('[mostly-failing] scoreboard: random value < 0.1 (~10% pass rate)', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.1)
})

test('[mostly-failing] scoreboard: weighted series length is 10 (~20% pass rate)', async ({
  page,
}) => {
  const length = await page.evaluate(() => {
    const lengths = [3, 3, 3, 3, 5, 5, 5, 5, 10, 10]
    return lengths[Math.floor(Math.random() * lengths.length)]
  })
  expect(length).toBeGreaterThan(7)
})

test('[mostly-failing] scoreboard: random index equals 0 (~11% pass rate)', async ({ page }) => {
  const idx = await page.evaluate(() => Math.floor(Math.random() * 9))
  expect(idx).toBe(0)
})
