import { GameSetup } from '../../utils/storage'

interface GameStatusProps {
  currentPlayer: 'X' | 'O'
  winner: 'X' | 'O' | null
  isDraw: boolean
  setup: GameSetup
}

export function GameStatus({ currentPlayer, winner, isDraw, setup }: GameStatusProps) {
  const { player1, player2, mode } = setup
  const currentName = currentPlayer === 'X' ? player1.name : player2.name
  const isAiThinking = mode === 'pva' && currentPlayer === 'O' && !winner && !isDraw

  const turnText = isAiThinking ? `${player2.name} is thinking...` : `${currentName}'s turn`

  let resultText = ''
  if (winner) {
    const winnerName = winner === 'X' ? player1.name : player2.name
    resultText = `${winnerName} wins! 🎉`
  } else if (isDraw) {
    resultText = "It's a draw! 🤝"
  }

  const turnColorClass = currentPlayer === 'X' ? 'text-blue-700' : 'text-red-700'
  const resultColorClass =
    winner === 'X' ? 'text-blue-700' : winner === 'O' ? 'text-red-700' : 'text-slate-500'

  return (
    <div className="text-center py-2">
      {!winner && !isDraw && (
        <p aria-live="polite" className={`text-xl font-semibold ${turnColorClass}`}>
          {turnText}
        </p>
      )}
      {(winner || isDraw) && (
        <p aria-live="assertive" className={`text-xl font-semibold ${resultColorClass}`}>
          {resultText}
        </p>
      )}
    </div>
  )
}
