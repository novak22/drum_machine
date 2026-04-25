import { state, INSTRUMENTS } from '../state.js';
import { autosave } from '../storage.js';

let _onLabelClick = null;

export function initGrid(onLabelClick) {
  _onLabelClick = onLabelClick;
}

export function renderGrid() {
  const sequencer = document.getElementById('sequencer');
  sequencer.innerHTML = '';

  for (let track = 0; track < 16; track++) {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'track';
    trackDiv.dataset.track = track;

    const label = document.createElement('div');
    label.className = 'track-label';
    label.textContent = INSTRUMENTS[track].name;
    label.style.cursor = 'pointer';
    label.title = 'Click to edit sound';
    label.addEventListener('click', () => _onLabelClick?.(track));
    trackDiv.appendChild(label);

    for (let step = 0; step < 16; step++) {
      const btn = document.createElement('button');
      btn.className = 'step';
      btn.dataset.track = track;
      btn.dataset.step = step;
      if (state.pattern[track][step]) btn.classList.add('active');
      btn.addEventListener('click', () => toggleStep(track, step));
      trackDiv.appendChild(btn);
    }

    sequencer.appendChild(trackDiv);
  }
}

export function toggleStep(track, step) {
  state.pattern[track][step] = !state.pattern[track][step];
  const btn = document.querySelector(`.step[data-track="${track}"][data-step="${step}"]`);
  btn?.classList.toggle('active', state.pattern[track][step]);
  autosave();
}

export function highlightStep(step) {
  document.querySelectorAll('.step.current').forEach(el => el.classList.remove('current'));
  if (step !== null) {
    document.querySelectorAll(`.step[data-step="${step}"]`).forEach(el => el.classList.add('current'));
  }
}
