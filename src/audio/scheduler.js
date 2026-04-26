import { state, INSTRUMENTS } from '../state.js';
import { getAudioContext, triggerVoice } from './engine.js';

const SCHEDULE_AHEAD_TIME = 0.1;
const SCHEDULER_INTERVAL  = 25;

let schedulerTimer = null;
let nextNoteTime   = 0;
let _onStep        = null;

function getStepDuration() {
  return (60.0 / state.bpm) / 4;
}

function scheduleNote(step, time) {
  const ctx = getAudioContext();
  const anySolo = state.activeTrackIndices.some(id => state.tracks[id].solo);

  for (const id of state.activeTrackIndices) {
    const t = state.tracks[id];
    if (t.muted) continue;
    if (anySolo && !t.solo) continue;
    if (state.pattern[id][step]) {
      triggerVoice(INSTRUMENTS[id], time, state.velocities[id][step]);
    }
  }

  const delay = Math.max(0, (time - ctx.currentTime) * 1000);
  if (_onStep) setTimeout(() => _onStep(step), delay);
}

function advanceStep() {
  nextNoteTime += getStepDuration();
  state.currentStep = (state.currentStep + 1) % state.stepCount;
}

function tick() {
  const ctx = getAudioContext();
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleNote(state.currentStep, nextNoteTime);
    advanceStep();
  }
}

export function startPlayback(onStep) {
  if (state.isPlaying) return;

  _onStep = onStep ?? null;
  const ctx = getAudioContext();
  state.isPlaying = true;
  state.currentStep = 0;
  nextNoteTime = ctx.currentTime;
  schedulerTimer = setInterval(tick, SCHEDULER_INTERVAL);
}

export function stopPlayback() {
  if (!state.isPlaying) return;

  state.isPlaying = false;
  clearInterval(schedulerTimer);
  schedulerTimer = null;
  _onStep = null;
}
