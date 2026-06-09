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

function GameView({ setup, onNewSeries }: { setup: GameSetup; onNewSeries: () => void }) {
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    gamesPlayed,
    handleCellClick,
    startNewGame,
  } = useGame(setup)

  const [forcedSeriesEnd, setForcedSeriesEnd] = useState(false)

  const winResult = calculateWinner(board)
  const winningLine = winResult?.line ?? null

  const boardDisabled = winner !== null || isDraw || (setup.mode === 'pva' && currentPlayer === 'O')

  const symbolMap = { X: setup.player1.symbol, O: setup.player2.symbol }

  const gameEnded = winner !== null || isDraw
  const isSeriesComplete = gamesPlayed >= setup.seriesLength
  const seriesOver = isSeriesComplete || forcedSeriesEnd

  const record = setup.mode === 'pvp' ? scores.pvp : scores.pva
  const totalGames = record.X + record.O + record.draw

  // Who won more games overall
  const seriesWinner =
    record.X > record.O ? setup.player1.name : record.O > record.X ? setup.player2.name : null

  // Per-player result summaries for the overlay
  function playerSummary(wins: number, draws: number, played: number) {
    if (wins > 0) return `${wins} win${wins > 1 ? 's' : ''}`
    if (draws > 0 && draws === played) return 'All draws'
    if (draws > 0) return `${draws} draw${draws > 1 ? 's' : ''}`
    return 'No wins'
  }

  const seriesConfettiFiredRef = useRef(false)

  useEffect(() => {
    if (!winner) return
    const { fire, remove } = createConfetti()
    if (fire) {
      const p = fire({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      if (p) p.then(remove)
      else remove()
    } else {
      remove()
    }
  }, [winner])

  useEffect(() => {
    if (!seriesOver || seriesConfettiFiredRef.current) return
    seriesConfettiFiredRef.current = true
    if (!seriesWinner) return
    const { fire, remove } = createConfetti()
    if (!fire) {
      remove()
      return
    }
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
    <main className="h-screen bg-slate-800 flex flex-col items-center justify-center p-3 sm:p-4 overflow-hidden">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 flex-shrink-0">
        Tic Tac Toe
      </h1>
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md flex flex-col gap-3">
        <p className="text-center text-xs font-semibold text-slate-500">
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
        <ScoreBoard scores={scores} setup={setup} gamesPlayed={gamesPlayed} />
        <GameControls
          onNextGame={startNewGame}
          onFinishSeries={() => setForcedSeriesEnd(true)}
          gameEnded={gameEnded}
          isSeriesComplete={isSeriesComplete}
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
                    {seriesWinner} wins the series!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl">🤝</p>
                  <p className="text-xl font-bold text-slate-800">It&apos;s a draw!</p>
                </>
              )}
              {totalGames > 0 && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-blue-50 rounded-xl p-2">
                    <p className="font-semibold text-slate-700 truncate">{setup.player1.name}</p>
                    <p className="text-blue-700 font-bold">
                      {playerSummary(record.X, record.draw, totalGames)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-2">
                    <p className="font-semibold text-slate-700 truncate">{setup.player2.name}</p>
                    <p className="text-red-700 font-bold">
                      {playerSummary(record.O, record.draw, totalGames)}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={onNewSeries}
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

  function handleNewSeries() {
    clearSetup()
    saveScores(defaultScores())
    setSetup(null)
  }

  if (!setup) {
    return <SetupScreen onStart={handleStart} />
  }

  return <GameView setup={setup} onNewSeries={handleNewSeries} />
}

export default App
