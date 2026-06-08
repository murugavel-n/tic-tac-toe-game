import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { DifficultySelector } from './DifficultySelector'

expect.extend(toHaveNoViolations)

describe('DifficultySelector', () => {
  describe('Visibility', () => {
    it('renders nothing visible when disabled=true (aria-hidden + hidden)', () => {
      render(<DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={true} />)
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      const hiddenDiv = document.querySelector('[aria-hidden="true"]')
      expect(hiddenDiv).toBeInTheDocument()
      expect(hiddenDiv).toHaveClass('hidden')
    })

    it('renders 2 options when disabled=false', () => {
      render(<DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={false} />)
      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })
  })

  describe('Rendering', () => {
    it('has role="radiogroup" with aria-label="AI difficulty"', () => {
      render(<DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={false} />)
      expect(screen.getByRole('radiogroup', { name: 'AI difficulty' })).toBeInTheDocument()
    })

    it('each option has role="radio"', () => {
      render(<DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={false} />)
      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(2)
      expect(screen.getByRole('radio', { name: 'Easy' })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'Hard' })).toBeInTheDocument()
    })

    it('correct option has aria-checked="true" for easy', () => {
      render(<DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={false} />)
      expect(screen.getByRole('radio', { name: 'Easy' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('radio', { name: 'Hard' })).toHaveAttribute('aria-checked', 'false')
    })

    it('correct option has aria-checked="true" for hard', () => {
      render(<DifficultySelector difficulty="hard" onChange={vi.fn()} disabled={false} />)
      expect(screen.getByRole('radio', { name: 'Hard' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('radio', { name: 'Easy' })).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('Interaction', () => {
    it('clicking option calls onChange', () => {
      const onChange = vi.fn()
      render(<DifficultySelector difficulty="easy" onChange={onChange} disabled={false} />)
      fireEvent.click(screen.getByRole('radio', { name: 'Hard' }))
      expect(onChange).toHaveBeenCalledWith('hard')
    })

    it('pressing Enter on option calls onChange', () => {
      const onChange = vi.fn()
      render(<DifficultySelector difficulty="easy" onChange={onChange} disabled={false} />)
      fireEvent.keyDown(screen.getByRole('radio', { name: 'Hard' }), { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith('hard')
    })

    it('pressing Space on option calls onChange', () => {
      const onChange = vi.fn()
      render(<DifficultySelector difficulty="easy" onChange={onChange} disabled={false} />)
      fireEvent.keyDown(screen.getByRole('radio', { name: 'Hard' }), { key: ' ' })
      expect(onChange).toHaveBeenCalledWith('hard')
    })
  })

  describe('Accessibility (axe)', () => {
    it('easy selected passes axe', async () => {
      const { container } = render(
        <DifficultySelector difficulty="easy" onChange={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('hard selected passes axe', async () => {
      const { container } = render(
        <DifficultySelector difficulty="hard" onChange={vi.fn()} disabled={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
