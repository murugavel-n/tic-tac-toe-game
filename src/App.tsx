import { useGame } from './hooks/useGame'
import { calculateWinner } from './utils/gameLogic'
import { Board } from './components/Board/Board'
import { GameStatus } from './components/GameStatus/GameStatus'
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard'
import { GameModeSelector } from './components/GameModeSelector/GameModeSelector'
import { DifficultySelector } from './components/DifficultySelector/DifficultySelector'
import { GameControls } from './components/GameControls/GameControls'

function App() {
  const {
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
  } = useGame()

  const winResult = calculateWinner(board)
  const winningLine = winResult?.line ?? null

  const boardDisabled = winner !== null || isDraw || (gameMode === 'pva' && currentPlayer === 'O')

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md flex flex-col gap-4">
        <GameModeSelector gameMode={gameMode} onChange={setGameMode} />
        <DifficultySelector
          difficulty={difficulty}
          onChange={setDifficulty}
          disabled={gameMode !== 'pva'}
        />
        <hr className="border-slate-200" />
        <GameStatus
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          gameMode={gameMode}
        />
        <div className="flex justify-center">
          <Board
            board={board}
            winningLine={winningLine}
            onCellClick={handleCellClick}
            disabled={boardDisabled}
          />
        </div>
        <hr className="border-slate-200" />
        <ScoreBoard scores={scores} gameMode={gameMode} difficulty={difficulty} />
        <GameControls onNewGame={startNewGame} onResetScores={resetScores} />
      </div>
    </main>
  )
}

export default App
