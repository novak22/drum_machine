# Drum Machine

A browser-based drum sequencer built with vanilla JavaScript and the Web Audio API. No build tools, no frameworks — open `index.html` and play.

## Features

- 16-step sequencer (configurable to 8, 16, or 32 steps per track)
- 16 synthesized drum instruments — kick, snare, hi-hats, clap, toms, cymbals, percussion
- Pattern bank (A–H) for saving and switching between patterns
- Song chain to sequence patterns into full compositions
- Swing control (0–50%) for groove
- Per-step velocity control via click-drag
- Sound designer modal with preset system (built-in + user-saved)
- MIDI import and export
- Mobile-responsive layout with tabbed grid navigation
- Autosaved to `localStorage`

## Running

No install or build step required. Open `index.html` directly in a modern browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project Structure

```
index.html              # Entry point
main.js                 # App bootstrap and module wiring
styles.css              # All styles (dark theme)
src/
  constants.js          # Instrument configs, defaults, presets, param limits
  state.js              # Global state and pattern bank logic
  storage.js            # localStorage persistence (versioned, v1→v2 migration)
  audio/
    engine.js           # AudioContext, track buses, reverb, voice dispatch
    scheduler.js        # Playback loop, step scheduling, swing, song chain
    voices/
      tone.js           # Oscillator synthesis (pitch sweep + ADSR)
      noise.js          # Filtered noise synthesis
      hybrid.js         # Tone + noise blend (snare, rimshot)
      multi.js          # Multi-burst noise (clap)
  midi/
    importer.js         # MIDI file → pattern (drum track detection)
    exporter.js         # Pattern → MIDI file (GM drum mapping)
  ui/
    controls.js         # BPM, play/stop, keyboard shortcuts
    grid.js             # Sequencer grid, step interaction, velocity drag
    patterns.js         # Pattern bank UI, song chain, swing controls
    sound-designer.js   # Instrument parameter editor, preset system
```

## Tech Stack

- **JavaScript** (ES6 modules, no transpilation)
- **Web Audio API** for synthesis and playback
- **HTML5 / CSS3** — no frontend framework
- **localStorage** for persistence
- **CDN libraries:** `midi-writer-js`, `midi-parser-js`

## Audio Architecture

The scheduler runs on a 25 ms interval with a 100 ms lookahead to keep audio glitch-free. Each instrument type has a dedicated voice module:

| Voice type | Used for | Synthesis |
|---|---|---|
| `tone` | Kick, toms, cowbell | Oscillator + pitch sweep + ADSR |
| `noise` | Hi-hats, cymbals | Filtered noise + ADSR |
| `hybrid` | Snare, rimshot | Parallel tone + filtered noise |
| `multi` | Clap | Multiple noise bursts |

Reverb is a procedurally generated impulse response convolver (1.8 s). Each track has its own gain bus and reverb send.
