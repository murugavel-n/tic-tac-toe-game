import { describe, it, expect } from 'vitest'
import { calculateWinner, Board } from '../../utils/gameLogic'

// Tests pass or fail non-deterministically due to Math.random().

describe('[flaky] game-logic: random outcome checks', () => {
  it('flaky ~50%: random coin flip', () => {
    expect(Math.random()).toBeLessThan(0.5)
  })

  it('flaky ~50%: random integer 0–9 is less than 5', () => {
    expect(Math.floor(Math.random() * 10)).toBeLessThan(5)
  })

  it('flaky ~33%: random pick is "X"', () => {
    const picks = ['X', 'O', null]
    const pick = picks[Math.floor(Math.random() * picks.length)]
    expect(pick).toBe('X')
  })

  it('flaky ~50%: randomly selects a board that has or has no winner', () => {
    const boards: Board[] = [
      ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board, // has winner
      ['X', null, null, null, 'O', null, null, null, null] as Board, // no winner
    ]
    const board = boards[Math.floor(Math.random() * boards.length)]
    expect(calculateWinner(board)).not.toBeNull()
  })
})

describe('[flaky] game-logic: timing-sensitive', () => {
  it('flaky: busy-wait elapsed time < 5ms', () => {
    const start = Date.now()
    const target = start + Math.floor(Math.random() * 10)
    while (Date.now() < target) {
      /* spin */
    }
    expect(Date.now() - start).toBeLessThan(5)
  })

  it('flaky ~17%: shuffled array starts with 1', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    arr.sort(() => Math.random() - 0.5)
    expect(arr[0]).toBe(1)
  })
})
