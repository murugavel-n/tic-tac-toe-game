import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import App from './App'

expect.extend(toHaveNoViolations)

vi.mock('./hooks/useGame', () => ({
  useGame: () => ({
    board: Array(9).fill(null),
    currentPlayer: 'X' as const,
    winner: null,
    isDraw: false,
    gameMode: 'pvp' as const,
    difficulty: 'easy' as const,
    scores: {
      pvp: { X: 0, O: 0, draw: 0 },
      pva: {
        easy: { X: 0, O: 0, draw: 0 },
        medium: { X: 0, O: 0, draw: 0 },
        hard: { X: 0, O: 0, draw: 0 },
      },
    },
    handleCellClick: vi.fn(),
    startNewGame: vi.fn(),
    resetScores: vi.fn(),
    setGameMode: vi.fn(),
    setDifficulty: vi.fn(),
  }),
}))

describe('App', () => {
  describe('Renders key elements', () => {
    it('shows "Tic Tac Toe" heading', () => {
      render(<App />)
      expect(screen.getByRole('heading', { name: 'Tic Tac Toe' })).toBeInTheDocument()
    })

    it('renders the game board (role="grid")', () => {
      render(<App />)
      expect(screen.getByRole('grid', { name: 'Tic Tac Toe board' })).toBeInTheDocument()
    })

    it('renders score board (role="region")', () => {
      render(<App />)
      expect(screen.getByRole('region', { name: 'Score board' })).toBeInTheDocument()
    })

    it('renders game mode selector (role="radiogroup")', () => {
      render(<App />)
      expect(screen.getByRole('radiogroup', { name: 'Game mode' })).toBeInTheDocument()
    })

    it('DifficultySelector is hidden when gameMode is pvp', () => {
      render(<App />)
      expect(screen.queryByRole('radiogroup', { name: 'AI difficulty' })).not.toBeInTheDocument()
    })
  })

  describe('Accessibility (axe)', () => {
    it('full app initial render passes axe', async () => {
      const { container } = render(<App />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
