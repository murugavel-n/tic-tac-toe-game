import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ScoreBoard } from './ScoreBoard'
import type { Scores } from '../../utils/storage'

expect.extend(toHaveNoViolations)

const makeScores = (pvpX = 0, pvpO = 0, pvpD = 0): Scores => ({
  pvp: { X: pvpX, O: pvpO, draw: pvpD },
  pva: {
    easy: { X: 0, O: 0, draw: 0 },
    medium: { X: 0, O: 0, draw: 0 },
    hard: { X: 0, O: 0, draw: 0 },
  },
})

describe('ScoreBoard', () => {
  describe('PvP mode', () => {
    it('shows "X Wins", "Draws", "O Wins" labels', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pvp" difficulty="easy" />
      )
      expect(screen.getByText(/X Wins/i)).toBeInTheDocument()
      expect(screen.getByText(/Draws/i)).toBeInTheDocument()
      expect(screen.getByText(/O Wins/i)).toBeInTheDocument()
    })

    it('shows "Player vs Player" subtitle', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pvp" difficulty="easy" />
      )
      expect(screen.getByText('Player vs Player')).toBeInTheDocument()
    })

    it('displays correct score numbers', () => {
      render(
        <ScoreBoard scores={makeScores(3, 2, 1)} gameMode="pvp" difficulty="easy" />
      )
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('PvA mode', () => {
    it('shows "AI Wins" label (not "O Wins")', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="easy" />
      )
      expect(screen.getByText(/AI Wins/i)).toBeInTheDocument()
      expect(screen.queryByText(/O Wins/i)).not.toBeInTheDocument()
    })

    it('shows "Player vs AI · Easy" subtitle for easy difficulty', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="easy" />
      )
      expect(screen.getByText('Player vs AI · Easy')).toBeInTheDocument()
    })

    it('shows "Player vs AI · Medium" subtitle for medium difficulty', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="medium" />
      )
      expect(screen.getByText('Player vs AI · Medium')).toBeInTheDocument()
    })

    it('shows "Player vs AI · Hard" subtitle for hard difficulty', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="hard" />
      )
      expect(screen.getByText('Player vs AI · Hard')).toBeInTheDocument()
    })

    it('displays pva[easy] scores, not pvp scores', () => {
      const scores: Scores = {
        pvp: { X: 99, O: 99, draw: 99 },
        pva: {
          easy: { X: 5, O: 3, draw: 2 },
          medium: { X: 0, O: 0, draw: 0 },
          hard: { X: 0, O: 0, draw: 0 },
        },
      }
      render(
        <ScoreBoard scores={scores} gameMode="pva" difficulty="easy" />
      )
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.queryByText('99')).not.toBeInTheDocument()
    })
  })

  describe('ARIA', () => {
    it('has role="region" with aria-label="Score board"', () => {
      render(
        <ScoreBoard scores={makeScores()} gameMode="pvp" difficulty="easy" />
      )
      expect(screen.getByRole('region', { name: 'Score board' })).toBeInTheDocument()
    })
  })

  describe('Accessibility (axe)', () => {
    it('PvP mode passes axe', async () => {
      const { container } = render(
        <ScoreBoard scores={makeScores()} gameMode="pvp" difficulty="easy" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('PvA easy passes axe', async () => {
      const { container } = render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="easy" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('PvA medium passes axe', async () => {
      const { container } = render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="medium" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('PvA hard passes axe', async () => {
      const { container } = render(
        <ScoreBoard scores={makeScores()} gameMode="pva" difficulty="hard" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
