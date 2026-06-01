import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadScores, saveScores, defaultScores, type Scores } from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('defaultScores', () => {
  it('returns an object with all counts set to 0', () => {
    const scores = defaultScores()
    expect(scores.pvp).toEqual({ X: 0, O: 0, draw: 0 })
    expect(scores.pva.easy).toEqual({ X: 0, O: 0, draw: 0 })
    expect(scores.pva.medium).toEqual({ X: 0, O: 0, draw: 0 })
    expect(scores.pva.hard).toEqual({ X: 0, O: 0, draw: 0 })
  })

  it('returns a fresh object each call (not shared reference)', () => {
    const a = defaultScores()
    const b = defaultScores()
    a.pvp.X = 99
    expect(b.pvp.X).toBe(0)
  })
})

describe('loadScores', () => {
  it('returns defaultScores() when localStorage is empty', () => {
    expect(loadScores()).toEqual(defaultScores())
  })

  it('returns defaultScores() when value is malformed JSON', () => {
    localStorage.setItem('ttt_scores', 'not-valid-json{{{')
    expect(loadScores()).toEqual(defaultScores())
  })

  it('returns defaultScores() when value is valid JSON but missing keys', () => {
    localStorage.setItem('ttt_scores', JSON.stringify({ pvp: { X: 1, O: 0, draw: 0 } }))
    expect(loadScores()).toEqual(defaultScores())
  })

  it('returns defaultScores() when value is valid JSON but pva is missing', () => {
    localStorage.setItem('ttt_scores', JSON.stringify({ pvp: { X: 1, O: 2, draw: 3 } }))
    expect(loadScores()).toEqual(defaultScores())
  })

  it('returns correct scores when valid data is stored', () => {
    const stored: Scores = {
      pvp: { X: 3, O: 1, draw: 2 },
      pva: {
        easy: { X: 5, O: 2, draw: 1 },
        medium: { X: 0, O: 4, draw: 3 },
        hard: { X: 1, O: 7, draw: 0 },
      },
    }
    localStorage.setItem('ttt_scores', JSON.stringify(stored))
    expect(loadScores()).toEqual(stored)
  })
})

describe('saveScores / loadScores roundtrip', () => {
  it('saves and loads back the same scores', () => {
    const scores = defaultScores()
    scores.pvp.X = 5
    scores.pvp.O = 3
    scores.pvp.draw = 1
    scores.pva.hard.O = 10
    scores.pva.medium.draw = 2

    saveScores(scores)
    const loaded = loadScores()

    expect(loaded).toEqual(scores)
  })

  it('overwrites previous data on save', () => {
    const first = defaultScores()
    first.pvp.X = 1
    saveScores(first)

    const second = defaultScores()
    second.pvp.X = 99
    saveScores(second)

    expect(loadScores().pvp.X).toBe(99)
  })
})

describe('loadScores with simulated localStorage errors', () => {
  it('returns defaultScores() when localStorage.getItem throws', () => {
    const mockStorage = {
      getItem: vi.fn(() => {
        throw new Error('storage error')
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    vi.stubGlobal('localStorage', mockStorage)

    expect(loadScores()).toEqual(defaultScores())

    vi.unstubAllGlobals()
  })
})
