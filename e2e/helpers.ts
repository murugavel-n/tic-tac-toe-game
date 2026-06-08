import { Page } from '@playwright/test'

export async function startPvpGame(page: Page) {
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function startPvaGame(page: Page, difficulty: 'easy' | 'hard' = 'easy') {
  await page.getByRole('radio', { name: 'Player vs AI' }).click()
  if (difficulty === 'hard') {
    await page.getByRole('radio', { name: 'Hard' }).click()
  }
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function changeSetupToPvp(page: Page) {
  await page.getByRole('button', { name: /change game setup/i }).click()
  await page.getByRole('radio', { name: 'Player vs Player' }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
}

export async function changeSetupToPva(page: Page, difficulty: 'easy' | 'hard' = 'easy') {
  await page.getByRole('button', { name: /change game setup/i }).click()
  await page.getByRole('radio', { name: 'Player vs AI' }).click()
  if (difficulty === 'hard') {
    await page.getByRole('radio', { name: 'Hard' }).click()
  }
  await page.getByRole('button', { name: 'Start Game' }).click()
}
