import { state, INSTRUMENTS } from './state.js';

const KEYS = {
  VERSION:       'drumMachine.version',
  PATTERN:       'drumMachine.pattern',
  BPM:           'drumMachine.bpm',
  STEP_COUNT:    'drumMachine.stepCount',
  ACTIVE_TRACKS: 'drumMachine.activeTrackIndices',
  TRACKS:        'drumMachine.tracks',
  VELOCITIES:    'drumMachine.velocities',
  INSTRUMENTS:   'drumMachine.instruments',
  USER_PRESETS:  'drumMachine.userPresets',
};

const AUTOSAVE_DELAY = 1000;

let _onSaved = null;
let _autosaveTimer = null;

export function initStorage(onSaved) {
  _onSaved = onSaved;
}

export function saveToLocalStorage() {
  try {
    localStorage.setItem(KEYS.VERSION, '1.0');
    localStorage.setItem(KEYS.PATTERN, JSON.stringify(state.pattern));
    localStorage.setItem(KEYS.BPM, String(state.bpm));
    localStorage.setItem(KEYS.STEP_COUNT, String(state.stepCount));
    localStorage.setItem(KEYS.ACTIVE_TRACKS, JSON.stringify(state.activeTrackIndices));
    localStorage.setItem(KEYS.TRACKS, JSON.stringify(state.tracks));
    localStorage.setItem(KEYS.VELOCITIES, JSON.stringify(state.velocities));
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

    const pattern = localStorage.getItem(KEYS.PATTERN);
    if (pattern) {
      const parsed = JSON.parse(pattern);
      // Pad each row to 32 in case this is an older 16-step save
      state.pattern = parsed.map(row => {
        const padded = Array(32).fill(false);
        row.forEach((v, i) => { if (i < 32) padded[i] = !!v; });
        return padded;
      });
    }

    const bpm = localStorage.getItem(KEYS.BPM);
    if (bpm) state.bpm = parseInt(bpm, 10);

    const stepCount = localStorage.getItem(KEYS.STEP_COUNT);
    if (stepCount) state.stepCount = parseInt(stepCount, 10);

    const activeTracks = localStorage.getItem(KEYS.ACTIVE_TRACKS);
    if (activeTracks) {
      state.activeTrackIndices = JSON.parse(activeTracks);
    } else {
      // Backward compat: old save without activeTrackIndices → show all 16
      state.activeTrackIndices = Array.from({ length: 16 }, (_, i) => i);
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

    const instruments = localStorage.getItem(KEYS.INSTRUMENTS);
    if (instruments) {
      JSON.parse(instruments).forEach((saved) => {
        const inst = INSTRUMENTS.find(i => i.id === saved.id);
        if (inst) inst.params = { ...inst.params, ...saved.params };
      });
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
