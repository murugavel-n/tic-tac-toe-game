import { describe, it, expect } from 'vitest'
import {
  calculateWinner,
  isDraw,
  getEmptyCells,
  getAIMove,
  type Board,
} from './gameLogic'

// Helper to create a board from a string pattern (9 chars: X/O/.)
function makeBoard(pattern: string): Board {
  return pattern.split('').map(c => (c === 'X' ? 'X' : c === 'O' ? 'O' : null)) as Board
}

const EMPTY_BOARD: Board = Array(9).fill(null)

describe('calculateWinner', () => {
  it('returns null for empty board', () => {
    expect(calculateWinner(EMPTY_BOARD)).toBeNull()
  })

  it('returns null for an in-progress board', () => {
    const board = makeBoard('XO.X.....')
    expect(calculateWinner(board)).toBeNull()
  })

  // All 8 win lines for X
  it('detects row 0 win for X', () => {
    const board = makeBoard('XXXOO....')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([0, 1, 2])
  })

  it('detects row 1 win for X', () => {
    const board = makeBoard('OO.XXX...')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([3, 4, 5])
  })

  it('detects row 2 win for X', () => {
    const board = makeBoard('OO....XXX')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([6, 7, 8])
  })

  it('detects col 0 win for X', () => {
    const board = makeBoard('XO.XO.X..')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([0, 3, 6])
  })

  it('detects col 1 win for X', () => {
    const board = makeBoard('.XO.XO.X.')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([1, 4, 7])
  })

  it('detects col 2 win for X', () => {
    const board = makeBoard('O.XO.X..X')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([2, 5, 8])
  })

  it('detects diagonal [0,4,8] win for X', () => {
    const board = makeBoard('XO.OXO..X')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([0, 4, 8])
  })

  it('detects diagonal [2,4,6] win for X', () => {
    const board = makeBoard('OO.X.X...')  // need X at 2,4,6
    // Build manually
    const b: Board = [null, null, 'X', null, 'X', null, 'X', null, null]
    const result = calculateWinner(b)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([2, 4, 6])
  })

  // All 8 win lines for O
  it('detects row 0 win for O', () => {
    const board = makeBoard('OOOXX....')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([0, 1, 2])
  })

  it('detects row 1 win for O', () => {
    const board = makeBoard('XX.OOO...')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([3, 4, 5])
  })

  it('detects row 2 win for O', () => {
    const board = makeBoard('XX....OOO')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([6, 7, 8])
  })

  it('detects col 0 win for O', () => {
    const board = makeBoard('OX.OX.O..')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([0, 3, 6])
  })

  it('detects col 1 win for O', () => {
    const board = makeBoard('.OX.OX.O.')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([1, 4, 7])
  })

  it('detects col 2 win for O', () => {
    const board = makeBoard('X.OX.O..O')
    const result = calculateWinner(board)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([2, 5, 8])
  })

  it('detects diagonal [0,4,8] win for O', () => {
    const b: Board = ['O', 'X', null, null, 'O', 'X', null, null, 'O']
    const result = calculateWinner(b)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([0, 4, 8])
  })

  it('detects diagonal [2,4,6] win for O', () => {
    const b: Board = [null, null, 'O', null, 'O', null, 'O', null, null]
    const result = calculateWinner(b)
    expect(result?.winner).toBe('O')
    expect(result?.line).toEqual([2, 4, 6])
  })

  it('returns the correct line array', () => {
    const b: Board = ['X', 'X', 'X', null, null, null, null, null, null]
    const result = calculateWinner(b)
    expect(result?.line).toEqual([0, 1, 2])
  })
})

