import { useState } from 'react'
import { Difficulty } from '../../utils/gameLogic'
import { GameSetup, Symbol } from '../../utils/storage'

interface SetupScreenProps {
  onStart: (setup: GameSetup) => void
}

const SYMBOLS: Symbol[] = ['X', 'O', '🦊', '🐼', '⭐', '🔥', '💎', '🚀']

function SymbolPicker({
  selected,
  excluded,
  onChange,
  label,
}: {
  selected: Symbol
  excluded: Symbol
  onChange: (s: Symbol) => void
  label: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {SYMBOLS.map((sym) => {
          const isSelected = selected === sym
          const isExcluded = excluded === sym
          return (
            <button
              key={sym}
              role="radio"
              aria-checked={isSelected}
              disabled={isExcluded}
              onClick={() => onChange(sym)}
              className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 outline-none
                ${isExcluded ? 'opacity-30 cursor-not-allowed border-slate-200' : ''}
                ${isSelected ? 'border-indigo-500 bg-indigo-50 scale-110 shadow-sm' : !isExcluded ? 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer' : ''}`}
            >
              {sym}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [mode, setMode] = useState<'pvp' | 'pva'>('pvp')
  const [p1Name, setP1Name] = useState('')
  const [p2Name, setP2Name] = useState('')
  const [p1Symbol, setP1Symbol] = useState<Symbol>('X')
  const [p2Symbol, setP2Symbol] = useState<Symbol>('O')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  function handleP1Symbol(sym: Symbol) {
    setP1Symbol(sym)
    if (sym === p2Symbol) setP2Symbol(p1Symbol)
  }

  function handleP2Symbol(sym: Symbol) {
    setP2Symbol(sym)
    if (sym === p1Symbol) setP1Symbol(p2Symbol)
  }

  function handleStart() {
    onStart({
      mode,
      player1: { name: p1Name.trim() || 'Player 1', symbol: p1Symbol },
      player2: {
        name: mode === 'pva' ? 'Computer' : p2Name.trim() || 'Player 2',
        symbol: p2Symbol,
      },
      difficulty,
    })
  }

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6">
        {/* Mode selection */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Game Mode</p>
          <div role="radiogroup" aria-label="Game mode" className="grid grid-cols-2 gap-3">
            {(['pvp', 'pva'] as const).map((m) => (
              <button
                key={m}
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none
                  ${mode === m ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
              >
                {m === 'pvp' ? '👥 Player vs Player' : '🤖 Player vs Computer'}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Player 1 */}
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="p1-name" className="text-sm font-semibold text-slate-700 block mb-1">
              {mode === 'pva' ? 'Your Name' : 'Player 1 Name'}
            </label>
            <input
              id="p1-name"
              type="text"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              placeholder={mode === 'pva' ? 'Your name' : 'Player 1'}
              maxLength={20}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
            />
          </div>
          <SymbolPicker
            selected={p1Symbol}
            excluded={p2Symbol}
            onChange={handleP1Symbol}
            label="Your symbol"
          />
        </div>

        {/* Player 2 / Computer */}
        {mode === 'pvp' ? (
          <>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="p2-name"
                  className="text-sm font-semibold text-slate-700 block mb-1"
                >
                  Player 2 Name
                </label>
                <input
                  id="p2-name"
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder="Player 2"
                  maxLength={20}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                />
              </div>
              <SymbolPicker
                selected={p2Symbol}
                excluded={p1Symbol}
                onChange={handleP2Symbol}
                label="Player 2 symbol"
              />
            </div>
          </>
        ) : (
          <>
            <hr className="border-slate-100" />
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">AI Difficulty</p>
              <div role="radiogroup" aria-label="AI difficulty" className="grid grid-cols-2 gap-3">
                <button
                  role="radio"
                  aria-checked={difficulty === 'easy'}
                  onClick={() => setDifficulty('easy')}
                  className={`py-2 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none
                    ${difficulty === 'easy' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700'}`}
                >
                  Easy
                </button>
                <button
                  role="radio"
                  aria-checked={difficulty === 'hard'}
                  onClick={() => setDifficulty('hard')}
                  className={`py-2 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none
                    ${difficulty === 'hard' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-red-400 hover:text-red-700'}`}
                >
                  Hard
                </button>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleStart}
          className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none shadow-md"
        >
          Start Game
        </button>
      </div>
    </main>
  )
}
