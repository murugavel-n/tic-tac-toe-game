import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from './useGame'
import { defaultScores, type GameSetup } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  loadScores: vi.fn(() => defaultScores()),
  saveScores: vi.fn(),
  defaultScores: () => ({
    pvp: { X: 0, O: 0, draw: 0 },
    pva: {
      easy: { X: 0, O: 0, draw: 0 },
      hard: { X: 0, O: 0, draw: 0 },
    },
  }),
}))

// Import after mock
import { loadScores, saveScores } from '../utils/storage'

const pvpSetup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Bob', symbol: 'O' },
  difficulty: 'easy',
}

const pvaSetup: GameSetup = {
  mode: 'pva',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Computer', symbol: 'O' },
  difficulty: 'easy',
}

describe('useGame', () => {
  describe('Initial state', () => {
    it('board is 9 nulls', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      expect(result.current.board).toEqual(Array(9).fill(null))
    })

    it('currentPlayer is X', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      expect(result.current.currentPlayer).toBe('X')
    })

    it('winner is null and isDraw is false', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      expect(result.current.winner).toBeNull()
      expect(result.current.isDraw).toBe(false)
    })

    it('setup reflects passed-in mode and difficulty', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      expect(result.current.setup.mode).toBe('pvp')
      expect(result.current.setup.difficulty).toBe('easy')
    })

    it('scores loaded from loadScores()', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      expect(loadScores).toHaveBeenCalled()
      expect(result.current.scores).toEqual(defaultScores())
    })
  })

  describe('handleCellClick — PvP', () => {
    it('clicking empty cell places X, then O alternates', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      expect(result.current.board[0]).toBe('X')
      expect(result.current.currentPlayer).toBe('O')

      act(() => {
        result.current.handleCellClick(1)
      })
      expect(result.current.board[1]).toBe('O')
      expect(result.current.currentPlayer).toBe('X')
    })

    it('clicking filled cell does nothing', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.handleCellClick(0)
      })

      expect(result.current.board[0]).toBe('X')
      expect(result.current.currentPlayer).toBe('O')
    })

    it('clicking when game is over does nothing', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      // X wins: 0,1,2
      act(() => {
        result.current.handleCellClick(0)
      }) // X
      act(() => {
        result.current.handleCellClick(3)
      }) // O
      act(() => {
        result.current.handleCellClick(1)
      }) // X
      act(() => {
        result.current.handleCellClick(4)
      }) // O
      act(() => {
        result.current.handleCellClick(2)
      }) // X wins

      expect(result.current.winner).toBe('X')

      act(() => {
        result.current.handleCellClick(5)
      })
      expect(result.current.board[5]).toBeNull()
    })

    it('winning move sets winner correctly', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      }) // X
      act(() => {
        result.current.handleCellClick(3)
      }) // O
      act(() => {
        result.current.handleCellClick(1)
      }) // X
      act(() => {
        result.current.handleCellClick(4)
      }) // O
      act(() => {
        result.current.handleCellClick(2)
      }) // X wins

      expect(result.current.winner).toBe('X')
    })

    it('draw sets isDraw correctly', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      // Draw sequence:
      // X O X
      // X X O
      // O X O
      act(() => {
        result.current.handleCellClick(0)
      }) // X
      act(() => {
        result.current.handleCellClick(1)
      }) // O
      act(() => {
        result.current.handleCellClick(2)
      }) // X
      act(() => {
        result.current.handleCellClick(4)
      }) // O
      act(() => {
        result.current.handleCellClick(3)
      }) // X
      act(() => {
        result.current.handleCellClick(6)
      }) // O
      act(() => {
        result.current.handleCellClick(5)
      }) // X
      act(() => {
        result.current.handleCellClick(8)
      }) // O
      act(() => {
        result.current.handleCellClick(7)
      }) // X - draw

      expect(result.current.isDraw).toBe(true)
      expect(result.current.winner).toBeNull()
    })

    it('score is incremented and saveScores called on win', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      const mockSaveScores = saveScores as ReturnType<typeof vi.fn>
      mockSaveScores.mockClear()

      act(() => {
        result.current.handleCellClick(0)
      }) // X
      act(() => {
        result.current.handleCellClick(3)
      }) // O
      act(() => {
        result.current.handleCellClick(1)
      }) // X
      act(() => {
        result.current.handleCellClick(4)
      }) // O
      act(() => {
        result.current.handleCellClick(2)
      }) // X wins

      expect(result.current.scores.pvp.X).toBe(1)
      expect(mockSaveScores).toHaveBeenCalled()
    })

    it('score is incremented and saveScores called on draw', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      const mockSaveScores = saveScores as ReturnType<typeof vi.fn>
      mockSaveScores.mockClear()

      act(() => {
        result.current.handleCellClick(0)
      }) // X
      act(() => {
        result.current.handleCellClick(1)
      }) // O
      act(() => {
        result.current.handleCellClick(2)
      }) // X
      act(() => {
        result.current.handleCellClick(4)
      }) // O
      act(() => {
        result.current.handleCellClick(3)
      }) // X
      act(() => {
        result.current.handleCellClick(6)
      }) // O
      act(() => {
        result.current.handleCellClick(5)
      }) // X
      act(() => {
        result.current.handleCellClick(8)
      }) // O
      act(() => {
        result.current.handleCellClick(7)
      }) // X - draw

      expect(result.current.scores.pvp.draw).toBe(1)
      expect(mockSaveScores).toHaveBeenCalled()
    })
  })

  describe('handleCellClick — PvA', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('X click is registered immediately', () => {
      const { result } = renderHook(() => useGame(pvaSetup))

      act(() => {
        result.current.handleCellClick(0)
      })

      expect(result.current.board[0]).toBe('X')
    })

    it('after X clicks, currentPlayer becomes O', () => {
      const { result } = renderHook(() => useGame(pvaSetup))

      act(() => {
        result.current.handleCellClick(0)
      })

      expect(result.current.currentPlayer).toBe('O')
    })

    it('after advancing fake timers by 300ms, AI places O on the board', () => {
      const { result } = renderHook(() => useGame(pvaSetup))

      act(() => {
        result.current.handleCellClick(0)
      })

      expect(result.current.board.filter((c) => c === 'O')).toHaveLength(0)

      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(result.current.board.filter((c) => c === 'O')).toHaveLength(1)
    })

    it('clicking as O turn in pva mode does nothing', () => {
      const { result } = renderHook(() => useGame(pvaSetup))

      act(() => {
        result.current.handleCellClick(0)
      })

      // currentPlayer is now O — human should not be able to place
      const boardBeforeClick = [...result.current.board]
      act(() => {
        result.current.handleCellClick(1)
      })

      // Board should be unchanged (AI hasn't moved yet either since timer not advanced)
      expect(result.current.board).toEqual(boardBeforeClick)
    })
  })

  describe('startNewGame', () => {
    it('resets board to 9 nulls', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.startNewGame()
      })

      expect(result.current.board).toEqual(Array(9).fill(null))
    })

    it('resets currentPlayer to X', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.startNewGame()
      })

      expect(result.current.currentPlayer).toBe('X')
    })

    it('clears winner and isDraw', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.handleCellClick(3)
      })
      act(() => {
        result.current.handleCellClick(1)
      })
      act(() => {
        result.current.handleCellClick(4)
      })
      act(() => {
        result.current.handleCellClick(2)
      })

      expect(result.current.winner).toBe('X')

      act(() => {
        result.current.startNewGame()
      })

      expect(result.current.winner).toBeNull()
      expect(result.current.isDraw).toBe(false)
    })

    it('does NOT reset scores', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.handleCellClick(3)
      })
      act(() => {
        result.current.handleCellClick(1)
      })
      act(() => {
        result.current.handleCellClick(4)
      })
      act(() => {
        result.current.handleCellClick(2)
      })

      expect(result.current.scores.pvp.X).toBe(1)

      act(() => {
        result.current.startNewGame()
      })

      expect(result.current.scores.pvp.X).toBe(1)
    })
  })

  describe('resetScores', () => {
    it('scores reset to all zeros', () => {
      const { result } = renderHook(() => useGame(pvpSetup))

      act(() => {
        result.current.handleCellClick(0)
      })
      act(() => {
        result.current.handleCellClick(3)
      })
      act(() => {
        result.current.handleCellClick(1)
      })
      act(() => {
        result.current.handleCellClick(4)
      })
      act(() => {
        result.current.handleCellClick(2)
      })

      expect(result.current.scores.pvp.X).toBe(1)

      act(() => {
        result.current.resetScores()
      })

      expect(result.current.scores).toEqual(defaultScores())
    })

    it('saveScores called with zeroed scores', () => {
      const { result } = renderHook(() => useGame(pvpSetup))
      const mockSaveScores = saveScores as ReturnType<typeof vi.fn>
      mockSaveScores.mockClear()

      act(() => {
        result.current.resetScores()
      })

      expect(mockSaveScores).toHaveBeenCalledWith(defaultScores())
    })
  })
})
