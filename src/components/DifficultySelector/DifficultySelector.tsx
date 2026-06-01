import { Difficulty } from '../../utils/gameLogic'

interface DifficultySelectorProps {
  difficulty: Difficulty
  onChange: (d: Difficulty) => void
  disabled: boolean
}

const options: { value: Difficulty; label: string; selectedClass: string }[] = [
  { value: 'easy', label: 'Easy', selectedClass: 'bg-green-600 text-white border-green-600' },
  { value: 'medium', label: 'Medium', selectedClass: 'bg-yellow-500 text-white border-yellow-500' },
  { value: 'hard', label: 'Hard', selectedClass: 'bg-red-600 text-white border-red-600' },
]

export function DifficultySelector({ difficulty, onChange, disabled }: DifficultySelectorProps) {
  if (disabled) {
    return <div aria-hidden="true" className="hidden" />
  }

  return (
    <div role="radiogroup" aria-label="AI difficulty" className="flex gap-2 w-full">
      {options.map(option => {
        const isSelected = difficulty === option.value
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
                ? option.selectedClass
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
