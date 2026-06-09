import { describe, it, expect } from 'vitest'
import { getComputerMove, Board } from '../../utils/gameLogic'

describe('[mostly-failing] board-state: always-failing anchors', () => {
  it('always fails: empty board — wrong: expects 0 null cells', () => {
    expect(
      Array(9)
        .fill(null)
        .filter((c) => c === null).length
    ).toBe(0)
  })

  it('always fails: computer move — wrong: expects -1', () => {
    expect(getComputerMove(Array(9).fill(null) as Board)).toBe(-1)
  })
})

describe('[mostly-failing] board-state: probabilistic tests', () => {
  it('mostly fails ~85%: random board index is less than 2', () => {
    expect(Math.floor(Math.random() * 9)).toBeLessThan(2)
  })

  it('mostly fails ~88%: random offset makes move equal to 9', () => {
    const move = getComputerMove(Array(9).fill(null) as Board)
    const adjusted = move + Math.floor(Math.random() * 9)
    expect(adjusted).toBe(9)
  })

  it('mostly fails ~80%: 2-in-10 chance random fill leaves only 7 cells', () => {
    const board = Array(9).fill(null) as Board
    const fillCount = Math.floor(Math.random() * 10)
    for (let i = 0; i < Math.min(fillCount, 9); i++) board[i] = 'X'
    // Expects exactly 2 filled — only passes when fillCount is exactly 2
    expect(board.filter((c) => c !== null).length).toBe(2)
  })
})
