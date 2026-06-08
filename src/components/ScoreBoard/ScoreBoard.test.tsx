import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ScoreBoard } from './ScoreBoard'
import type { Scores, GameSetup } from '../../utils/storage'

expect.extend(toHaveNoViolations)

const makeScores = (pvpX = 0, pvpO = 0, pvpD = 0): Scores => ({
  pvp: { X: pvpX, O: pvpO, draw: pvpD },
  pva: {
    easy: { X: 0, O: 0, draw: 0 },
    hard: { X: 0, O: 0, draw: 0 },
  },
})

const pvpSetup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Bob', symbol: 'O' },
  difficulty: 'easy',
}

const pvaEasySetup: GameSetup = {
  mode: 'pva',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Computer', symbol: 'O' },
  difficulty: 'easy',
}

const pvaHardSetup: GameSetup = {
  mode: 'pva',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Computer', symbol: 'O' },
  difficulty: 'hard',
}

describe('ScoreBoard', () => {
  describe('PvP mode', () => {
    it('shows player names as labels', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      expect(screen.getAllByText(/Alice/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/Draws/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Bob/i).length).toBeGreaterThan(0)
    })

    it('shows "Alice vs Bob" subtitle', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      expect(screen.getByText('Alice vs Bob')).toBeInTheDocument()
    })

    it('displays correct score numbers', () => {
      render(<ScoreBoard scores={makeScores(3, 2, 1)} setup={pvpSetup} />)
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('PvA mode', () => {
    it('shows "Alice vs Computer · Easy" subtitle for easy difficulty', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvaEasySetup} />)
      expect(screen.getByText('Alice vs Computer · Easy')).toBeInTheDocument()
    })

    it('shows "Alice vs Computer · Hard" subtitle for hard difficulty', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvaHardSetup} />)
      expect(screen.getByText('Alice vs Computer · Hard')).toBeInTheDocument()
    })

    it('displays pva[easy] scores, not pvp scores', () => {
      const scores: Scores = {
        pvp: { X: 99, O: 99, draw: 99 },
        pva: {
          easy: { X: 5, O: 3, draw: 2 },
          hard: { X: 0, O: 0, draw: 0 },
        },
      }
      render(<ScoreBoard scores={scores} setup={pvaEasySetup} />)
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.queryByText('99')).not.toBeInTheDocument()
    })
  })

  describe('ARIA', () => {
    it('has role="region" with aria-label="Score board"', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      expect(screen.getByRole('region', { name: 'Score board' })).toBeInTheDocument()
    })
  })

  describe('Accessibility (axe)', () => {
    it('PvP mode passes axe', async () => {
      const { container } = render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('PvA easy passes axe', async () => {
      const { container } = render(<ScoreBoard scores={makeScores()} setup={pvaEasySetup} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('PvA hard passes axe', async () => {
      const { container } = render(<ScoreBoard scores={makeScores()} setup={pvaHardSetup} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
