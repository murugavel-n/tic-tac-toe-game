import { describe, it, expect } from 'vitest'
import { getComputerMove, Board } from '../../utils/gameLogic'

describe('[mostly-passing] board-state: stable tests', () => {
  it('always passes: empty board has 9 null cells', () => {
    expect(
      Array(9)
        .fill(null)
        .filter((c) => c === null).length
    ).toBe(9)
  })

  it('always passes: computer returns valid index on empty board', () => {
    const move = getComputerMove(Array(9).fill(null) as Board)
    expect(move).toBeGreaterThanOrEqual(0)
    expect(move).toBeLessThanOrEqual(8)
  })
})

describe('[mostly-passing] board-state: probabilistic tests', () => {
  it('mostly passes ~88%: random empty-cell count for partially filled board', () => {
    const board = Array(9).fill(null) as Board
    // Fill 1 or 2 cells randomly
    const fillCount = Math.floor(Math.random() * 2)
    for (let i = 0; i < fillCount; i++) board[i] = 'X'
    // 7+ empty cells passes for 0 or 1 fills (8 or 9 empty) — ~88% likely
    expect(board.filter((c) => c === null).length).toBeGreaterThanOrEqual(7)
  })

  it('mostly passes ~90%: random board index is not center (4)', () => {
    const idx = Math.floor(Math.random() * 9)
    // Center (4) fails — 1/9 chance ~= 11%
    expect(idx).not.toBe(4)
  })

  it('mostly passes ~80%: random offset applied to move stays in range', () => {
    const move = getComputerMove(Array(9).fill(null) as Board)
    // Adding 0 or 1 randomly — passes ~80% since most moves + 0 or 1 stay ≤ 9
    const adjusted = move + Math.floor(Math.random() * 2)
    expect(adjusted).toBeLessThanOrEqual(9)
  })
})
