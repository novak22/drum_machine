import { state, INSTRUMENTS, saveCurrentToPattern, loadPatternById } from '../state.js';
import { getAudioContext, triggerVoice } from './engine.js';

const SCHEDULE_AHEAD_TIME = 0.1;
const SCHEDULER_INTERVAL  = 25;

let schedulerTimer = null;
let nextNoteTime   = 0;
let _onStep        = null;
let _onRender      = null;

function getStepDuration() {
  return (60.0 / state.bpm) / 4;
}

function getSwingOffset(step) {
  if (!state.swing || step % 2 === 0) return 0;
  return getStepDuration() * (state.swing / 100);
}

function scheduleNote(step, time) {
  const ctx = getAudioContext();
  const audioTime = time + getSwingOffset(step);
  const anySolo = state.activeTrackIndices.some(id => state.tracks[id].solo);

  for (const id of state.activeTrackIndices) {
    const t = state.tracks[id];
    if (t.muted) continue;
    if (anySolo && !t.solo) continue;
    if (state.pattern[id][step]) {
      triggerVoice(INSTRUMENTS[id], audioTime, state.velocities[id][step]);
    }
  }

  const delay = Math.max(0, (time - ctx.currentTime) * 1000);
  if (_onStep || _onRender) {
    setTimeout(() => {
      if (state._renderPending) {
        state._renderPending = false;
        _onRender?.();
      }
      _onStep?.(step);
    }, delay);
  }
}

function advanceStep() {
  nextNoteTime += getStepDuration();
  const nextStep = (state.currentStep + 1) % state.stepCount;

  if (nextStep === 0 && state.songChain.length > 1) {
    const nextPos = (state.songChainPosition + 1) % state.songChain.length;
    const nextId  = state.songChain[nextPos];
    if (nextId !== state.activePatternId) {
      saveCurrentToPattern();
      state.songChainPosition = nextPos;
      loadPatternById(nextId);
      state._renderPending = true;
    } else {
      state.songChainPosition = nextPos;
    }
  }

  state.currentStep = nextStep;
}

function tick() {
  const ctx = getAudioContext();
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleNote(state.currentStep, nextNoteTime);
    advanceStep();
  }
}

export function startPlayback(onStep, onRender) {
  if (state.isPlaying) return;

  _onStep   = onStep  ?? null;
  _onRender = onRender ?? null;
  const ctx = getAudioContext();
  state.isPlaying        = true;
  state.currentStep      = 0;
  state.songChainPosition = 0;
  nextNoteTime = ctx.currentTime;
  schedulerTimer = setInterval(tick, SCHEDULER_INTERVAL);
}

export function stopPlayback() {
  if (!state.isPlaying) return;

  state.isPlaying = false;
  clearInterval(schedulerTimer);
  schedulerTimer = null;
  _onStep   = null;
  _onRender = null;
}
