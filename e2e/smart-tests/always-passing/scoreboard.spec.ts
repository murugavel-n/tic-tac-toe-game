import { test, expect } from '@playwright/test'
import { startPvpGame } from '../../helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await startPvpGame(page)
})

test('[always-passing] scoreboard: is visible after starting a game', async ({ page }) => {
  await expect(page.getByRole('region', { name: /score board/i })).toBeVisible()
})

test('[always-passing] scoreboard: shows all-zero scores at start', async ({ page }) => {
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  const zeros = scoreBoard.getByText('0', { exact: true })
  await expect(zeros.first()).toBeVisible()
})

test('[always-passing] scoreboard: X score increments on win', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 3/ }).click()
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})

test('[always-passing] scoreboard: series badge shows total games', async ({ page }) => {
  await expect(page.getByText(/5 games|of 5/)).toBeVisible()
})

test('[always-passing] scoreboard: score persists after reload', async ({ page }) => {
  await page.getByRole('gridcell', { name: /Row 1, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 1/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 2, Column 2/ }).click()
  await page.getByRole('gridcell', { name: /Row 1, Column 3/ }).click()
  await page.reload()
  const scoreBoard = page.getByRole('region', { name: /score board/i })
  await expect(scoreBoard.getByText('1', { exact: true })).toBeVisible()
})
