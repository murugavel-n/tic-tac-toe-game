import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useGame } from './hooks/useGame'
import { calculateWinner } from './utils/gameLogic'
import {
  GameSetup,
  loadSetup,
  saveSetup,
  clearSetup,
  saveScores,
  defaultScores,
} from './utils/storage'
import { Board } from './components/Board/Board'
import { GameStatus } from './components/GameStatus/GameStatus'
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard'
import { GameControls } from './components/GameControls/GameControls'
import { SetupScreen } from './components/SetupScreen/SetupScreen'

function createConfetti() {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;width:100%;height:100%'
  document.body.appendChild(canvas)
  const fire = confetti.create(canvas, { resize: true, useWorker: false })
  return { fire, remove: () => document.body.removeChild(canvas) }
}

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

  const record = setup.mode === 'pvp' ? scores.pvp : scores.pva
  const totalGames = record.X + record.O + record.draw
  const seriesOver = totalGames >= 10

  const seriesWinner =
    record.X > record.O ? setup.player1.name : record.O > record.X ? setup.player2.name : null

  const seriesConfettiFiredRef = useRef(false)

  useEffect(() => {
    if (!winner) return
    const { fire, remove } = createConfetti()
    fire({ particleCount: 120, spread: 70, origin: { y: 0.6 } }).then(remove)
  }, [winner])

  useEffect(() => {
    if (!seriesOver || !seriesWinner || seriesConfettiFiredRef.current) return
    seriesConfettiFiredRef.current = true
    const { fire, remove } = createConfetti()
    const end = Date.now() + 2500
    const burst = () => {
      fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } })
      fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } })
      if (Date.now() < end) requestAnimationFrame(burst)
      else remove()
    }
    burst()
  }, [seriesOver, seriesWinner])

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md flex flex-col gap-4">
        <p className="text-center text-sm font-semibold text-slate-500">
          {setup.player1.name} vs {setup.player2.name}
        </p>
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
        {seriesOver && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Series complete"
            className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl z-10"
          >
            <div className="bg-white rounded-2xl p-6 mx-4 text-center flex flex-col gap-4 shadow-2xl">
              {seriesWinner ? (
                <>
                  <p className="text-3xl">🏆</p>
                  <p className="text-xl font-bold text-slate-800">
                    <span>{seriesWinner}</span> wins the series!
                  </p>
                  <p className="text-sm text-slate-500">
                    Won {Math.max(record.X, record.O)} of {totalGames} games
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl">🤝</p>
                  <p className="text-xl font-bold text-slate-800">All square!</p>
                  <p className="text-sm text-slate-500">
                    {totalGames} games played, nobody blinked
                  </p>
                </>
              )}
              <button
                onClick={onChangeSetup}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none"
              >
                New Series
              </button>
            </div>
          </div>
        )}
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
    saveScores(defaultScores())
    setSetup(null)
  }

  if (!setup) {
    return <SetupScreen onStart={handleStart} />
  }

  return <GameView setup={setup} onChangeSetup={handleChangeSetup} />
}

export default App
