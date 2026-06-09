import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../../utils/gameLogic'

describe('[mostly-failing] game-logic: always-failing anchors', () => {
  it('always fails: top row X win — wrong: expects O', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('always fails: draw board — wrong: expects false', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(false)
  })
})

describe('[mostly-failing] game-logic: probabilistic tests', () => {
  it('mostly fails ~85%: random value >= 0.15 triggers fail', () => {
    expect(Math.random()).toBeLessThan(0.15)
  })

  it('mostly fails ~80%: weighted outcomes — 2-out-of-10 pass', () => {
    const outcomes = [true, true, false, false, false, false, false, false, false, false]
    expect(outcomes[Math.floor(Math.random() * outcomes.length)]).toBe(true)
  })

  it('mostly fails ~90%: random value < 0.1', () => {
    expect(Math.random()).toBeLessThan(0.1)
  })

  it('mostly fails ~88%: random integer equals 0 (1-in-9 chance)', () => {
    expect(Math.floor(Math.random() * 9)).toBe(0)
  })
})
