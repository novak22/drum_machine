import { triggerToneVoice } from './voices/tone.js';
import { triggerNoiseVoice } from './voices/noise.js';
import { triggerHybridVoice } from './voices/hybrid.js';
import { triggerMultiVoice } from './voices/multi.js';

let audioCtx = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function triggerVoice(instrument, time, velocity = 1.0) {
  const ctx = getAudioContext();
  const { params, type } = instrument;

  switch (type) {
    case 'tone':   return triggerToneVoice(ctx, params, time, velocity);
    case 'noise':  return triggerNoiseVoice(ctx, params, time, velocity);
    case 'hybrid': return triggerHybridVoice(ctx, params, time, velocity);
    case 'multi':  return triggerMultiVoice(ctx, params, time, velocity);
  }
}
