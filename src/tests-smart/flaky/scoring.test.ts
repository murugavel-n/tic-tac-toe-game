import { describe, it, expect } from 'vitest'
import { defaultScores } from '../../utils/storage'

// Tests pass or fail non-deterministically due to Math.random().

describe('[flaky] scoring: random value checks', () => {
  it('flaky ~50%: random score threshold', () => {
    const scores = defaultScores()
    // Adds a random number and checks if it's under 0.5 — passes ~50% of the time
    expect(scores.pvp.X + Math.random()).toBeLessThan(0.5)
  })

  it('flaky ~50%: random mode selection matches pvp', () => {
    const modes = ['pvp', 'pva']
    const selected = modes[Math.floor(Math.random() * modes.length)]
    expect(selected).toBe('pvp')
  })

  it('flaky ~25%: random value falls in first quartile', () => {
    expect(Math.random()).toBeLessThan(0.25)
  })
})

describe('[flaky] scoring: non-deterministic structure checks', () => {
  it('flaky ~50%: randomly checks pvp or pva draw count equals 0', () => {
    const scores = defaultScores()
    const key = Math.random() < 0.5 ? 'pvp' : 'pva'
    // Always 0, but randomly picks key — sometimes tests an unexpected path
    expect(scores[key].draw).toBe(Math.round(Math.random()))
  })

  it('flaky ~50%: random series length assertion', () => {
    const lengths = [3, 5, 7, 10]
    const chosen = lengths[Math.floor(Math.random() * lengths.length)]
    // Only half the values are below 6
    expect(chosen).toBeLessThan(6)
  })
})
