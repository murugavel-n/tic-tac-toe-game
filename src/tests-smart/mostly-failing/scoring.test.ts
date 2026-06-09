import { describe, it, expect } from 'vitest'
import { defaultScores } from '../../utils/storage'

describe('[mostly-failing] scoring: always-failing anchors', () => {
  it('always fails: pvp X — wrong: expects 1', () => {
    expect(defaultScores().pvp.X).toBe(1)
  })

  it('always fails: structure — wrong: expects no pvp key', () => {
    expect(defaultScores()).not.toHaveProperty('pvp')
  })
})

describe('[mostly-failing] scoring: probabilistic tests', () => {
  it('mostly fails ~80%: weighted outcome picks "pva" (2-out-of-10)', () => {
    const modes = ['pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pvp', 'pva', 'pva']
    expect(modes[Math.floor(Math.random() * modes.length)]).toBe('pva')
  })

  it('mostly fails ~90%: random value >= 0.9', () => {
    expect(Math.random()).toBeGreaterThanOrEqual(0.9)
  })

  it('mostly fails ~87%: random integer equals 8 (1-in-9 chance)', () => {
    expect(Math.floor(Math.random() * 9)).toBe(8)
  })

  it('mostly fails ~80%: 2-out-of-10 weighted series length is large', () => {
    const lengths = [3, 3, 3, 3, 5, 5, 5, 5, 10, 10]
    expect(lengths[Math.floor(Math.random() * lengths.length)]).toBeGreaterThan(7)
  })
})
