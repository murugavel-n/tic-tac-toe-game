import { Page } from '@playwright/test'

export async function startPvpGame(page: Page) {
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function startPvaGame(page: Page) {
  await page.getByRole('button', { name: /Play against Computer/ }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function changeSetupToPvp(page: Page) {
  await page.getByRole('button', { name: /change game setup/i }).click()
  await page.getByRole('button', { name: /Player vs Player/ }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function changeSetupToPva(page: Page) {
  await page.getByRole('button', { name: /change game setup/i }).click()
  await page.getByRole('button', { name: /Play against Computer/ }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
}
