import { state, INSTRUMENTS, saveCurrentToPattern, loadPatternById } from './state.js';

const KEYS = {
  VERSION:        'drumMachine.version',
  BPM:            'drumMachine.bpm',
  INSTRUMENTS:    'drumMachine.instruments',
  USER_PRESETS:   'drumMachine.userPresets',
  // v2 pattern bank
  PATTERNS:       'drumMachine.patterns',
  ACTIVE_PATTERN: 'drumMachine.activePatternId',
  SONG_CHAIN:     'drumMachine.songChain',
  // v1 keys (kept for migration reads only)
  PATTERN:        'drumMachine.pattern',
  STEP_COUNT:     'drumMachine.stepCount',
  ACTIVE_TRACKS:  'drumMachine.activeTrackIndices',
  TRACKS:         'drumMachine.tracks',
  VELOCITIES:     'drumMachine.velocities',
};

const AUTOSAVE_DELAY = 1000;

let _onSaved = null;
let _autosaveTimer = null;

export function initStorage(onSaved) {
  _onSaved = onSaved;
}

export function saveToLocalStorage() {
  try {
    saveCurrentToPattern();

    localStorage.setItem(KEYS.VERSION, '2.0');
    localStorage.setItem(KEYS.BPM, String(state.bpm));
    localStorage.setItem(KEYS.PATTERNS, JSON.stringify(state.patterns));
    localStorage.setItem(KEYS.ACTIVE_PATTERN, state.activePatternId);
    localStorage.setItem(KEYS.SONG_CHAIN, JSON.stringify(state.songChain));
    localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(
      INSTRUMENTS.map(({ id, params }) => ({ id, params }))
    ));
  } catch (e) {
    console.error('Save failed:', e);
  }
}

export function loadFromLocalStorage() {
  try {
    if (!localStorage.getItem(KEYS.VERSION)) return false;

    const bpm = localStorage.getItem(KEYS.BPM);
    if (bpm) state.bpm = parseInt(bpm, 10);

    const instruments = localStorage.getItem(KEYS.INSTRUMENTS);
    if (instruments) {
      JSON.parse(instruments).forEach((saved) => {
        const inst = INSTRUMENTS.find(i => i.id === saved.id);
        if (inst) inst.params = { ...inst.params, ...saved.params };
      });
    }

    const patterns = localStorage.getItem(KEYS.PATTERNS);
    if (patterns) {
      // v2 format
      state.patterns = JSON.parse(patterns);
      // Pad pattern rows to 32 steps in case they were saved shorter
      Object.values(state.patterns).forEach(bundle => {
        bundle.pattern = bundle.pattern.map(row => {
          const padded = Array(32).fill(false);
          row.forEach((v, i) => { if (i < 32) padded[i] = !!v; });
          return padded;
        });
        if (!bundle.velocities) {
          bundle.velocities = Array(16).fill(null).map(() => Array(32).fill(0.8));
        }
        if (!bundle.tracks) {
          bundle.tracks = Array(16).fill(null).map(() => ({ muted: false, solo: false, volume: 1.0, fxSend: 0.0 }));
        }
        if (!bundle.swing) bundle.swing = 0;
      });

      const activeId = localStorage.getItem(KEYS.ACTIVE_PATTERN) || 'A';
      const songChain = localStorage.getItem(KEYS.SONG_CHAIN);
      if (songChain) state.songChain = JSON.parse(songChain);

      loadPatternById(state.patterns[activeId] ? activeId : Object.keys(state.patterns)[0]);
    } else {
      // v1 format — migrate to pattern A
      const pattern = localStorage.getItem(KEYS.PATTERN);
      if (pattern) {
        const parsed = JSON.parse(pattern);
        state.pattern = parsed.map(row => {
          const padded = Array(32).fill(false);
          row.forEach((v, i) => { if (i < 32) padded[i] = !!v; });
          return padded;
        });
      }
      const stepCount = localStorage.getItem(KEYS.STEP_COUNT);
      if (stepCount) state.stepCount = parseInt(stepCount, 10);

      const activeTracks = localStorage.getItem(KEYS.ACTIVE_TRACKS);
      if (activeTracks) {
        state.activeTrackIndices = JSON.parse(activeTracks);
      }
      const tracks = localStorage.getItem(KEYS.TRACKS);
      if (tracks) {
        JSON.parse(tracks).forEach((saved, i) => {
          if (state.tracks[i]) Object.assign(state.tracks[i], saved);
        });
      }
      const velocities = localStorage.getItem(KEYS.VELOCITIES);
      if (velocities) {
        JSON.parse(velocities).forEach((row, track) => {
          if (state.velocities[track]) {
            row.forEach((v, step) => { if (step < 32) state.velocities[track][step] = v; });
          }
        });
      }
      // Flush migrated data into pattern A
      saveCurrentToPattern();
    }

    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

export function loadUserPresets() {
  try {
    const saved = localStorage.getItem(KEYS.USER_PRESETS);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function saveUserPresets(presets) {
  try {
    localStorage.setItem(KEYS.USER_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save user presets:', e);
  }
}

export function clearAll() {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

export function autosave() {
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(() => {
    saveToLocalStorage();
    _onSaved?.();
  }, AUTOSAVE_DELAY);
}
