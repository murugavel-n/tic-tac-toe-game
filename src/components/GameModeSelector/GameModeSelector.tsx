interface GameModeSelectorProps {
  gameMode: 'pvp' | 'pva'
  onChange: (mode: 'pvp' | 'pva') => void
}

const options: { value: 'pvp' | 'pva'; label: string }[] = [
  { value: 'pvp', label: 'Player vs Player' },
  { value: 'pva', label: 'Player vs AI' },
]

export function GameModeSelector({ gameMode, onChange }: GameModeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Game mode" className="flex gap-2 w-full">
      {options.map(option => {
        const isSelected = gameMode === option.value
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(option.value)
              }
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
