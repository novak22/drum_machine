export const DEFAULT_PARAMS = {
  kick:    { oscType: 'sine',     pitchStart: 150,  pitchEnd: 40,   pitchDecay: 0.5,  gain: 1.0,  attackTime: 0.001, decayTime: 0.5 },
  snare:   { tonePitch: 200, toneMix: 0.7, toneDecay: 0.1, noiseFilterType: 'highpass', noiseFilterFreq: 1000, noiseMix: 1.0, noiseDecay: 0.2, gain: 1.0 },
  hhclose: { noiseDuration: 0.06, filterType: 'bandpass', filterFreq: 8000,  filterQ: 1,   gain: 0.5,  attackTime: 0.001, decayTime: 0.06 },
  hhopen:  { noiseDuration: 0.3,  filterType: 'bandpass', filterFreq: 8000,  filterQ: 1,   gain: 0.5,  attackTime: 0.001, decayTime: 0.3 },
  clap:    { bursts: 3, burstDelay: 0.02, noiseDuration: 0.05, filterType: 'bandpass', filterFreq: 1500, gain: 0.5, decay: 0.05 },
  tomlo:   { oscType: 'sine',     pitchStart: 120,  pitchEnd: 80,   pitchDecay: 0.3,  gain: 0.8,  attackTime: 0.001, decayTime: 0.3 },
  tomhi:   { oscType: 'sine',     pitchStart: 220,  pitchEnd: 180,  pitchDecay: 0.2,  gain: 0.8,  attackTime: 0.001, decayTime: 0.2 },
  rim:     { tonePitch: 1000, toneMix: 0.5, toneDecay: 0.02, noiseFilterType: 'highpass', noiseFilterFreq: 2000, noiseMix: 0.3, noiseDecay: 0.02, gain: 0.5 },
  cowbell: { oscType: 'square',   pitchStart: 800,  pitchEnd: 600,  pitchDecay: 0.2,  gain: 0.7,  attackTime: 0.001, decayTime: 0.2 },
  crash:   { noiseDuration: 2.0,  filterType: 'highpass', filterFreq: 4000,  filterQ: 0.5, gain: 0.6,  attackTime: 0.01,  decayTime: 2.0 },
  ride:    { noiseDuration: 0.8,  filterType: 'bandpass', filterFreq: 6000,  filterQ: 1.5, gain: 0.5,  attackTime: 0.001, decayTime: 0.8 },
  shaker:  { noiseDuration: 0.08, filterType: 'highpass', filterFreq: 10000, filterQ: 1,   gain: 0.4,  attackTime: 0.001, decayTime: 0.08 },
  congahi: { oscType: 'sine',     pitchStart: 400,  pitchEnd: 350,  pitchDecay: 0.25, gain: 0.75, attackTime: 0.001, decayTime: 0.25 },
  congalo: { oscType: 'sine',     pitchStart: 200,  pitchEnd: 170,  pitchDecay: 0.3,  gain: 0.75, attackTime: 0.001, decayTime: 0.3 },
  clave:   { oscType: 'sine',     pitchStart: 2500, pitchEnd: 2500, pitchDecay: 0.03, gain: 0.6,  attackTime: 0.001, decayTime: 0.03 },
  woodblk: { oscType: 'triangle', pitchStart: 1200, pitchEnd: 1000, pitchDecay: 0.05, gain: 0.65, attackTime: 0.001, decayTime: 0.05 },
};

export const DEFAULT_PARAMS_ORDER = [
  'kick', 'snare', 'hhclose', 'hhopen', 'clap', 'tomlo', 'tomhi', 'rim',
  'cowbell', 'crash', 'ride', 'shaker', 'congahi', 'congalo', 'clave', 'woodblk',
];

export const INSTRUMENT_CONFIGS = [
  { id: 0,  name: 'Kick',     type: 'tone',   gmNote: 36 },
  { id: 1,  name: 'Snare',    type: 'hybrid', gmNote: 38 },
  { id: 2,  name: 'HH close', type: 'noise',  gmNote: 42 },
  { id: 3,  name: 'HH open',  type: 'noise',  gmNote: 46 },
  { id: 4,  name: 'Clap',     type: 'multi',  gmNote: 39 },
  { id: 5,  name: 'Tom lo',   type: 'tone',   gmNote: 45 },
  { id: 6,  name: 'Tom hi',   type: 'tone',   gmNote: 50 },
  { id: 7,  name: 'Rim',      type: 'hybrid', gmNote: 37 },
  { id: 8,  name: 'Cowbell',  type: 'tone',   gmNote: 56 },
  { id: 9,  name: 'Crash',    type: 'noise',  gmNote: 49 },
  { id: 10, name: 'Ride',     type: 'noise',  gmNote: 51 },
  { id: 11, name: 'Shaker',   type: 'noise',  gmNote: 70 },
  { id: 12, name: 'Conga hi', type: 'tone',   gmNote: 62 },
  { id: 13, name: 'Conga lo', type: 'tone',   gmNote: 64 },
  { id: 14, name: 'Clave',    type: 'tone',   gmNote: 75 },
  { id: 15, name: 'Wood blk', type: 'tone',   gmNote: 76 },
];

