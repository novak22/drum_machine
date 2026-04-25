import { DEFAULT_PARAMS, DEFAULT_PARAMS_ORDER, INSTRUMENT_CONFIGS } from './constants.js';

export const state = {
  pattern: Array(16).fill(null).map(() => Array(16).fill(false)),
  bpm: 120,
  isPlaying: false,
  currentStep: 0,
  ui: {
    selectedTrack: null,
    modalOpen: false,
    tempParams: null,
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
