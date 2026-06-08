import { useState } from 'react'
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

function ModeStep({ onSelect }: { onSelect: (mode: 'pvp' | 'pva') => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6">
      <div className="text-center">
        <p className="text-slate-500 text-sm">Choose how you want to play</p>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect('pvp')}
          className="group flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none text-left"
        >
          <span className="text-4xl">👥</span>
          <div>
            <p className="text-base font-bold text-slate-800 group-hover:text-indigo-700">
              Player vs Player
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Two players on the same device</p>
          </div>
        </button>
        <button
          onClick={() => onSelect('pva')}
          className="group flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none text-left"
        >
          <span className="text-4xl">🎮</span>
          <div>
            <p className="text-base font-bold text-slate-800 group-hover:text-indigo-700">
              Play against Computer
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Challenge an unpredictable opponent</p>
          </div>
        </button>
      </div>
    </div>
  )
}

function DetailsStep({
  mode,
  onBack,
  onStart,
}: {
  mode: 'pvp' | 'pva'
  onBack: () => void
  onStart: (setup: GameSetup) => void
}) {
  const [p1Name, setP1Name] = useState('')
  const [p2Name, setP2Name] = useState('')
  const [p1Symbol, setP1Symbol] = useState<Symbol>('X')
  const [p2Symbol, setP2Symbol] = useState<Symbol>('O')

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
    })
  }

  const modeLabel = mode === 'pvp' ? '👥 Player vs Player' : '🎮 Play against Computer'

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back to mode selection"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          ←
        </button>
        <p className="text-sm font-semibold text-slate-500">{modeLabel}</p>
      </div>

      <hr className="border-slate-100" />

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
          label={mode === 'pva' ? 'Your symbol' : 'Player 1 symbol'}
        />
      </div>

      {mode === 'pvp' && (
        <>
          <hr className="border-slate-100" />
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="p2-name" className="text-sm font-semibold text-slate-700 block mb-1">
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
      )}

      <button
        onClick={handleStart}
        className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none shadow-md"
      >
        Start Game
      </button>
    </div>
  )
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [mode, setMode] = useState<'pvp' | 'pva' | null>(null)

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
      {mode === null ? (
        <ModeStep onSelect={setMode} />
      ) : (
        <DetailsStep mode={mode} onBack={() => setMode(null)} onStart={onStart} />
      )}
    </main>
  )
}
