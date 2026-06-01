export interface GameRecord {
  X: number
  O: number
  draw: number
}

export interface Scores {
  pvp: GameRecord
  pva: {
    easy: GameRecord
    medium: GameRecord
    hard: GameRecord
  }
}

export function defaultScores(): Scores {
  return {
    pvp: { X: 0, O: 0, draw: 0 },
    pva: {
      easy: { X: 0, O: 0, draw: 0 },
      medium: { X: 0, O: 0, draw: 0 },
      hard: { X: 0, O: 0, draw: 0 },
    },
  }
}

const STORAGE_KEY = 'ttt_scores'

export function loadScores(): Scores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return defaultScores()
    const parsed = JSON.parse(raw) as Scores
    // Validate required keys exist
    if (
      !parsed.pvp ||
      !parsed.pva ||
      !parsed.pva.easy ||
      !parsed.pva.medium ||
      !parsed.pva.hard
    ) {
      return defaultScores()
    }
    return parsed
  } catch {
    return defaultScores()
  }
}

export function saveScores(scores: Scores): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}
