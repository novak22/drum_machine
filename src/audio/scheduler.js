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

  for (let track = 0; track < 16; track++) {
    if (state.pattern[track][step]) {
      triggerVoice(INSTRUMENTS[track], time, 1.0);
    }
  }

  const delay = Math.max(0, (time - ctx.currentTime) * 1000);
  if (_onStep) setTimeout(() => _onStep(step), delay);
}

function advanceStep() {
  nextNoteTime += getStepDuration();
  state.currentStep = (state.currentStep + 1) % 16;
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
