export interface GameRecord {
  X: number
  O: number
  draw: number
}

export interface Scores {
  pvp: GameRecord
  pva: GameRecord
}

export type Symbol = 'X' | 'O' | '🦊' | '🐼' | '⭐' | '🔥' | '💎' | '🚀'

export interface PlayerSetup {
  name: string
  symbol: Symbol
}

export interface GameSetup {
  mode: 'pvp' | 'pva'
  player1: PlayerSetup
  player2: PlayerSetup
}

export function defaultScores(): Scores {
  return {
    pvp: { X: 0, O: 0, draw: 0 },
    pva: { X: 0, O: 0, draw: 0 },
  }
}

const STORAGE_KEY = 'ttt_scores'
const SETUP_KEY = 'ttt_setup'

export function loadScores(): Scores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return defaultScores()
    const parsed = JSON.parse(raw) as Scores
    if (!parsed.pvp || !parsed.pva) return defaultScores()
    return parsed
  } catch {
    return defaultScores()
  }
}

export function saveScores(scores: Scores): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export function loadSetup(): GameSetup | null {
  try {
    const raw = localStorage.getItem(SETUP_KEY)
    if (raw === null) return null
    return JSON.parse(raw) as GameSetup
  } catch {
    return null
  }
}

export function saveSetup(setup: GameSetup): void {
  localStorage.setItem(SETUP_KEY, JSON.stringify(setup))
}

export function clearSetup(): void {
  localStorage.removeItem(SETUP_KEY)
}
