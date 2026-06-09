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

describe('[always-passing] storage: scores', () => {
  it('loadScores returns defaultScores when nothing saved', () => {
    expect(loadScores()).toEqual(defaultScores())
  })

  it('saveScores and loadScores round-trip correctly', () => {
    const scores = { pvp: { X: 3, O: 1, draw: 1 }, pva: { X: 0, O: 2, draw: 0 } }
    saveScores(scores)
    expect(loadScores()).toEqual(scores)
  })

  it('overwriting scores replaces previous value', () => {
    saveScores({ pvp: { X: 1, O: 0, draw: 0 }, pva: { X: 0, O: 0, draw: 0 } })
    saveScores(defaultScores())
    expect(loadScores()).toEqual(defaultScores())
  })
})

describe('[always-passing] storage: setup', () => {
  it('loadSetup returns null when nothing saved', () => {
    expect(loadSetup()).toBeNull()
  })

  it('saveSetup and loadSetup round-trip correctly', () => {
    saveSetup(setup)
    expect(loadSetup()).toEqual(setup)
  })

  it('clearSetup causes loadSetup to return null', () => {
    saveSetup(setup)
    clearSetup()
    expect(loadSetup()).toBeNull()
  })

  it('seriesLength is persisted correctly', () => {
    saveSetup({ ...setup, seriesLength: 10 })
    expect(loadSetup()?.seriesLength).toBe(10)
  })

  it('player names are persisted correctly', () => {
    saveSetup(setup)
    const loaded = loadSetup()
    expect(loaded?.player1.name).toBe('Alice')
    expect(loaded?.player2.name).toBe('Bob')
  })
})
