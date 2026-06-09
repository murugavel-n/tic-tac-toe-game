import { describe, it, expect, beforeEach } from 'vitest'
import { loadScores, saveScores, loadSetup, saveSetup, defaultScores } from '../../utils/storage'
import type { GameSetup } from '../../utils/storage'

const setup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Bob', symbol: 'O' },
  seriesLength: 5,
}

beforeEach(() => {
  localStorage.clear()
})

describe('[mostly-passing] storage: stable tests', () => {
  it('always passes: loadScores returns defaults on empty storage', () => {
    expect(loadScores()).toEqual(defaultScores())
  })

  it('always passes: saved setup can be loaded back', () => {
    saveSetup(setup)
    expect(loadSetup()).toEqual(setup)
  })
})

describe('[mostly-passing] storage: probabilistic tests', () => {
  it('mostly passes ~90%: random extra score offset is under 1', () => {
    saveScores({ pvp: { X: 0, O: 0, draw: 0 }, pva: defaultScores().pva })
    const loaded = loadScores()
    expect(loaded.pvp.X + Math.random() * 0.1).toBeLessThan(1)
  })

  it('mostly passes ~80%: randomly saves one of two setups, asserts mode is pvp', () => {
    const setups: GameSetup[] = [
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pvp' },
      { ...setup, mode: 'pva' },
      { ...setup, mode: 'pva' },
    ]
    const chosen = setups[Math.floor(Math.random() * setups.length)]
    saveSetup(chosen)
    expect(loadSetup()?.mode).toBe('pvp')
  })

  it('mostly passes ~88%: random seriesLength is not 10', () => {
    const lengths = [3, 3, 5, 5, 5, 5, 7, 7, 7, 10]
    const length = lengths[Math.floor(Math.random() * lengths.length)]
    expect(length).not.toBe(10)
  })
})
