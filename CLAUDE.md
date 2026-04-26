# CLAUDE.md

## Project Overview

Vanilla JS browser drum machine. No build step, no framework, no package manager. The app runs directly from `index.html` using ES6 modules. All external libraries are loaded via CDN.

## How to Run

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No install step. No compilation.

## Key Conventions

- **No build tooling.** Do not introduce webpack, vite, esbuild, or any bundler unless explicitly asked.
- **No npm dependencies.** CDN-only for external libs (`midi-writer-js`, `midi-parser-js`).
- **ES6 modules.** All files use `import`/`export`. `main.js` is the entry point and wires everything together.
- **No test suite.** Manual testing in the browser. Verify audio playback and UI interactions by hand.

## Architecture

### State

`src/state.js` holds all global state. Pattern bank holds patterns A–H; each pattern is a plain object:

```js
{ pattern, velocities, stepCount, swing, activeTrackIndices, tracks }
```

State changes should flow through the functions exported from `state.js`, not by mutating the object directly.

### Audio

- `src/audio/engine.js` — AudioContext, track buses, reverb, voice dispatch
- `src/audio/scheduler.js` — 25 ms interval + 100 ms lookahead playback loop; handles swing and song chain auto-advance
- `src/audio/voices/` — four voice types: `tone`, `noise`, `hybrid`, `multi`

When modifying synthesis parameters, check `src/constants.js` for the parameter limits (`PARAM_LIMITS`) and instrument defaults (`DEFAULT_SOUNDS`).

### Storage

`src/storage.js` wraps `localStorage`. Storage is versioned (currently v2). If adding new persisted state, include a migration from v1.

### UI

- Grid rendering: `src/ui/grid.js`
- Pattern bank + song chain: `src/ui/patterns.js`
- Instrument editor modal: `src/ui/sound-designer.js`
- BPM / transport controls + keyboard shortcuts: `src/ui/controls.js`

Mobile layout breakpoint is 640 px. The mobile grid shows 4 steps per page with tab navigation.

## What to Avoid

- Do not add a framework (React, Vue, Svelte, etc.)
- Do not add a CSS preprocessor
- Do not introduce a state management library
- Do not mock the Web Audio API in tests — test audio behavior manually
- Do not break the zero-install, open-in-browser workflow
