import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../../utils/gameLogic'

describe('[mostly-passing] game-logic: stable tests', () => {
  it('always passes: top row X win is correctly detected', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('always passes: full draw board detected', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(true)
  })
})

describe('[mostly-passing] game-logic: probabilistic tests', () => {
  it('mostly passes ~85%: random value < 0.85', () => {
    expect(Math.random()).toBeLessThan(0.85)
  })

  it('mostly passes ~90%: random value < 0.9', () => {
    expect(Math.random()).toBeLessThan(0.9)
  })

  it('mostly passes ~80%: weighted outcome picks true', () => {
    const outcomes = [true, true, true, true, true, true, true, true, false, false]
    expect(outcomes[Math.floor(Math.random() * outcomes.length)]).toBe(true)
  })

  it('mostly passes ~88%: random integer 0–8 is not 8', () => {
    expect(Math.floor(Math.random() * 9)).not.toBe(8)
  })
})