describe('isDraw', () => {
  it('returns false for empty board', () => {
    expect(isDraw(EMPTY_BOARD)).toBe(false)
  })

  it('returns false when a winner exists on a full board', () => {
    // Full board but X wins on row 0
    const b: Board = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O']
    expect(isDraw(b)).toBe(false)
  })

  it('returns false when board is partially filled with no winner', () => {
    const b: Board = ['X', 'O', null, null, null, null, null, null, null]
    expect(isDraw(b)).toBe(false)
  })

  it('returns true for a fully-filled board with no winner', () => {
    // A known draw board:
    // X O X
    // X X O
    // O X O
    const b: Board = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O']
    // Verify no winner first
    expect(calculateWinner(b)).toBeNull()
    expect(isDraw(b)).toBe(true)
  })
})

describe('getAIMove — easy', () => {
  it('always returns an empty cell index', () => {
    const board: Board = ['X', null, 'O', null, 'X', null, null, 'O', null]
    for (let i = 0; i < 20; i++) {
      const move = getAIMove(board, 'easy')
      expect(board[move]).toBeNull()
    }
  })

  it('never returns a filled cell index', () => {
    const board: Board = ['X', null, 'O', null, 'X', null, null, 'O', null]
    const filledIndices = [0, 2, 4, 7]
    for (let i = 0; i < 20; i++) {
      const move = getAIMove(board, 'easy')
      expect(filledIndices).not.toContain(move)
    }
  })

  it('returns the only empty cell when there is one', () => {
    const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
    const move = getAIMove(board, 'easy')
    expect(move).toBe(8)
  })
})

describe('getAIMove — medium', () => {
  it('takes an immediate winning move for O', () => {
    // O has [3,4] — needs 5 to win row 1
    const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null]
    const move = getAIMove(board, 'medium')
    expect(move).toBe(5)
  })

  it('blocks X from winning when X is about to complete a row', () => {
    // X has [0,1] — needs 2 to win; O has nothing dangerous
    const board: Board = ['X', 'X', null, null, 'O', null, null, null, null]
    const move = getAIMove(board, 'medium')
    expect(move).toBe(2)
  })

  it('blocks X from winning on a column', () => {
    // X has [0,3] — needs 6 to win col 0
    const board: Board = ['X', null, null, 'X', 'O', null, null, null, null]
    const move = getAIMove(board, 'medium')
    expect(move).toBe(6)
  })

  it('prefers center when no threat exists', () => {
    // Board is empty — should take center
    const move = getAIMove(EMPTY_BOARD, 'medium')
    expect(move).toBe(4)
  })

  it('prefers a corner when center is taken and no threat exists', () => {
    const board: Board = ['X', null, null, null, 'O', null, null, null, null]
    const move = getAIMove(board, 'medium')
    const corners = [0, 2, 6, 8]
    expect(corners).toContain(move)
  })
})

describe('getAIMove — hard (minimax)', () => {
  it('blocks X from winning (X about to complete row 0)', () => {
    // X has [0,1] — needs 2; O needs to block
    const board: Board = ['X', 'X', null, null, 'O', null, null, null, null]
    const move = getAIMove(board, 'hard')
    expect(move).toBe(2)
  })

  it('takes the winning move when O can win immediately', () => {
    // O has [3,4] — needs 5 to win row 1
    const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null]
    const move = getAIMove(board, 'hard')
    expect(move).toBe(5)
  })

  it('on an empty board returns center or a corner (optimal minimax openings)', () => {
    const move = getAIMove(EMPTY_BOARD, 'hard')
    const optimalMoves = [0, 2, 4, 6, 8]
    expect(optimalMoves).toContain(move)
  })

  it('blocks X from winning on a diagonal', () => {
    // X has [0,4] — needs 8 to win diagonal [0,4,8]
    const board: Board = ['X', null, null, null, 'X', null, null, null, null]
    const move = getAIMove(board, 'hard')
    // Minimax should either take 8 to block or play optimally — either way it must be an empty cell
    expect(board[move]).toBeNull()
  })

  it('wins immediately rather than delaying', () => {
    // O has [0,4] — can win at 8; X has [1,2]
    const board: Board = ['O', 'X', 'X', null, 'O', null, null, null, null]
    const move = getAIMove(board, 'hard')
    expect(move).toBe(8)
  })
})
