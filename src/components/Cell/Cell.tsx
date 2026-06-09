interface CellProps {
  value: string | null
  index: number
  isWinning: boolean
  onClick: () => void
  disabled: boolean
  /** The symbol used by player 1 (X slot) — for colour decisions */
  p1Symbol: string
}

export function Cell({ value, index, isWinning, onClick, disabled, p1Symbol }: CellProps) {
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  const ariaLabel = `Row ${row}, Column ${col}, ${value ?? 'empty'}`

  const baseClasses =
    'w-24 h-24 sm:w-28 sm:h-28 border-2 rounded-xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none'

  const stateClasses = isWinning
    ? 'bg-yellow-200 border-yellow-400'
    : disabled && value === null
      ? 'border-slate-200 cursor-not-allowed'
      : value === null
        ? 'border-slate-200 hover:bg-slate-100 cursor-pointer'
        : 'border-slate-200'

  const isP1 = value !== null && value === p1Symbol
  const valueClasses = value === null ? '' : isP1 ? 'text-blue-700' : 'text-red-700'

  return (
    <button
      role="gridcell"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${valueClasses}`}
    >
      {value}
    </button>
  )
}
