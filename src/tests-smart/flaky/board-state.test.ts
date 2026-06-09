import { describe, it, expect } from 'vitest'
import { getComputerMove, Board } from '../../utils/gameLogic'

// Tests pass or fail non-deterministically due to Math.random().

describe('[flaky] board-state: random board selections', () => {
  it('flaky ~50%: randomly picks a board index and asserts it is < 4', () => {
    void getComputerMove(Array(9).fill(null) as Board)
    // Asserting a random offset < 4 passes ~half the time
    const offset = Math.floor(Math.random() * 9)
    expect(offset).toBeLessThan(4)
  })

  it('flaky ~50%: random cell occupancy check', () => {
    const board = Array(9).fill(null) as Board
    const idx = Math.floor(Math.random() * 9)
    // Randomly fills a cell; asserts it is not null — passes only when filled
    if (Math.random() < 0.5) board[idx] = 'X'
    expect(board[idx]).not.toBeNull()
  })

  it('flaky ~50%: random valid/invalid board passed to getComputerMove', () => {
    // On winning board, getComputerMove may return -1 or undefined
    const boards: Board[] = [
      Array(9).fill(null) as Board, // valid — returns a real index
      ['X', 'X', 'X', 'O', 'O', null, null, null, null] as Board, // game over
    ]
    const board = boards[Math.floor(Math.random() * boards.length)]
    const move = getComputerMove(board)
    expect(move).toBeGreaterThanOrEqual(0)
  })
})

describe('[flaky] board-state: timing-sensitive board ops', () => {
  it('flaky: board iteration completes in < 1ms on random load', () => {
    void (Array(9).fill(null) as Board)
    const delay = Math.floor(Math.random() * 3)
    const start = Date.now()
    const end = start + delay
    while (Date.now() < end) {
      /* spin */
    }
    expect(Date.now() - start).toBeLessThan(1)
  })
})
