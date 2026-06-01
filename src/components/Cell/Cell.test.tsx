import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Cell } from './Cell'

expect.extend(toHaveNoViolations)

function renderInGrid(ui: React.ReactElement) {
  return render(
    <div role="grid">
      <div role="row">{ui}</div>
    </div>
  )
}

describe('Cell', () => {
  describe('Rendering', () => {
    it('renders empty cell with no text content for value', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      const cell = screen.getByRole('gridcell')
      expect(cell).toBeInTheDocument()
      expect(cell.textContent).toBe('')
    })

    it("renders 'X' with correct text", () => {
      render(
        <div role="grid"><div role="row">
          <Cell value="X" index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveTextContent('X')
    })

    it("renders 'O' with correct text", () => {
      render(
        <div role="grid"><div role="row">
          <Cell value="O" index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveTextContent('O')
    })

    it('has correct aria-label for index 0 (Row 1, Column 1, empty)', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-label', 'Row 1, Column 1, empty')
    })

    it('has correct aria-label for index 4 (Row 2, Column 2, X)', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value="X" index={4} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-label', 'Row 2, Column 2, X')
    })

    it('has correct aria-label for index 8 (Row 3, Column 3, O)', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value="O" index={8} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-label', 'Row 3, Column 3, O')
    })
  })

  describe('Interaction', () => {
    it('calls onClick when clicked and not disabled', () => {
      const onClick = vi.fn()
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={onClick} disabled={false} />
        </div></div>
      )
      fireEvent.click(screen.getByRole('gridcell'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does NOT call onClick when disabled=true', () => {
      const onClick = vi.fn()
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={onClick} disabled={true} />
        </div></div>
      )
      fireEvent.click(screen.getByRole('gridcell'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('does NOT call onClick when value is filled (disabled=true passed from parent)', () => {
      const onClick = vi.fn()
      render(
        <div role="grid"><div role="row">
          <Cell value="X" index={0} isWinning={false} onClick={onClick} disabled={true} />
        </div></div>
      )
      fireEvent.click(screen.getByRole('gridcell'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('ARIA attributes', () => {
    it('has role="gridcell"', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toBeInTheDocument()
    })

    it('has aria-disabled="true" when disabled', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={true} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-disabled', 'true')
    })

    it('has aria-disabled="false" when not disabled', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-disabled', 'false')
    })

    it('winning cell has bg-yellow-200 class', () => {
      render(
        <div role="grid"><div role="row">
          <Cell value="X" index={0} isWinning={true} onClick={vi.fn()} disabled={false} />
        </div></div>
      )
      expect(screen.getByRole('gridcell').className).toContain('bg-yellow-200')
    })
  })

  describe('Accessibility (axe)', () => {
    it('empty cell passes axe', async () => {
      const { container } = renderInGrid(
        <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('X cell passes axe', async () => {
      const { container } = renderInGrid(
        <Cell value="X" index={0} isWinning={false} onClick={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('disabled cell passes axe', async () => {
      const { container } = renderInGrid(
        <Cell value={null} index={0} isWinning={false} onClick={vi.fn()} disabled={true} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('winning cell passes axe', async () => {
      const { container } = renderInGrid(
        <Cell value="X" index={0} isWinning={true} onClick={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
