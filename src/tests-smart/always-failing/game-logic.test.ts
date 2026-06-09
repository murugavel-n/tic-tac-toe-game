import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../../utils/gameLogic'

// All assertions are intentionally wrong — these tests always fail.

describe('[always-failing] game-logic: win detection', () => {
  it('top row X win — wrong: expects O', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('left column X win — wrong: expects null', () => {
    const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null] as Board
    expect(calculateWinner(board)).toBeNull()
  })

  it('diagonal O win — wrong: expects X', () => {
    const board = ['O', null, 'X', null, 'O', 'X', null, null, 'O'] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('winning line — wrong: expects [1, 2, 3]', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.line).toEqual([1, 2, 3])
  })
})

describe('[always-failing] game-logic: draw detection', () => {
  it('full draw board — wrong: expects false', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(false)
  })

  it('empty board — wrong: expects to be a draw', () => {
    expect(isDraw(Array(9).fill(null) as Board)).toBe(true)
  })

  it('partial board — wrong: expects to be a draw', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null] as Board
    expect(isDraw(board)).toBe(true)
  })
})

describe('[always-failing] game-logic: empty board', () => {
  it('empty board — wrong: expects X to have won', () => {
    expect(calculateWinner(Array(9).fill(null) as Board)?.winner).toBe('X')
  })

  it('single move — wrong: expects isDraw to be true', () => {
    const board = ['X', null, null, null, null, null, null, null, null] as Board
    expect(isDraw(board)).toBe(true)
  })
})
