import { state } from '../state.js';
import { autosave } from '../storage.js';
import { startPlayback, stopPlayback } from '../audio/scheduler.js';
import { highlightStep, renderGrid } from './grid.js';

export function bindControls({ onClear, onReset, onImport, onExport, onStepCountChange, onEditKitToggle }) {
  const bpmInput  = document.getElementById('bpm-input');
  const bpmSlider = document.getElementById('bpm-slider');

  bpmInput.addEventListener('input', (e) => {
    const value = Math.max(60, Math.min(180, parseInt(e.target.value) || 120));
    state.bpm = value;
    bpmSlider.value = value;
    autosave();
  });

  bpmSlider.addEventListener('input', (e) => {
    state.bpm = parseInt(e.target.value, 10);
    bpmInput.value = state.bpm;
    autosave();
  });

  document.getElementById('play-btn').addEventListener('click', () => {
    startPlayback(highlightStep);
  });

  document.getElementById('stop-btn').addEventListener('click', () => {
    stopPlayback();
    highlightStep(null);
  });

  document.getElementById('edit-kit-btn').addEventListener('click', onEditKitToggle);
  document.getElementById('clear-btn').addEventListener('click', onClear);
  document.getElementById('reset-btn').addEventListener('click', onReset);
  document.getElementById('import-btn').addEventListener('click', onImport);
  document.getElementById('export-btn').addEventListener('click', onExport);

  document.querySelectorAll('[data-steps]').forEach(chip => {
    chip.classList.toggle('active', parseInt(chip.dataset.steps) === state.stepCount);
    chip.addEventListener('click', () => {
      onStepCountChange?.(parseInt(chip.dataset.steps, 10));
      document.querySelectorAll('[data-steps]').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.steps) === state.stepCount);
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code !== 'Space') return;

    e.preventDefault();
    if (state.isPlaying) {
      stopPlayback();
      highlightStep(null);
    } else {
      startPlayback(highlightStep);
    }
  });
}
