import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[flaky] scoreboard: random coin flip ~50%', async ({ page }) => {
  const value = await page.evaluate(() => Math.random())
  expect(value).toBeLessThan(0.5)
})

test('[flaky] scoreboard: random score assertion (passes ~20% of the time)', async ({ page }) => {
  // Score is always 0, but expected value is randomly 0 or a larger number
  const expected = await page.evaluate(() => {
    const values = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8]
    return values[Math.floor(Math.random() * values.length)]
  })
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText(String(expected), { exact: true })).toBeVisible()
})

test('[flaky] scoreboard: random series badge text check (~50%)', async ({ page }) => {
  const text = await page.evaluate(() => (Math.random() < 0.5 ? '5 games' : '99 games'))
  await expect(page.getByText(text)).toBeVisible()
})
