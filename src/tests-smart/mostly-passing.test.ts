import { describe, it, expect } from 'vitest'
import { calculateWinner, Board } from '../utils/gameLogic'

// These tests pass most of the time (~80–90%) but fail occasionally.
// SmartTests should classify these as "mostly passing".

describe('[mostly-passing] high pass rate', () => {
  it('mostly passes: random value < 0.85 (passes ~85% of the time)', () => {
    expect(Math.random()).toBeLessThan(0.85)
  })

  it('mostly passes: random pick from weighted set', () => {
    // 8 passing values, 2 failing — passes 80% of the time
    const outcomes = [true, true, true, true, true, true, true, true, false, false]
    const pick = outcomes[Math.floor(Math.random() * outcomes.length)]
    expect(pick).toBe(true)
  })

  it('mostly passes: valid board result is correct (always passes)', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('mostly passes: random threshold check (passes ~90% of the time)', () => {
    expect(Math.random()).toBeLessThan(0.9)
  })

  it('mostly passes: random integer in large range (passes ~88% of the time)', () => {
    // Value 0–7 pass (8 out of 9 values)
    const value = Math.floor(Math.random() * 9)
    expect(value).toBeLessThan(8)
  })
})
