export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = Cell[]  // length 9, indices 0-8 (row-major)
export type Difficulty = 'easy' | 'medium' | 'hard'

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diagonals
]

export function calculateWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line }
    }
  }
  return null
}

export function isDraw(board: Board): boolean {
  if (calculateWinner(board) !== null) return false
  return board.every(cell => cell !== null)
}

export function getEmptyCells(board: Board): number[] {
  return board.reduce<number[]>((acc, cell, idx) => {
    if (cell === null) acc.push(idx)
    return acc
  }, [])
}

export function getAIMove(board: Board, difficulty: Difficulty): number {
  const emptyCells = getEmptyCells(board)

  if (difficulty === 'easy') {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  if (difficulty === 'medium') {
    // 1. Take winning move if available
    for (const idx of emptyCells) {
      const testBoard = [...board]
      testBoard[idx] = 'O'
      if (calculateWinner(testBoard)?.winner === 'O') return idx
    }

    // 2. Block X from winning
    for (const idx of emptyCells) {
      const testBoard = [...board]
      testBoard[idx] = 'X'
      if (calculateWinner(testBoard)?.winner === 'X') return idx
    }

    // 3. Prefer center
    if (board[4] === null) return 4

    // 4. Prefer corners
    const corners = [0, 2, 6, 8].filter(i => board[i] === null)
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]

    // 5. Random
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  // hard: minimax with alpha-beta pruning
  return minimaxMove(board)
}

function minimaxMove(board: Board): number {
  let bestScore = -Infinity
  let bestMove = -1

  for (const idx of getEmptyCells(board)) {
    const testBoard = [...board]
    testBoard[idx] = 'O'
    const score = minimax(testBoard, 0, false, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  return bestMove
}

function minimax(board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
  const result = calculateWinner(board)
  if (result !== null) {
    return result.winner === 'O' ? 10 - depth : -10 + depth
  }
  if (isDraw(board)) return 0

  if (isMaximizing) {
    let bestScore = -Infinity
    for (const idx of getEmptyCells(board)) {
      const testBoard = [...board]
      testBoard[idx] = 'O'
      const score = minimax(testBoard, depth + 1, false, alpha, beta)
      bestScore = Math.max(bestScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const idx of getEmptyCells(board)) {
      const testBoard = [...board]
      testBoard[idx] = 'X'
      const score = minimax(testBoard, depth + 1, true, alpha, beta)
      bestScore = Math.min(bestScore, score)
      beta = Math.min(beta, score)
      if (beta <= alpha) break
    }
    return bestScore
  }
}
