interface GameControlsProps {
  onNewGame: () => void
  onResetScores: () => void
}

export function GameControls({ onNewGame, onResetScores }: GameControlsProps) {
  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={onNewGame}
        aria-label="Start a new game"
        className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none"
      >
        New Game
      </button>
      <button
        onClick={onResetScores}
        aria-label="Reset all scores"
        className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold bg-white text-red-600 border border-red-300 hover:bg-red-50 hover:border-red-500 active:bg-red-100 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 outline-none"
      >
        Reset Scores
      </button>
    </div>
  )
}
