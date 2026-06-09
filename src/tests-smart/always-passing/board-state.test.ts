import { describe, it, expect } from 'vitest'
import { calculateWinner, isDraw, getComputerMove, Board } from '../../utils/gameLogic'

describe('[always-passing] board-state: cell counts', () => {
  it('empty board has 9 null cells', () => {
    const board = Array(9).fill(null) as Board
    expect(board.filter((c) => c === null).length).toBe(9)
  })

  it('after one move, 8 cells are empty', () => {
    const board = ['X', null, null, null, null, null, null, null, null] as Board
    expect(board.filter((c) => c === null).length).toBe(8)
  })

  it('full board has 0 empty cells', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(board.filter((c) => c === null).length).toBe(0)
  })
})

describe('[always-passing] board-state: computer move', () => {
  it('computer returns a valid index on an empty board', () => {
    const move = getComputerMove(Array(9).fill(null) as Board)
    expect(move).toBeGreaterThanOrEqual(0)
    expect(move).toBeLessThanOrEqual(8)
  })

  it('computer picks the winning move when available', () => {
    // O can win at index 8
    const board = [null, 'X', 'X', null, 'O', null, null, 'O', null] as Board
    const move = getComputerMove(board)
    expect(move).toBe(2)
  })

  it('computer blocks X from winning', () => {
    // X would win at index 2 — computer must block it
    const board = ['X', 'X', null, 'O', null, null, null, null, null] as Board
    const move = getComputerMove(board)
    expect(move).toBe(2)
  })
})

describe('[always-passing] board-state: game over conditions', () => {
  it('game is over when there is a winner', () => {
    const board = ['X', 'X', 'X', 'O', null, 'O', null, null, null] as Board
    expect(calculateWinner(board)).not.toBeNull()
  })

  it('game is over when board is a draw', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(isDraw(board)).toBe(true)
  })

  it('game is not over on an empty board', () => {
    const board = Array(9).fill(null) as Board
    expect(calculateWinner(board)).toBeNull()
    expect(isDraw(board)).toBe(false)
  })
})
