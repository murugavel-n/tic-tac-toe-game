import { describe, it, expect } from 'vitest'
import { calculateWinner, Board } from '../utils/gameLogic'

// These tests fail most of the time (~80–90%) but pass occasionally.
// SmartTests should classify these as "mostly failing".

describe('[mostly-failing] high fail rate', () => {
  it('mostly fails: random value < 0.15 (passes ~15% of the time)', () => {
    expect(Math.random()).toBeLessThan(0.15)
  })

  it('mostly fails: random pick from weighted set', () => {
    // 2 passing values, 8 failing — passes 20% of the time
    const outcomes = [true, true, false, false, false, false, false, false, false, false]
    const pick = outcomes[Math.floor(Math.random() * outcomes.length)]
    expect(pick).toBe(true)
  })

  it('mostly fails: wrong winner assertion (always fails)', () => {
    // This one always fails — anchors the "mostly failing" group
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('mostly fails: random threshold check (passes ~10% of the time)', () => {
    expect(Math.random()).toBeLessThan(0.1)
  })

  it('mostly fails: random integer in small range (passes ~11% of the time)', () => {
    // Only value 0 passes (1 out of 9)
    const value = Math.floor(Math.random() * 9)
    expect(value).toBe(0)
  })
})
