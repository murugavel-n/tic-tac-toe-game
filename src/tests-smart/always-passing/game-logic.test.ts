import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../../utils/gameLogic'

describe('[always-passing] game-logic: win detection', () => {
  it('top row win is detected', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('middle row win is detected', () => {
    const board = [null, 'O', null, 'X', 'X', 'X', null, 'O', null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('bottom row win is detected', () => {
    const board = [null, 'O', null, null, 'O', null, 'X', 'X', 'X'] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('left column win is detected', () => {
    const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('middle column win is detected', () => {
    const board = ['O', 'X', null, 'O', 'X', null, null, 'X', null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('right column win is detected', () => {
    const board = [null, 'O', 'X', null, 'O', 'X', null, null, 'X'] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('top-left diagonal win is detected', () => {
    const board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('top-right diagonal win is detected', () => {
    const board = [null, 'O', 'X', null, 'X', 'O', 'X', null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })
})

describe('[always-passing] game-logic: draw detection', () => {
  it('full board with no winner is a draw', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(true)
  })

  it('another valid draw board is detected', () => {
    const board = ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', 'X'] as Board
    expect(isDraw(board)).toBe(true)
  })

  it('empty board is not a draw', () => {
    expect(isDraw(Array(9).fill(null) as Board)).toBe(false)
  })

  it('partial board is not a draw', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null] as Board
    expect(isDraw(board)).toBe(false)
  })
})

describe('[always-passing] game-logic: no winner on empty/partial board', () => {
  it('empty board has no winner', () => {
    expect(calculateWinner(Array(9).fill(null) as Board)).toBeNull()
  })

  it('single move has no winner', () => {
    const board = ['X', null, null, null, null, null, null, null, null] as Board
    expect(calculateWinner(board)).toBeNull()
  })

  it('winning line indices are returned', () => {
    const board = ['O', null, null, 'O', null, null, 'O', null, null] as Board
    expect(calculateWinner(board)?.line).toEqual([0, 3, 6])
  })
})