export const BUILTIN_PRESETS = {
  tone: [
    { name: 'Deep Kick',     params: { oscType: 'sine',   pitchStart: 100, pitchEnd: 30,  pitchDecay: 0.6,  gain: 1.0, attackTime: 0.001, decayTime: 0.6 } },
    { name: 'Punchy Kick',   params: { oscType: 'sine',   pitchStart: 200, pitchEnd: 50,  pitchDecay: 0.2,  gain: 1.0, attackTime: 0.001, decayTime: 0.2 } },
    { name: 'Tom Tight',     params: { oscType: 'sine',   pitchStart: 160, pitchEnd: 120, pitchDecay: 0.15, gain: 0.8, attackTime: 0.001, decayTime: 0.15 } },
    { name: 'Cowbell Tight', params: { oscType: 'square', pitchStart: 900, pitchEnd: 700, pitchDecay: 0.1,  gain: 0.7, attackTime: 0.001, decayTime: 0.1 } },
    { name: 'Cowbell Long',  params: { oscType: 'square', pitchStart: 800, pitchEnd: 600, pitchDecay: 0.5,  gain: 0.7, attackTime: 0.001, decayTime: 0.5 } },
  ],
  noise: [
    { name: 'Tight HH',     params: { noiseDuration: 0.04, filterType: 'bandpass', filterFreq: 9000,  filterQ: 1.5, gain: 0.45, attackTime: 0.001, decayTime: 0.04 } },
    { name: 'Long HH',      params: { noiseDuration: 0.5,  filterType: 'bandpass', filterFreq: 8000,  filterQ: 1.0, gain: 0.45, attackTime: 0.001, decayTime: 0.5 } },
    { name: 'Crash Short',  params: { noiseDuration: 1.0,  filterType: 'highpass', filterFreq: 5000,  filterQ: 0.5, gain: 0.6,  attackTime: 0.01,  decayTime: 1.0 } },
    { name: 'Crash Long',   params: { noiseDuration: 3.0,  filterType: 'highpass', filterFreq: 4000,  filterQ: 0.3, gain: 0.5,  attackTime: 0.01,  decayTime: 3.0 } },
    { name: 'Tight Shaker', params: { noiseDuration: 0.05, filterType: 'highpass', filterFreq: 11000, filterQ: 1.0, gain: 0.35, attackTime: 0.001, decayTime: 0.05 } },
  ],
  hybrid: [
    { name: 'Snare Tight', params: { tonePitch: 220,  toneMix: 0.5, toneDecay: 0.08,  noiseFilterType: 'highpass', noiseFilterFreq: 1200, noiseMix: 0.9, noiseDecay: 0.15,  gain: 1.0 } },
    { name: 'Snare Fat',   params: { tonePitch: 180,  toneMix: 0.9, toneDecay: 0.2,   noiseFilterType: 'highpass', noiseFilterFreq: 800,  noiseMix: 0.8, noiseDecay: 0.3,   gain: 1.0 } },
    { name: 'Rim Hard',    params: { tonePitch: 1200, toneMix: 0.6, toneDecay: 0.015, noiseFilterType: 'highpass', noiseFilterFreq: 2000, noiseMix: 0.4, noiseDecay: 0.015, gain: 0.7 } },
  ],
  multi: [
    { name: 'Clap Tight', params: { bursts: 2, burstDelay: 0.01,  noiseDuration: 0.04, filterType: 'bandpass', filterFreq: 2000, gain: 0.6, decay: 0.04 } },
    { name: 'Clap Loose', params: { bursts: 4, burstDelay: 0.025, noiseDuration: 0.06, filterType: 'bandpass', filterFreq: 1200, gain: 0.5, decay: 0.06 } },
  ],
};

export const PARAM_OPTIONS = {
  oscType:         ['sine', 'square', 'triangle', 'sawtooth'],
  filterType:      ['lowpass', 'highpass', 'bandpass'],
  noiseFilterType: ['lowpass', 'highpass', 'bandpass'],
};

export const PARAM_LIMITS = {
  pitchStart:      { min: 20,    max: 2000,  step: 1 },
  pitchEnd:        { min: 20,    max: 2000,  step: 1 },
  pitchDecay:      { min: 0.01,  max: 2.0,   step: 0.01 },
  tonePitch:       { min: 20,    max: 2000,  step: 1 },
  gain:            { min: 0,     max: 2,     step: 0.01 },
  attackTime:      { min: 0.001, max: 0.5,   step: 0.001 },
  decayTime:       { min: 0.01,  max: 2.0,   step: 0.01 },
  toneDecay:       { min: 0.01,  max: 2.0,   step: 0.01 },
  noiseDecay:      { min: 0.01,  max: 2.0,   step: 0.01 },
  noiseDuration:   { min: 0.01,  max: 3.0,   step: 0.01 },
  filterFreq:      { min: 20,    max: 20000, step: 10 },
  noiseFilterFreq: { min: 20,    max: 20000, step: 10 },
  filterQ:         { min: 0.1,   max: 20,    step: 0.1 },
  toneMix:         { min: 0,     max: 2,     step: 0.01 },
  noiseMix:        { min: 0,     max: 2,     step: 0.01 },
  bursts:          { min: 1,     max: 10,    step: 1 },
  burstDelay:      { min: 0.001, max: 0.1,   step: 0.001 },
  decay:           { min: 0.01,  max: 1.0,   step: 0.01 },
};
