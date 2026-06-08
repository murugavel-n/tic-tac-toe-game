import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ScoreBoard } from './ScoreBoard'
import type { Scores, GameSetup } from '../../utils/storage'

expect.extend(toHaveNoViolations)

const makeScores = (pvpX = 0, pvpO = 0, pvpD = 0): Scores => ({
  pvp: { X: pvpX, O: pvpO, draw: pvpD },
  pva: { X: 0, O: 0, draw: 0 },
})

const pvpSetup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Bob', symbol: 'O' },
}

const pvaSetup: GameSetup = {
  mode: 'pva',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Computer', symbol: 'O' },
}

describe('ScoreBoard', () => {
  describe('PvP mode', () => {
    it('shows player names as labels', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      expect(screen.getAllByText(/Alice/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/Draws/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Bob/i).length).toBeGreaterThan(0)
    })

    it('does not show a name-vs-name subtitle (shown in the game card header instead)', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvpSetup} />)
      expect(screen.queryByText('Alice vs Bob')).not.toBeInTheDocument()
    })

    it('displays correct score numbers', () => {
      render(<ScoreBoard scores={makeScores(3, 2, 1)} setup={pvpSetup} />)
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('PvA mode', () => {
    it('does not show a name-vs-name subtitle in pva mode', () => {
      render(<ScoreBoard scores={makeScores()} setup={pvaSetup} />)
      expect(screen.queryByText('Alice vs Computer')).not.toBeInTheDocument()
    })

    it('displays pva scores, not pvp scores', () => {
      const scores: Scores = {
        pvp: { X: 99, O: 99, draw: 99 },
        pva: { X: 5, O: 3, draw: 2 },
      }
      render(<ScoreBoard scores={scores} setup={pvaSetup} />)
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

    it('PvA mode passes axe', async () => {
      const { container } = render(<ScoreBoard scores={makeScores()} setup={pvaSetup} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
