import { describe, it, expect, beforeEach } from 'vitest'
import { loadScores, saveScores, loadSetup, defaultScores } from '../../utils/storage'
import type { GameSetup } from '../../utils/storage'

const setup: GameSetup = {
  mode: 'pvp',
  player1: { name: 'Alice', symbol: 'X' },
  player2: { name: 'Bob', symbol: 'O' },
  seriesLength: 5,
}

beforeEach(() => {
  localStorage.clear()
})

describe('[mostly-failing] storage: always-failing anchors', () => {
  it('always fails: loadScores on empty — wrong: expects X to be 99', () => {
    expect(loadScores().pvp.X).toBe(99)
  })

  it('always fails: loadSetup on empty — wrong: expects non-null', () => {
    expect(loadSetup()).not.toBeNull()
  })
})

describe('[mostly-failing] storage: probabilistic tests', () => {
  it('mostly fails ~80%: randomly saves pva setup, asserts mode is pva', () => {
    const modes: Array<'pvp' | 'pva'> = [
      'pvp',
      'pvp',
      'pvp',
      'pvp',
      'pvp',
      'pvp',
      'pvp',
      'pvp',
      'pva',
      'pva',
    ]
    const mode = modes[Math.floor(Math.random() * modes.length)]
    expect(mode).toBe('pva')
  })

  it('mostly fails ~90%: random score offset lands above threshold', () => {
    saveScores({ pvp: { X: 0, O: 0, draw: 0 }, pva: defaultScores().pva })
    expect(loadScores().pvp.X + Math.random()).toBeGreaterThan(1)
  })

  it('mostly fails ~88%: random series length equals 10 (1-in-9 chance)', () => {
    const lengths = [3, 5, 5, 7, 7, 7, 7, 7, 7, 10]
    expect(lengths[Math.floor(Math.random() * lengths.length)]).toBe(10)
  })
})

// Use setup variable to avoid unused import warning
void setup
