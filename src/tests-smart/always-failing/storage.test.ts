import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadScores,
  saveScores,
  loadSetup,
  saveSetup,
  clearSetup,
  defaultScores,
} from '../../utils/storage'
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

// All assertions are intentionally wrong — these tests always fail.

describe('[always-failing] storage: scores', () => {
  it('loadScores on empty storage — wrong: expects X to be 99', () => {
    expect(loadScores().pvp.X).toBe(99)
  })

  it('after saveScores — wrong: expects loadScores to still return defaults', () => {
    saveScores({ pvp: { X: 3, O: 1, draw: 1 }, pva: { X: 0, O: 2, draw: 0 } })
    expect(loadScores()).toEqual(defaultScores())
  })

  it('after overwrite — wrong: expects old value to persist', () => {
    saveScores({ pvp: { X: 5, O: 0, draw: 0 }, pva: { X: 0, O: 0, draw: 0 } })
    saveScores(defaultScores())
    expect(loadScores().pvp.X).toBe(5)
  })
})

describe('[always-failing] storage: setup', () => {
  it('loadSetup on empty storage — wrong: expects a non-null value', () => {
    expect(loadSetup()).not.toBeNull()
  })

  it('after clearSetup — wrong: expects setup to still be there', () => {
    saveSetup(setup)
    clearSetup()
    expect(loadSetup()).toEqual(setup)
  })

  it('player name — wrong: expects Bob to be player1', () => {
    saveSetup(setup)
    expect(loadSetup()?.player1.name).toBe('Bob')
  })

  it('seriesLength — wrong: expects 99', () => {
    saveSetup(setup)
    expect(loadSetup()?.seriesLength).toBe(99)
  })
})
