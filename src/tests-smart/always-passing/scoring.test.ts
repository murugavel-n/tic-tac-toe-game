import { describe, it, expect } from 'vitest'
import { defaultScores } from '../../utils/storage'

describe('[always-passing] scoring: default scores', () => {
  it('pvp X starts at 0', () => {
    expect(defaultScores().pvp.X).toBe(0)
  })

  it('pvp O starts at 0', () => {
    expect(defaultScores().pvp.O).toBe(0)
  })

  it('pvp draw starts at 0', () => {
    expect(defaultScores().pvp.draw).toBe(0)
  })

  it('pva X starts at 0', () => {
    expect(defaultScores().pva.X).toBe(0)
  })

  it('pva O starts at 0', () => {
    expect(defaultScores().pva.O).toBe(0)
  })

  it('pva draw starts at 0', () => {
    expect(defaultScores().pva.draw).toBe(0)
  })
})

describe('[always-passing] scoring: structure', () => {
  it('defaultScores has pvp and pva keys', () => {
    const scores = defaultScores()
    expect(scores).toHaveProperty('pvp')
    expect(scores).toHaveProperty('pva')
  })

  it('each record has X, O, draw keys', () => {
    const { pvp } = defaultScores()
    expect(pvp).toHaveProperty('X')
    expect(pvp).toHaveProperty('O')
    expect(pvp).toHaveProperty('draw')
  })

  it('all scores are numbers', () => {
    const { pvp, pva } = defaultScores()
    for (const val of Object.values(pvp)) expect(typeof val).toBe('number')
    for (const val of Object.values(pva)) expect(typeof val).toBe('number')
  })
})
