import { triggerToneVoice } from './voices/tone.js';
import { triggerNoiseVoice } from './voices/noise.js';
import { triggerHybridVoice } from './voices/hybrid.js';
import { triggerMultiVoice } from './voices/multi.js';
import { state } from '../state.js';

let audioCtx = null;
const trackGains = new Map();
const trackFxSends = new Map();
let reverbInput = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function getReverbBus(ctx) {
  if (reverbInput) return reverbInput;

  const rate = ctx.sampleRate;
  const len = Math.ceil(rate * 1.8);
  const ir = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;

  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.45;
  conv.connect(wetGain);
  wetGain.connect(ctx.destination);

  reverbInput = conv;
  return reverbInput;
}

function getOrCreateTrackBus(trackId) {
  if (trackGains.has(trackId)) return trackGains.get(trackId);

  const ctx = getAudioContext();
  const t = state.tracks[trackId] ?? { volume: 1.0, fxSend: 0.0 };

  const gain = ctx.createGain();
  gain.gain.value = t.volume;
  gain.connect(ctx.destination);

  const fxSend = ctx.createGain();
  fxSend.gain.value = t.fxSend;
  gain.connect(fxSend);
  fxSend.connect(getReverbBus(ctx));

  trackGains.set(trackId, gain);
  trackFxSends.set(trackId, fxSend);

  return gain;
}

export function setTrackVolume(trackId, volume) {
  const gain = trackGains.get(trackId);
  if (gain) gain.gain.setTargetAtTime(volume, getAudioContext().currentTime, 0.01);
}

export function setTrackFxSend(trackId, amount) {
  const send = trackFxSends.get(trackId);
  if (send) send.gain.setTargetAtTime(amount, getAudioContext().currentTime, 0.01);
}

export function resetTrackBuses() {
  trackGains.forEach(gain => { gain.gain.value = 1.0; });
  trackFxSends.forEach(send => { send.gain.value = 0.0; });
}

export function triggerVoice(instrument, time, velocity = 1.0) {
  const ctx = getAudioContext();
  const dest = getOrCreateTrackBus(instrument.id);
  const { params, type } = instrument;

  switch (type) {
    case 'tone':   return triggerToneVoice(ctx, params, time, velocity, dest);
    case 'noise':  return triggerNoiseVoice(ctx, params, time, velocity, dest);
    case 'hybrid': return triggerHybridVoice(ctx, params, time, velocity, dest);
    case 'multi':  return triggerMultiVoice(ctx, params, time, velocity, dest);
  }
}
