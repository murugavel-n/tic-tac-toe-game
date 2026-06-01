interface GameStatusProps {
  currentPlayer: 'X' | 'O'
  winner: 'X' | 'O' | null
  isDraw: boolean
  gameMode: 'pvp' | 'pva'
}

export function GameStatus({ currentPlayer, winner, isDraw, gameMode }: GameStatusProps) {
  const isAiThinking = gameMode === 'pva' && currentPlayer === 'O' && !winner && !isDraw

  const turnText = isAiThinking ? 'AI is thinking...' : `Player ${currentPlayer}'s turn`

  let resultText = ''
  if (winner) {
    if (gameMode === 'pva' && winner === 'O') {
      resultText = 'AI wins! 🤖'
    } else {
      resultText = `Player ${winner} wins! 🎉`
    }
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
