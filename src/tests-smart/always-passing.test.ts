import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../utils/gameLogic'
import { defaultScores } from '../utils/storage'

// These tests always pass — used as a stable baseline for SmartTests.

describe('[always-passing] game logic', () => {
  it('empty board has no winner', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull()
  })

  it('full board with no winner is a draw', () => {
    // X O X / O X O / O X O — draw
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(true)
  })

  it('top row win is detected', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('diagonal win is detected', () => {
    const board = ['O', null, 'X', null, 'O', 'X', null, null, 'O'] as Board
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('defaultScores returns all zeros', () => {
    const scores = defaultScores()
    expect(scores.pvp.X).toBe(0)
    expect(scores.pvp.O).toBe(0)
    expect(scores.pvp.draw).toBe(0)
    expect(scores.pva.X).toBe(0)
    expect(scores.pva.O).toBe(0)
    expect(scores.pva.draw).toBe(0)
  })

  it('partial board is not a draw', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null] as Board
    expect(isDraw(board)).toBe(false)
  })

  it('left column win is detected', () => {
    const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })

  it('right column win is detected', () => {
    const board = [null, 'O', 'X', null, 'O', 'X', null, null, 'X'] as Board
    expect(calculateWinner(board)?.winner).toBe('X')
  })
})
