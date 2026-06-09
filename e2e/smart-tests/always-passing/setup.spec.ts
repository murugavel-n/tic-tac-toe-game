import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[always-passing] setup: mode buttons are visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Player vs Player/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Play against Computer/ })).toBeVisible()
})

test('[always-passing] setup: selecting PvP shows Start Game', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('[always-passing] setup: selecting PvA shows Start Game', async ({ page }) => {
  await page.getByRole('button', { name: /Play against Computer/ }).click()
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('[always-passing] setup: page title is Tic Tac Toe', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Tic Tac Toe/i })).toBeVisible()
})

test('[always-passing] setup: series length options are visible', async ({ page }) => {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await expect(page.getByRole('button', { name: '3' })).toBeVisible()
  await expect(page.getByRole('button', { name: '5' })).toBeVisible()
})
