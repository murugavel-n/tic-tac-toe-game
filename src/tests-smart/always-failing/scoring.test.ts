import { describe, it, expect } from 'vitest'
import { defaultScores } from '../../utils/storage'

// All assertions are intentionally wrong — these tests always fail.

describe('[always-failing] scoring: wrong initial values', () => {
  it('pvp X — wrong: expects 1', () => {
    expect(defaultScores().pvp.X).toBe(1)
  })

  it('pvp O — wrong: expects 5', () => {
    expect(defaultScores().pvp.O).toBe(5)
  })

  it('pvp draw — wrong: expects 2', () => {
    expect(defaultScores().pvp.draw).toBe(2)
  })

  it('pva X — wrong: expects 10', () => {
    expect(defaultScores().pva.X).toBe(10)
  })

  it('pva O — wrong: expects -1', () => {
    expect(defaultScores().pva.O).toBe(-1)
  })
})

describe('[always-failing] scoring: wrong structure assertions', () => {
  it('defaultScores — wrong: expects no pvp key', () => {
    expect(defaultScores()).not.toHaveProperty('pvp')
  })

  it('defaultScores — wrong: expects no pva key', () => {
    expect(defaultScores()).not.toHaveProperty('pva')
  })

  it('pvp record — wrong: expects a "wins" key instead of X', () => {
    expect(defaultScores().pvp).toHaveProperty('wins')
  })
})
