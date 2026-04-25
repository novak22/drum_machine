import { state, INSTRUMENTS } from './state.js';

const KEYS = {
  VERSION:      'drumMachine.version',
  PATTERN:      'drumMachine.pattern',
  BPM:          'drumMachine.bpm',
  INSTRUMENTS:  'drumMachine.instruments',
  USER_PRESETS: 'drumMachine.userPresets',
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
    if (pattern) state.pattern = JSON.parse(pattern);

    const bpm = localStorage.getItem(KEYS.BPM);
    if (bpm) state.bpm = parseInt(bpm, 10);

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
