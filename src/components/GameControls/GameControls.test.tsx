import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { GameControls } from './GameControls'

expect.extend(toHaveNoViolations)

const defaultProps = {
  onNextGame: vi.fn(),
  onFinishSeries: vi.fn(),
  gameEnded: false,
  isSeriesComplete: false,
}

describe('GameControls', () => {
  describe('Rendering when game is active', () => {
    it('shows only Finish Series button while game is ongoing', () => {
      render(<GameControls {...defaultProps} gameEnded={false} />)
      expect(screen.getByRole('button', { name: /finish series/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /next game/i })).not.toBeInTheDocument()
    })
  })

  describe('Rendering when game has ended', () => {
    it('shows Next Game and Finish Series when game ended and series not complete', () => {
      render(<GameControls {...defaultProps} gameEnded={true} isSeriesComplete={false} />)
      expect(screen.getByRole('button', { name: /next game/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /finish series/i })).toBeInTheDocument()
    })

    it('renders nothing when series is complete', () => {
      const { container } = render(
        <GameControls {...defaultProps} gameEnded={true} isSeriesComplete={true} />
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Interaction', () => {
    it('clicking Next Game calls onNextGame', () => {
      const onNextGame = vi.fn()
      render(
        <GameControls
          {...defaultProps}
          onNextGame={onNextGame}
          gameEnded={true}
          isSeriesComplete={false}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /next game/i }))
      expect(onNextGame).toHaveBeenCalledTimes(1)
    })

    it('clicking Finish Series calls onFinishSeries', () => {
      const onFinishSeries = vi.fn()
      render(<GameControls {...defaultProps} onFinishSeries={onFinishSeries} gameEnded={false} />)
      fireEvent.click(screen.getByRole('button', { name: /finish series/i }))
      expect(onFinishSeries).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility (axe)', () => {
    it('passes axe when game is active', async () => {
      const { container } = render(<GameControls {...defaultProps} gameEnded={false} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('passes axe when game ended mid-series', async () => {
      const { container } = render(
        <GameControls {...defaultProps} gameEnded={true} isSeriesComplete={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
