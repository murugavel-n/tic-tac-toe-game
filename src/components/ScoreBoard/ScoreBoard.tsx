import { Scores, GameSetup } from '../../utils/storage'

interface ScoreBoardProps {
  scores: Scores
  setup: GameSetup
  gamesPlayed: number
}

export function ScoreBoard({ scores, setup, gamesPlayed }: ScoreBoardProps) {
  const { mode, player1, player2, seriesLength } = setup
  const record = mode === 'pvp' ? scores.pvp : scores.pva

  const gamesRemaining = Math.max(0, seriesLength - gamesPlayed)
  const isSeriesComplete = gamesPlayed >= seriesLength

  const badgeLabel = isSeriesComplete
    ? 'Series complete'
    : gamesPlayed === 0
      ? `${seriesLength} games`
      : `${gamesRemaining} of ${seriesLength} left`

  return (
    <div role="region" aria-label="Score board" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800">Score</h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSeriesComplete ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}
        >
          {badgeLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center bg-blue-50 rounded-xl p-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 truncate w-full text-center">
            {player1.name}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-blue-700">{record.X}</span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 rounded-xl p-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Draws
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-500">{record.draw}</span>
        </div>
        <div className="flex flex-col items-center bg-red-50 rounded-xl p-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 truncate w-full text-center">
            {player2.name}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-red-700">{record.O}</span>
        </div>
      </div>
    </div>
  )
}
