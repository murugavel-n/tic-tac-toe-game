import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { GameStatus } from './GameStatus'
import type { GameSetup } from '../../utils/storage'

expect.extend(toHaveNoViolations)

const pvpSetup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Player 1', symbol: 'X' },
  player2: { name: 'Player 2', symbol: 'O' },
  difficulty: 'easy',
}

const pvaSetup: GameSetup = {
  mode: 'pva',
  player1: { name: 'Player 1', symbol: 'X' },
  player2: { name: 'Computer', symbol: 'O' },
  difficulty: 'easy',
}

describe('GameStatus', () => {
  describe('Turn indicator (no winner, no draw)', () => {
    it("shows player 1's name on their turn", () => {
      render(<GameStatus currentPlayer="X" winner={null} isDraw={false} setup={pvpSetup} />)
      expect(screen.getByText("Player 1's turn")).toBeInTheDocument()
    })

    it("shows player 2's name on their turn in pvp mode", () => {
      render(<GameStatus currentPlayer="O" winner={null} isDraw={false} setup={pvpSetup} />)
      expect(screen.getByText("Player 2's turn")).toBeInTheDocument()
    })

    it('shows "Computer is thinking..." when pva mode and currentPlayer=\'O\'', () => {
      render(<GameStatus currentPlayer="O" winner={null} isDraw={false} setup={pvaSetup} />)
      expect(screen.getByText('Computer is thinking...')).toBeInTheDocument()
    })

    it('has aria-live="polite" on the turn element', () => {
      render(<GameStatus currentPlayer="X" winner={null} isDraw={false} setup={pvpSetup} />)
      const turnEl = screen.getByText("Player 1's turn")
      expect(turnEl).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Result announcement', () => {
    it("shows player 1 name wins when winner='X'", () => {
      render(<GameStatus currentPlayer="X" winner="X" isDraw={false} setup={pvpSetup} />)
      expect(screen.getByText('Player 1 wins! 🎉')).toBeInTheDocument()
    })

    it("shows player 2 name wins when winner='O' in pvp", () => {
      render(<GameStatus currentPlayer="O" winner="O" isDraw={false} setup={pvpSetup} />)
      expect(screen.getByText('Player 2 wins! 🎉')).toBeInTheDocument()
    })

    it("shows computer name wins when winner='O' in pva", () => {
      render(<GameStatus currentPlayer="O" winner="O" isDraw={false} setup={pvaSetup} />)
      expect(screen.getByText('Computer wins! 🎉')).toBeInTheDocument()
    })

    it('shows "It\'s a draw! 🤝" when isDraw=true', () => {
      render(<GameStatus currentPlayer="X" winner={null} isDraw={true} setup={pvpSetup} />)
      expect(screen.getByText("It's a draw! 🤝")).toBeInTheDocument()
    })

    it('has aria-live="assertive" on the result element', () => {
      render(<GameStatus currentPlayer="X" winner="X" isDraw={false} setup={pvpSetup} />)
      const resultEl = screen.getByText('Player 1 wins! 🎉')
      expect(resultEl).toHaveAttribute('aria-live', 'assertive')
    })

    it('does NOT show turn text when game is over (winner)', () => {
      render(<GameStatus currentPlayer="X" winner="X" isDraw={false} setup={pvpSetup} />)
      expect(screen.queryByText("Player 1's turn")).not.toBeInTheDocument()
    })

    it('does NOT show turn text when game is over (draw)', () => {
      render(<GameStatus currentPlayer="X" winner={null} isDraw={true} setup={pvpSetup} />)
      expect(screen.queryByText("Player 1's turn")).not.toBeInTheDocument()
    })
  })

  describe('Accessibility (axe)', () => {
    it('active game state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner={null} isDraw={false} setup={pvpSetup} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('winner state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner="X" isDraw={false} setup={pvpSetup} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('draw state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner={null} isDraw={true} setup={pvpSetup} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
