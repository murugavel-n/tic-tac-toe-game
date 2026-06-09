import { describe, it, expect } from 'vitest'

// These tests are flaky — they pass or fail non-deterministically.
// SmartTests should identify and flag these.

describe('[flaky] non-deterministic behaviour', () => {
  it('flaky: passes ~50% of the time (random coin flip)', () => {
    // Passes roughly half the time
    expect(Math.random()).toBeLessThan(0.5)
  })

  it('flaky: timing-sensitive assertion (random delay check)', () => {
    const start = Date.now()
    // Busy-wait for a random amount of time between 0–10ms
    const target = start + Math.floor(Math.random() * 10)
    while (Date.now() < target) {
      /* spin */
    }
    const elapsed = Date.now() - start
    // Asserts elapsed < 5ms — passes ~50% of the time
    expect(elapsed).toBeLessThan(5)
  })

  it('flaky: random integer in range check', () => {
    // Generates 0–9; asserts < 5 — passes ~50% of the time
    const value = Math.floor(Math.random() * 10)
    expect(value).toBeLessThan(5)
  })

  it('flaky: array shuffle order (passes ~17% of the time)', () => {
    // Checks that a randomly shuffled array starts with 1
    const arr = [1, 2, 3, 4, 5, 6]
    arr.sort(() => Math.random() - 0.5)
    expect(arr[0]).toBe(1)
  })
})
