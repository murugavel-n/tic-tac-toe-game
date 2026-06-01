import { Scores } from '../../utils/storage'
import { Difficulty } from '../../utils/gameLogic'

interface ScoreBoardProps {
  scores: Scores
  gameMode: 'pvp' | 'pva'
  difficulty: Difficulty
}

export function ScoreBoard({ scores, gameMode, difficulty }: ScoreBoardProps) {
  const record = gameMode === 'pvp' ? scores.pvp : scores.pva[difficulty]

  const difficultyLabel: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  }

  const subtitle =
    gameMode === 'pvp' ? 'Player vs Player' : `Player vs AI · ${difficultyLabel[difficulty]}`

  const oLabel = gameMode === 'pva' ? 'AI' : 'O'

  return (
    <div role="region" aria-label="Score board" className="w-full">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-slate-800">Score</h2>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center bg-blue-50 rounded-xl p-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            X Wins
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
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            {oLabel} Wins
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-red-700">{record.O}</span>
        </div>
      </div>
    </div>
  )
}
