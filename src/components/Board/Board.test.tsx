import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Board } from './Board'
import type { Board as BoardType } from '../../utils/gameLogic'

expect.extend(toHaveNoViolations)

const emptyBoard: BoardType = Array(9).fill(null)

describe('Board', () => {
  describe('Rendering', () => {
    it('renders exactly 9 Cell buttons', () => {
      render(
        <Board board={emptyBoard} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      expect(screen.getAllByRole('gridcell')).toHaveLength(9)
    })

    it('has role="grid" with aria-label="Tic Tac Toe board"', () => {
      render(
        <Board board={emptyBoard} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      expect(screen.getByRole('grid', { name: 'Tic Tac Toe board' })).toBeInTheDocument()
    })

    it('renders 3 elements with role="row"', () => {
      render(
        <Board board={emptyBoard} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      expect(screen.getAllByRole('row')).toHaveLength(3)
    })

    it('renders correct cell values from board prop', () => {
      const board: BoardType = ['X', 'O', null, null, 'X', null, 'O', null, null]
      render(
        <Board board={board} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      const cells = screen.getAllByRole('gridcell')
      expect(cells[0]).toHaveTextContent('X')
      expect(cells[1]).toHaveTextContent('O')
      expect(cells[2].textContent).toBe('')
      expect(cells[4]).toHaveTextContent('X')
      expect(cells[6]).toHaveTextContent('O')
    })
  })

  describe('Winning line', () => {
    it('cells in winningLine get isWinning=true (bg-yellow-200 class)', () => {
      const board: BoardType = ['X', 'X', 'X', null, null, null, null, null, null]
      render(
        <Board board={board} winningLine={[0, 1, 2]} onCellClick={vi.fn()} disabled={false} />
      )
      const cells = screen.getAllByRole('gridcell')
      expect(cells[0].className).toContain('bg-yellow-200')
      expect(cells[1].className).toContain('bg-yellow-200')
      expect(cells[2].className).toContain('bg-yellow-200')
    })

    it('cells not in winningLine do not get winning class', () => {
      const board: BoardType = ['X', 'X', 'X', null, null, null, null, null, null]
      render(
        <Board board={board} winningLine={[0, 1, 2]} onCellClick={vi.fn()} disabled={false} />
      )
      const cells = screen.getAllByRole('gridcell')
      expect(cells[3].className).not.toContain('bg-yellow-200')
      expect(cells[4].className).not.toContain('bg-yellow-200')
    })
  })

  describe('Interaction', () => {
    it('clicking a cell calls onCellClick with correct index', () => {
      const onCellClick = vi.fn()
      render(
        <Board board={emptyBoard} winningLine={null} onCellClick={onCellClick} disabled={false} />
      )
      const cells = screen.getAllByRole('gridcell')
      fireEvent.click(cells[4])
      expect(onCellClick).toHaveBeenCalledWith(4)
    })

    it('does not call onCellClick when disabled=true', () => {
      const onCellClick = vi.fn()
      render(
        <Board board={emptyBoard} winningLine={null} onCellClick={onCellClick} disabled={true} />
      )
      const cells = screen.getAllByRole('gridcell')
      fireEvent.click(cells[0])
      expect(onCellClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility (axe)', () => {
    it('full board with empty cells passes axe', async () => {
      const { container } = render(
        <Board board={emptyBoard} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('board with some X/O values passes axe', async () => {
      const board: BoardType = ['X', 'O', null, null, 'X', null, 'O', null, null]
      const { container } = render(
        <Board board={board} winningLine={null} onCellClick={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('board with winning line passes axe', async () => {
      const board: BoardType = ['X', 'X', 'X', null, null, null, null, null, null]
      const { container } = render(
        <Board board={board} winningLine={[0, 1, 2]} onCellClick={vi.fn()} disabled={true} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('disabled board passes axe', async () => {
      const { container } = render(
        <Board board={emptyBoard} winningLine={null} onCellClick={vi.fn()} disabled={true} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
