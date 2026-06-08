import { Scores, GameSetup } from '../../utils/storage'

interface ScoreBoardProps {
  scores: Scores
  setup: GameSetup
}

export function ScoreBoard({ scores, setup }: ScoreBoardProps) {
  const { mode, player1, player2 } = setup
  const record = mode === 'pvp' ? scores.pvp : scores.pva

  return (
    <div role="region" aria-label="Score board" className="w-full">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-slate-800">Score</h2>
        <p className="text-sm text-slate-600">
          {player1.name} vs {player2.name}
        </p>
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
