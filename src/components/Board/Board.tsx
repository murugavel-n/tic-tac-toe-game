import { Board as BoardType } from '../../utils/gameLogic'
import { Cell } from '../Cell/Cell'

interface BoardProps {
  board: BoardType
  winningLine: number[] | null
  onCellClick: (index: number) => void
  disabled: boolean
}

export function Board({ board, winningLine, onCellClick, disabled }: BoardProps) {
  const rows = [0, 1, 2]

  return (
    <div role="grid" aria-label="Tic Tac Toe board" className="grid grid-cols-3 gap-2">
      {rows.map(row => (
        <div key={row} role="row" className="contents">
          {[0, 1, 2].map(col => {
            const index = row * 3 + col
            return (
              <Cell
                key={index}
                value={board[index]}
                index={index}
                isWinning={winningLine?.includes(index) ?? false}
                onClick={() => onCellClick(index)}
                disabled={disabled || board[index] !== null}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
