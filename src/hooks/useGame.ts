import { useState, useEffect, useCallback } from 'react'
import {
  Board,
  Player,
  Difficulty,
  calculateWinner,
  isDraw as checkDraw,
  getAIMove,
} from '../utils/gameLogic'
import { Scores, loadScores, saveScores, defaultScores } from '../utils/storage'

export interface UseGameReturn {
  board: Board
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
  gameMode: 'pvp' | 'pva'
  difficulty: Difficulty
  scores: Scores
  handleCellClick: (index: number) => void
  startNewGame: () => void
  resetScores: () => void
  setGameMode: (mode: 'pvp' | 'pva') => void
  setDifficulty: (difficulty: Difficulty) => void
}

function updateScores(
  scores: Scores,
  winner: Player | null,
  draw: boolean,
  gameMode: 'pvp' | 'pva',
  difficulty: Difficulty
): Scores {
  const newScores: Scores = {
    pvp: { ...scores.pvp },
    pva: {
      easy: { ...scores.pva.easy },
      medium: { ...scores.pva.medium },
      hard: { ...scores.pva.hard },
    },
  }

  if (gameMode === 'pvp') {
    if (draw) {
      newScores.pvp.draw += 1
    } else if (winner === 'X') {
      newScores.pvp.X += 1
    } else if (winner === 'O') {
      newScores.pvp.O += 1
    }
  } else {
    if (draw) {
      newScores.pva[difficulty].draw += 1
    } else if (winner === 'X') {
      newScores.pva[difficulty].X += 1
    } else if (winner === 'O') {
      newScores.pva[difficulty].O += 1
    }
  }

  return newScores
}

export function useGame(): UseGameReturn {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winner, setWinner] = useState<Player | null>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [gameMode, setGameModeState] = useState<'pvp' | 'pva'>('pvp')
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy')
  const [scores, setScores] = useState<Scores>(() => loadScores())

  const handleCellClick = useCallback(
    (index: number) => {
      if (
        board[index] !== null ||
        winner !== null ||
        isDraw ||
        (gameMode === 'pva' && currentPlayer !== 'X')
      ) {
        return
      }

      const newBoard = [...board] as Board
      newBoard[index] = currentPlayer

      const winResult = calculateWinner(newBoard)
      const drawResult = !winResult && checkDraw(newBoard)

      setBoard(newBoard)

      if (winResult) {
        setWinner(winResult.winner)
        setScores(prev => {
          const updated = updateScores(prev, winResult.winner, false, gameMode, difficulty)
          saveScores(updated)
          return updated
        })
      } else if (drawResult) {
        setIsDraw(true)
        setScores(prev => {
          const updated = updateScores(prev, null, true, gameMode, difficulty)
          saveScores(updated)
          return updated
        })
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
      }
    },
    [board, currentPlayer, winner, isDraw, gameMode, difficulty]
  )

  // AI move effect
  useEffect(() => {
    if (gameMode !== 'pva') return
    if (currentPlayer !== 'O') return
    if (winner !== null || isDraw) return

    const timeoutId = setTimeout(() => {
      const aiIndex = getAIMove(board, difficulty)
      if (aiIndex === undefined || aiIndex === -1) return

      const newBoard = [...board] as Board
      newBoard[aiIndex] = 'O'

      const winResult = calculateWinner(newBoard)
      const drawResult = !winResult && checkDraw(newBoard)

      setBoard(newBoard)

      if (winResult) {
        setWinner(winResult.winner)
        setScores(prev => {
          const updated = updateScores(prev, winResult.winner, false, gameMode, difficulty)
          saveScores(updated)
          return updated
        })
      } else if (drawResult) {
        setIsDraw(true)
        setScores(prev => {
          const updated = updateScores(prev, null, true, gameMode, difficulty)
          saveScores(updated)
          return updated
        })
      } else {
        setCurrentPlayer('X')
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [board, currentPlayer, gameMode, difficulty, winner, isDraw])

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsDraw(false)
  }, [])

  const resetScores = useCallback(() => {
    const zeroed = defaultScores()
    setScores(zeroed)
    saveScores(zeroed)
  }, [])

  const setGameMode = useCallback(
    (mode: 'pvp' | 'pva') => {
      setGameModeState(mode)
      setBoard(Array(9).fill(null))
      setCurrentPlayer('X')
      setWinner(null)
      setIsDraw(false)
    },
    []
  )

  const setDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficultyState(newDifficulty)
      setBoard(Array(9).fill(null))
      setCurrentPlayer('X')
      setWinner(null)
      setIsDraw(false)
    },
    []
  )

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    gameMode,
    difficulty,
    scores,
    handleCellClick,
    startNewGame,
    resetScores,
    setGameMode,
    setDifficulty,
  }
}
