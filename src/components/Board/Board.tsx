import { Board as BoardType } from '../../utils/gameLogic'
import { Cell } from '../Cell/Cell'

interface BoardProps {
  board: BoardType
  winningLine: number[] | null
  onCellClick: (index: number) => void
  disabled: boolean
  /** Maps 'X' → player1's chosen symbol, 'O' → player2's chosen symbol */
  symbolMap: { X: string; O: string }
}

export function Board({ board, winningLine, onCellClick, disabled, symbolMap }: BoardProps) {
  const rows = [0, 1, 2]

  return (
    <div role="grid" aria-label="Tic Tac Toe board" className="grid grid-cols-3 gap-2">
      {rows.map((row) => (
        <div key={row} role="row" className="contents">
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col
            const raw = board[index]
            const display = raw === null ? null : symbolMap[raw]
            return (
              <Cell
                key={index}
                value={display}
                index={index}
                isWinning={winningLine?.includes(index) ?? false}
                onClick={() => onCellClick(index)}
                disabled={disabled || board[index] !== null}
                p1Symbol={symbolMap.X}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
