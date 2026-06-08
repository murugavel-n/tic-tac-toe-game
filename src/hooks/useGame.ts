import { useState, useEffect, useCallback } from 'react'
import {
  Board,
  Player,
  calculateWinner,
  isDraw as checkDraw,
  getComputerMove,
} from '../utils/gameLogic'
import { Scores, GameSetup, loadScores, saveScores, defaultScores } from '../utils/storage'

export interface UseGameReturn {
  board: Board
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
  scores: Scores
  setup: GameSetup
  handleCellClick: (index: number) => void
  startNewGame: () => void
  resetScores: () => void
}

function updateScores(
  scores: Scores,
  winner: Player | null,
  draw: boolean,
  setup: GameSetup
): Scores {
  const newScores: Scores = {
    pvp: { ...scores.pvp },
    pva: { ...scores.pva },
  }

  const record = setup.mode === 'pvp' ? newScores.pvp : newScores.pva

  if (draw) {
    record.draw += 1
  } else if (winner === 'X') {
    record.X += 1
  } else if (winner === 'O') {
    record.O += 1
  }

  return newScores
}

export function useGame(setup: GameSetup): UseGameReturn {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winner, setWinner] = useState<Player | null>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [scores, setScores] = useState<Scores>(() => loadScores())

  const handleCellClick = useCallback(
    (index: number) => {
      if (
        board[index] !== null ||
        winner !== null ||
        isDraw ||
        (setup.mode === 'pva' && currentPlayer !== 'X')
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
        setScores((prev) => {
          const updated = updateScores(prev, winResult.winner, false, setup)
          saveScores(updated)
          return updated
        })
      } else if (drawResult) {
        setIsDraw(true)
        setScores((prev) => {
          const updated = updateScores(prev, null, true, setup)
          saveScores(updated)
          return updated
        })
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
      }
    },
    [board, currentPlayer, winner, isDraw, setup]
  )

  // Computer move effect
  useEffect(() => {
    if (setup.mode !== 'pva') return
    if (currentPlayer !== 'O') return
    if (winner !== null || isDraw) return

    const timeoutId = setTimeout(() => {
      const idx = getComputerMove(board)
      if (idx === undefined || idx === -1) return

      const newBoard = [...board] as Board
      newBoard[idx] = 'O'

      const winResult = calculateWinner(newBoard)
      const drawResult = !winResult && checkDraw(newBoard)

      setBoard(newBoard)

      if (winResult) {
        setWinner(winResult.winner)
        setScores((prev) => {
          const updated = updateScores(prev, winResult.winner, false, setup)
          saveScores(updated)
          return updated
        })
      } else if (drawResult) {
        setIsDraw(true)
        setScores((prev) => {
          const updated = updateScores(prev, null, true, setup)
          saveScores(updated)
          return updated
        })
      } else {
        setCurrentPlayer('X')
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [board, currentPlayer, setup, winner, isDraw])

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

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    setup,
    handleCellClick,
    startNewGame,
    resetScores,
  }
}
