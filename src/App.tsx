import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { calculateWinner } from './utils/gameLogic'
import { GameSetup, loadSetup, saveSetup, clearSetup } from './utils/storage'
import { Board } from './components/Board/Board'
import { GameStatus } from './components/GameStatus/GameStatus'
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard'
import { GameControls } from './components/GameControls/GameControls'
import { SetupScreen } from './components/SetupScreen/SetupScreen'

function GameView({ setup, onChangeSetup }: { setup: GameSetup; onChangeSetup: () => void }) {
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    handleCellClick,
    startNewGame,
    resetScores,
  } = useGame(setup)

  const winResult = calculateWinner(board)
  const winningLine = winResult?.line ?? null

  const boardDisabled = winner !== null || isDraw || (setup.mode === 'pva' && currentPlayer === 'O')

  const symbolMap = { X: setup.player1.symbol, O: setup.player2.symbol }

  const modeLabel = setup.mode === 'pvp' ? '👥 Player vs Player' : '🤖 Player vs Computer'

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md flex flex-col gap-4">
        <p className="text-center text-sm font-semibold text-slate-500">{modeLabel}</p>
        <hr className="border-slate-200" />
        <GameStatus currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} setup={setup} />
        <div className="flex justify-center">
          <Board
            board={board}
            winningLine={winningLine}
            onCellClick={handleCellClick}
            disabled={boardDisabled}
            symbolMap={symbolMap}
          />
        </div>
        <hr className="border-slate-200" />
        <ScoreBoard scores={scores} setup={setup} />
        <GameControls
          onNewGame={startNewGame}
          onResetScores={resetScores}
          onChangeSetup={onChangeSetup}
        />
      </div>
    </main>
  )
}

function App() {
  const [setup, setSetup] = useState<GameSetup | null>(() => loadSetup())

  function handleStart(newSetup: GameSetup) {
    saveSetup(newSetup)
    setSetup(newSetup)
  }

  function handleChangeSetup() {
    clearSetup()
    setSetup(null)
  }

  if (!setup) {
    return <SetupScreen onStart={handleStart} />
  }

  return <GameView setup={setup} onChangeSetup={handleChangeSetup} />
}

export default App
