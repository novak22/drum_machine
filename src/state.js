import { DEFAULT_PARAMS, DEFAULT_PARAMS_ORDER, INSTRUMENT_CONFIGS } from './constants.js';

function makeDefaultPattern() {
  const p = Array(16).fill(null).map(() => Array(32).fill(false));
  [0, 4, 8, 12].forEach(s => { p[0][s] = true; });               // Kick: four-on-the-floor
  [4, 12].forEach(s => { p[1][s] = true; });                     // Snare: backbeat
  [0, 2, 4, 6, 8, 10, 12, 14].forEach(s => { p[2][s] = true; }); // HH close: 8th notes
  return p;
}

export const state = {
  pattern: makeDefaultPattern(),
  stepCount: 16,
  // Ordered list of instrumentIds currently shown in the grid (default 6-track kit)
  activeTrackIndices: [0, 1, 2, 4, 5, 6],
  bpm: 120,
  isPlaying: false,
  currentStep: 0,
  tracks: Array(16).fill(null).map(() => ({
    muted: false, solo: false, volume: 1.0, fxSend: 0.0,
  })),
  velocities: Array(16).fill(null).map(() => Array(32).fill(0.8)),
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

export function resetActiveTrackIndices() {
  state.activeTrackIndices = [0, 1, 2, 4, 5, 6];
  state.ui.editKitMode = false;
}
