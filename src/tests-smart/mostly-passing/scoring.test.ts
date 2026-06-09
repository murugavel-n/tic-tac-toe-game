import { describe, it, expect } from 'vitest'
import { defaultScores } from '../../utils/storage'

describe('[mostly-passing] scoring: stable tests', () => {
  it('always passes: pvp X starts at 0', () => {
    expect(defaultScores().pvp.X).toBe(0)
  })

  it('always passes: structure has pvp and pva', () => {
    const scores = defaultScores()
    expect(scores).toHaveProperty('pvp')
    expect(scores).toHaveProperty('pva')
  })
})

describe('[mostly-passing] scoring: probabilistic tests', () => {
  it('mostly passes ~80%: random weighted pick is "pvp"', () => {
    const modes = ['pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pva', 'pva']
    expect(modes[Math.floor(Math.random() * modes.length)]).toBe('pvp')
  })

  it('mostly passes ~90%: random value not in top 10%', () => {
    expect(Math.random()).toBeLessThan(0.9)
  })

  it('mostly passes ~87%: random integer 0–8 is less than 8', () => {
    expect(Math.floor(Math.random() * 9)).toBeLessThan(8)
  })

  it('mostly passes ~80%: 8-out-of-10 weighted series length is short', () => {
    const lengths = [3, 3, 3, 3, 5, 5, 5, 5, 10, 10]
    expect(lengths[Math.floor(Math.random() * lengths.length)]).toBeLessThan(7)
  })
})
