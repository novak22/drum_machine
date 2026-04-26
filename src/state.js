import { DEFAULT_PARAMS, DEFAULT_PARAMS_ORDER, INSTRUMENT_CONFIGS } from './constants.js';

function makeDefaultPattern() {
  const p = Array(16).fill(null).map(() => Array(32).fill(false));
  [0, 4, 8, 12].forEach(s => { p[0][s] = true; });               // Kick: four-on-the-floor
  [4, 12].forEach(s => { p[1][s] = true; });                     // Snare: backbeat
  [0, 2, 4, 6, 8, 10, 12, 14].forEach(s => { p[2][s] = true; }); // HH close: 8th notes
  return p;
}

export function makeDefaultBundle() {
  return {
    stepCount: 16,
    swing: 0,
    pattern: makeDefaultPattern(),
    velocities: Array(16).fill(null).map(() => Array(32).fill(0.8)),
    activeTrackIndices: [0, 1, 2, 4, 5, 6],
    tracks: Array(16).fill(null).map(() => ({ muted: false, solo: false, volume: 1.0, fxSend: 0.0 })),
  };
}

const _initial = makeDefaultBundle();

export const state = {
  // Live playback state (mirrors active pattern bundle)
  pattern:             _initial.pattern,
  stepCount:           _initial.stepCount,
  activeTrackIndices:  [..._initial.activeTrackIndices],
  tracks:              _initial.tracks,
  velocities:          _initial.velocities,
  swing:               _initial.swing,

  // Global
  bpm: 120,
  isPlaying: false,
  currentStep: 0,

  // Pattern bank
  patterns:          { A: makeDefaultBundle() },
  activePatternId:   'A',
  songChain:         ['A'],
  songChainPosition: 0,
  _renderPending:    false,

  ui: {
    selectedTrack: null,
    modalOpen: false,
    tempParams: null,
    editKitMode: false,
    mobileBar: 0,
  },
};

export const INSTRUMENTS = INSTRUMENT_CONFIGS.map((config, i) => ({
  ...config,
  params: structuredClone(DEFAULT_PARAMS[DEFAULT_PARAMS_ORDER[i]]),
}));

export function resetInstruments() {
  INSTRUMENTS.forEach((inst, i) => {
    inst.params = structuredClone(DEFAULT_PARAMS[DEFAULT_PARAMS_ORDER[i]]);
  });
}

export function resetTracks() {
  state.tracks.forEach(t => {
    t.muted = false; t.solo = false; t.volume = 1.0; t.fxSend = 0.0;
  });
  state.velocities.forEach(row => row.fill(0.8));
}

// ─── Pattern bank helpers ─────────────────────────────────────────────────────

export function saveCurrentToPattern() {
  const p = state.patterns[state.activePatternId];
  if (!p) return;
  p.stepCount           = state.stepCount;
  p.swing               = state.swing;
  p.pattern             = state.pattern.map(row => [...row]);
  p.velocities          = state.velocities.map(row => [...row]);
  p.activeTrackIndices  = [...state.activeTrackIndices];
  p.tracks              = state.tracks.map(t => ({ ...t }));
}

export function loadPatternById(id) {
  const p = state.patterns[id];
  if (!p) return false;
  state.activePatternId        = id;
  state.stepCount              = p.stepCount;
  state.swing                  = p.swing;
  state.pattern                = p.pattern.map(row => [...row]);
  state.velocities             = p.velocities.map(row => [...row]);
  state.activeTrackIndices     = [...p.activeTrackIndices];
  p.tracks.forEach((saved, i) => { if (state.tracks[i]) Object.assign(state.tracks[i], saved); });
  state.ui.editKitMode         = false;
  state.ui.mobileBar           = 0;
  return true;
}

export function createPattern(id) {
  if (state.patterns[id]) return false;
  // New pattern starts as a copy of the current active one
  saveCurrentToPattern();
  state.patterns[id] = {
    stepCount:          state.stepCount,
    swing:              state.swing,
    pattern:            Array(16).fill(null).map(() => Array(32).fill(false)),
    velocities:         state.velocities.map(row => [...row]),
    activeTrackIndices: [...state.activeTrackIndices],
    tracks:             state.tracks.map(t => ({ ...t })),
  };
  return true;
}

export function resetAllPatterns() {
  state.patterns          = { A: makeDefaultBundle() };
  state.activePatternId   = 'A';
  state.songChain         = ['A'];
  state.songChainPosition = 0;
  state._renderPending    = false;
  state.swing             = 0;
  loadPatternById('A');
  state.ui.editKitMode    = false;
  state.ui.mobileBar      = 0;
}
