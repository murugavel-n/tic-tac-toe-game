import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { GameStatus } from './GameStatus'

expect.extend(toHaveNoViolations)

describe('GameStatus', () => {
  describe('Turn indicator (no winner, no draw)', () => {
    it("shows \"Player X's turn\" when currentPlayer='X'", () => {
      render(
        <GameStatus currentPlayer="X" winner={null} isDraw={false} gameMode="pvp" />
      )
      expect(screen.getByText("Player X's turn")).toBeInTheDocument()
    })

    it("shows \"Player O's turn\" when currentPlayer='O' in pvp mode", () => {
      render(
        <GameStatus currentPlayer="O" winner={null} isDraw={false} gameMode="pvp" />
      )
      expect(screen.getByText("Player O's turn")).toBeInTheDocument()
    })

    it("shows \"AI is thinking...\" when pva mode and currentPlayer='O'", () => {
      render(
        <GameStatus currentPlayer="O" winner={null} isDraw={false} gameMode="pva" />
      )
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument()
    })

    it('has aria-live="polite" on the turn element', () => {
      render(
        <GameStatus currentPlayer="X" winner={null} isDraw={false} gameMode="pvp" />
      )
      const turnEl = screen.getByText("Player X's turn")
      expect(turnEl).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Result announcement', () => {
    it('shows "Player X wins! 🎉" when winner=\'X\'', () => {
      render(
        <GameStatus currentPlayer="X" winner="X" isDraw={false} gameMode="pvp" />
      )
      expect(screen.getByText('Player X wins! 🎉')).toBeInTheDocument()
    })

    it("shows \"Player O wins! 🎉\" when winner='O' in pvp", () => {
      render(
        <GameStatus currentPlayer="O" winner="O" isDraw={false} gameMode="pvp" />
      )
      expect(screen.getByText('Player O wins! 🎉')).toBeInTheDocument()
    })

    it("shows \"AI wins! 🤖\" when winner='O' in pva", () => {
      render(
        <GameStatus currentPlayer="O" winner="O" isDraw={false} gameMode="pva" />
      )
      expect(screen.getByText('AI wins! 🤖')).toBeInTheDocument()
    })

    it("shows \"It's a draw! 🤝\" when isDraw=true", () => {
      render(
        <GameStatus currentPlayer="X" winner={null} isDraw={true} gameMode="pvp" />
      )
      expect(screen.getByText("It's a draw! 🤝")).toBeInTheDocument()
    })

    it('has aria-live="assertive" on the result element', () => {
      render(
        <GameStatus currentPlayer="X" winner="X" isDraw={false} gameMode="pvp" />
      )
      const resultEl = screen.getByText('Player X wins! 🎉')
      expect(resultEl).toHaveAttribute('aria-live', 'assertive')
    })

    it('does NOT show turn text when game is over (winner)', () => {
      render(
        <GameStatus currentPlayer="X" winner="X" isDraw={false} gameMode="pvp" />
      )
      expect(screen.queryByText("Player X's turn")).not.toBeInTheDocument()
    })

    it('does NOT show turn text when game is over (draw)', () => {
      render(
        <GameStatus currentPlayer="X" winner={null} isDraw={true} gameMode="pvp" />
      )
      expect(screen.queryByText("Player X's turn")).not.toBeInTheDocument()
    })
  })

  describe('Accessibility (axe)', () => {
    it('active game state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner={null} isDraw={false} gameMode="pvp" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('winner state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner="X" isDraw={false} gameMode="pvp" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('draw state passes axe', async () => {
      const { container } = render(
        <GameStatus currentPlayer="X" winner={null} isDraw={true} gameMode="pvp" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
