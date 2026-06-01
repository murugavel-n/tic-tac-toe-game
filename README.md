# Tic Tac Toe

A stress-relief Tic Tac Toe game built with React 18, TypeScript, Vite, and Tailwind CSS. Runs entirely in the browser — no backend required.

## Features

- **Player vs Player** and **Player vs AI** modes
- **AI difficulty levels**: Easy (random), Medium (mixed), Hard (minimax — unbeatable)
- **Score persistence** via `localStorage` across page reloads
- **WCAG AA accessibility**: full keyboard navigation, screen reader support, axe-clean

## Tech Stack

| Technology | Version |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | v3 |
| Vitest + jest-axe | unit testing |
| Playwright + axe-core | end-to-end testing |
| eslint-plugin-jsx-a11y | accessibility linting |

## Getting Started

```bash
npm install
npm run dev
```

App opens at **http://localhost:1111**.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server at http://localhost:1111 |
| `npm run lint` | Run ESLint (TypeScript + a11y rules) across `src/` |
| `npm run test:unit` | Run Vitest unit tests once |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test` | Run unit tests then e2e tests |
| `npm run build` | Type-check and build for production |

## Test Output

Running `npm run test` generates JUnit XML reports for CloudBees Smart Tests ingestion:

- `test-results/vitest-junit.xml` — unit test results
- `test-results/playwright-junit.xml` — e2e test results

## Project Structure

```
src/
├── components/
│   ├── Board/
│   ├── Cell/
│   ├── DifficultySelector/
│   ├── GameControls/
│   ├── GameModeSelector/
│   ├── GameStatus/
│   └── ScoreBoard/
├── hooks/
│   └── useGame.ts         # game state and logic hook
├── utils/
│   ├── gameLogic.ts       # win detection, minimax AI
│   └── storage.ts         # localStorage score persistence
├── App.tsx
└── main.tsx
```
