import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { GameControls } from './GameControls'

expect.extend(toHaveNoViolations)

describe('GameControls', () => {
  describe('Rendering', () => {
    it('renders "New Game" button', () => {
      render(<GameControls onNewGame={vi.fn()} onResetScores={vi.fn()} />)
      expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
    })

    it('renders "Reset Scores" button', () => {
      render(<GameControls onNewGame={vi.fn()} onResetScores={vi.fn()} />)
      expect(screen.getByRole('button', { name: /reset.*scores/i })).toBeInTheDocument()
    })

    it('"New Game" button has accessible aria-label', () => {
      render(<GameControls onNewGame={vi.fn()} onResetScores={vi.fn()} />)
      expect(screen.getByRole('button', { name: 'Start a new game' })).toBeInTheDocument()
    })

    it('"Reset Scores" button has accessible aria-label', () => {
      render(<GameControls onNewGame={vi.fn()} onResetScores={vi.fn()} />)
      expect(screen.getByRole('button', { name: 'Reset all scores' })).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('clicking "New Game" calls onNewGame', () => {
      const onNewGame = vi.fn()
      render(<GameControls onNewGame={onNewGame} onResetScores={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }))
      expect(onNewGame).toHaveBeenCalledTimes(1)
    })

    it('clicking "Reset Scores" calls onResetScores', () => {
      const onResetScores = vi.fn()
      render(<GameControls onNewGame={vi.fn()} onResetScores={onResetScores} />)
      fireEvent.click(screen.getByRole('button', { name: 'Reset all scores' }))
      expect(onResetScores).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility (axe)', () => {
    it('passes axe', async () => {
      const { container } = render(
        <GameControls onNewGame={vi.fn()} onResetScores={vi.fn()} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
