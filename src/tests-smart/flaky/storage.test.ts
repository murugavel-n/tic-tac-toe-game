import { describe, it, expect, beforeEach } from 'vitest'
import { loadScores, saveScores, loadSetup, saveSetup, defaultScores } from '../../utils/storage'
import type { GameSetup } from '../../utils/storage'

beforeEach(() => {
  localStorage.clear()
})

// Tests pass or fail non-deterministically due to Math.random().

describe('[flaky] storage: random read/write patterns', () => {
  it('flaky ~50%: randomly saves or skips, then checks for saved value', () => {
    const shouldSave = Math.random() < 0.5
    if (shouldSave) {
      saveScores({ pvp: { X: 1, O: 0, draw: 0 }, pva: { X: 0, O: 0, draw: 0 } })
    }
    // Always expects saved value — fails when shouldSave is false
    expect(loadScores().pvp.X).toBe(1)
  })

  it('flaky ~50%: randomly saves setup or not, then checks it exists', () => {
    const setup: GameSetup = {
      mode: 'pvp',
      player1: { name: 'Alice', symbol: 'X' },
      player2: { name: 'Bob', symbol: 'O' },
      seriesLength: 5,
    }
    if (Math.random() < 0.5) saveSetup(setup)
    // Always expects setup to exist — fails ~50% of the time
    expect(loadSetup()).not.toBeNull()
  })
})

describe('[flaky] storage: random assertion values', () => {
  it('flaky ~50%: saves score then asserts random expected X value', () => {
    saveScores({ pvp: { X: 3, O: 1, draw: 0 }, pva: defaultScores().pva })
    // Passes only when random rounds to 3
    const expected = Math.round(Math.random() * 5)
    expect(loadScores().pvp.X).toBe(expected)
  })

  it('flaky ~50%: random coin decides whether to clear before loading', () => {
    saveScores({ pvp: { X: 7, O: 0, draw: 0 }, pva: defaultScores().pva })
    if (Math.random() < 0.5) localStorage.clear()
    // Passes only when clear was not called
    expect(loadScores().pvp.X).toBe(7)
  })
})
