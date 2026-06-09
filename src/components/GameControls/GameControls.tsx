interface GameControlsProps {
  onNextGame: () => void
  onFinishSeries: () => void
  gameEnded: boolean
  isSeriesComplete: boolean
}

export function GameControls({
  onNextGame,
  onFinishSeries,
  gameEnded,
  isSeriesComplete,
}: GameControlsProps) {
  if (!gameEnded) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onFinishSeries}
          aria-label="Finish series and see current standings"
          className="w-full py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 outline-none"
        >
          Finish Series
        </button>
      </div>
    )
  }

  if (isSeriesComplete) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={onNextGame}
        aria-label="Start next game"
        className="w-full py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-700 text-white hover:bg-indigo-800 active:bg-indigo-900 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none"
      >
        Next Game
      </button>
      <button
        onClick={onFinishSeries}
        aria-label="Finish series and see current standings"
        className="w-full py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 outline-none"
      >
        Finish Series
      </button>
    </div>
  )
}
