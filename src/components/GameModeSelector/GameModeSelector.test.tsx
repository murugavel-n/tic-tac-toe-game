import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { GameModeSelector } from './GameModeSelector'

expect.extend(toHaveNoViolations)

describe('GameModeSelector', () => {
  describe('Rendering', () => {
    it('renders "Player vs Player" and "Player vs AI" options', () => {
      render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      expect(screen.getByText('Player vs Player')).toBeInTheDocument()
      expect(screen.getByText('Player vs AI')).toBeInTheDocument()
    })

    it('has role="radiogroup" with aria-label="Game mode"', () => {
      render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      expect(screen.getByRole('radiogroup', { name: 'Game mode' })).toBeInTheDocument()
    })

    it('each option has role="radio"', () => {
      render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })

    it('selected option has aria-checked="true"', () => {
      render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      const pvpButton = screen.getByRole('radio', { name: 'Player vs Player' })
      expect(pvpButton).toHaveAttribute('aria-checked', 'true')
    })

    it('unselected option has aria-checked="false"', () => {
      render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      const pvaButton = screen.getByRole('radio', { name: 'Player vs AI' })
      expect(pvaButton).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('Interaction', () => {
    it('clicking unselected option calls onChange with correct value', () => {
      const onChange = vi.fn()
      render(<GameModeSelector gameMode="pvp" onChange={onChange} />)
      fireEvent.click(screen.getByRole('radio', { name: 'Player vs AI' }))
      expect(onChange).toHaveBeenCalledWith('pva')
    })

    it('clicking already-selected option still calls onChange', () => {
      const onChange = vi.fn()
      render(<GameModeSelector gameMode="pvp" onChange={onChange} />)
      fireEvent.click(screen.getByRole('radio', { name: 'Player vs Player' }))
      expect(onChange).toHaveBeenCalledWith('pvp')
    })

    it('pressing Enter on a radio calls onChange', () => {
      const onChange = vi.fn()
      render(<GameModeSelector gameMode="pvp" onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('radio', { name: 'Player vs AI' }), { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith('pva')
    })

    it('pressing Space on a radio calls onChange', () => {
      const onChange = vi.fn()
      render(<GameModeSelector gameMode="pvp" onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('radio', { name: 'Player vs AI' }), { key: ' ' })
      expect(onChange).toHaveBeenCalledWith('pva')
    })
  })

  describe('Accessibility (axe)', () => {
    it('pvp selected passes axe', async () => {
      const { container } = render(<GameModeSelector gameMode="pvp" onChange={vi.fn()} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('pva selected passes axe', async () => {
      const { container } = render(<GameModeSelector gameMode="pva" onChange={vi.fn()} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
