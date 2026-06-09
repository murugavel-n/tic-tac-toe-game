import { describe, it, expect } from 'vitest'
import { getComputerMove, Board } from '../../utils/gameLogic'

// All assertions are intentionally wrong — these tests always fail.

describe('[always-failing] board-state: cell counts', () => {
  it('empty board — wrong: expects 0 null cells', () => {
    const board = Array(9).fill(null) as Board
    expect(board.filter((c) => c === null).length).toBe(0)
  })

  it('after one move — wrong: expects 9 empty cells still', () => {
    const board = ['X', null, null, null, null, null, null, null, null] as Board
    expect(board.filter((c) => c === null).length).toBe(9)
  })

  it('full board — wrong: expects 5 empty cells', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as Board
    expect(board.filter((c) => c === null).length).toBe(5)
  })
})

describe('[always-failing] board-state: computer move', () => {
  it('computer move on empty board — wrong: expects -1', () => {
    const move = getComputerMove(Array(9).fill(null) as Board)
    expect(move).toBe(-1)
  })

  it('computer blocks X — wrong: expects index 0', () => {
    // X would win at index 2 — computer must block, but we expect 0
    const board = ['X', 'X', null, 'O', null, null, null, null, null] as Board
    expect(getComputerMove(board)).toBe(0)
  })
})
