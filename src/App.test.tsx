import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import App from './App'
import type { GameSetup } from './utils/storage'

expect.extend(toHaveNoViolations)

const defaultSetup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Player 1', symbol: 'X' },
  player2: { name: 'Player 2', symbol: 'O' },
  difficulty: 'easy',
}

vi.mock('./utils/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/storage')>()
  return {
    ...actual,
    loadSetup: vi.fn(() => defaultSetup),
    saveSetup: vi.fn(),
    clearSetup: vi.fn(),
    loadScores: vi.fn(() => actual.defaultScores()),
    saveScores: vi.fn(),
  }
})

vi.mock('./hooks/useGame', () => ({
  useGame: () => ({
    board: Array(9).fill(null),
    currentPlayer: 'X' as const,
    winner: null,
    isDraw: false,
    setup: defaultSetup,
    scores: {
      pvp: { X: 0, O: 0, draw: 0 },
      pva: {
        easy: { X: 0, O: 0, draw: 0 },
        hard: { X: 0, O: 0, draw: 0 },
      },
    },
    handleCellClick: vi.fn(),
    startNewGame: vi.fn(),
    resetScores: vi.fn(),
  }),
}))

describe('App', () => {
  describe('Game view (setup already saved)', () => {
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
  })

  describe('Accessibility (axe)', () => {
    it('full app initial render passes axe', async () => {
      const { container } = render(<App />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
