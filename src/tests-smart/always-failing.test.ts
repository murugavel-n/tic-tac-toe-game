import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, Board } from '../utils/gameLogic'
import { defaultScores } from '../utils/storage'

// These tests always fail — intentional wrong assertions for SmartTests.

describe('[always-failing] game logic', () => {
  it('empty board should have a winner (wrong: expects X)', () => {
    // Wrong: empty board never has a winner
    expect(calculateWinner(Array(9).fill(null))?.winner).toBe('X')
  })

  it('X wins top row — wrong expected value', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    // Wrong: winner is X, not O
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('draw board is incorrectly expected to not be a draw', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    // Wrong: this IS a draw
    expect(isDraw(board)).toBe(false)
  })

  it('defaultScores pvp.X should start at 1 (wrong)', () => {
    // Wrong: starts at 0
    expect(defaultScores().pvp.X).toBe(1)
  })

  it('partial board incorrectly expected to be a draw', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null] as Board
    // Wrong: board is not full
    expect(isDraw(board)).toBe(true)
  })
})
