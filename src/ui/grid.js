import { state, INSTRUMENTS } from '../state.js';
import { autosave } from '../storage.js';

let _onLabelClick = null;
let _painting = false;
let _paintValue = false;

export function initGrid(onLabelClick) {
  _onLabelClick = onLabelClick;
  document.addEventListener('mouseup', () => { _painting = false; });
}

export function renderGrid() {
  const sequencer = document.getElementById('sequencer');
  sequencer.innerHTML = '';

  const { stepCount } = state;
  const cols = `100px repeat(${stepCount}, 1fr)`;

  // Beat header row
  const header = document.createElement('div');
  header.className = 'beat-header';
  header.style.gridTemplateColumns = cols;

  const spacer = document.createElement('div');
  spacer.className = 'beat-header-spacer';
  header.appendChild(spacer);

  for (let step = 0; step < stepCount; step++) {
    const bar = Math.floor(step / 4);
    const cell = document.createElement('div');
    cell.className = 'beat-cell' +
      (step > 0 && step % 4 === 0 ? ' bar-start' : '') +
      (bar % 2 === 1 ? ' bar-odd' : '');
    cell.textContent = step % 4 === 0 ? String(bar + 1) : '·';
    header.appendChild(cell);
  }
  sequencer.appendChild(header);

  // Track rows
  for (let track = 0; track < 16; track++) {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'track';
    trackDiv.dataset.track = track;
    trackDiv.style.gridTemplateColumns = cols;

    const label = document.createElement('div');
    label.className = 'track-label';
    label.textContent = INSTRUMENTS[track].name;
    label.title = 'Click to edit sound';
    label.addEventListener('click', () => _onLabelClick?.(track));
    trackDiv.appendChild(label);

    for (let step = 0; step < stepCount; step++) {
      const bar = Math.floor(step / 4);
      const btn = document.createElement('button');
      btn.className = 'step' +
        (step > 0 && step % 4 === 0 ? ' bar-start' : '') +
        (bar % 2 === 1 ? ' bar-odd' : '');
      btn.dataset.track = track;
      btn.dataset.step = step;
      if (state.pattern[track][step]) btn.classList.add('active');

      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        _painting = true;
        _paintValue = !state.pattern[track][step];
        applyStep(track, step, _paintValue);
      });

      btn.addEventListener('mouseenter', () => {
        if (_painting) applyStep(track, step, _paintValue);
      });

      trackDiv.appendChild(btn);
    }

    sequencer.appendChild(trackDiv);
  }
}

function applyStep(track, step, value) {
  if (state.pattern[track][step] === value) return;
  state.pattern[track][step] = value;
  const btn = document.querySelector(`.step[data-track="${track}"][data-step="${step}"]`);
  btn?.classList.toggle('active', value);
  autosave();
}

export function toggleStep(track, step) {
  applyStep(track, step, !state.pattern[track][step]);
}

export function highlightStep(step) {
  document.querySelectorAll('.step.current').forEach(el => el.classList.remove('current'));
  if (step !== null) {
    document.querySelectorAll(`.step[data-step="${step}"]`).forEach(el => el.classList.add('current'));
  }
}
