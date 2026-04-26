import { SONG_PRESETS } from '../song-presets.js';
import { state, loadPatternById } from '../state.js';
import { autosave } from '../storage.js';

let _callbacks = null;

export function initPresetsModal(callbacks) {
  _callbacks = callbacks;

  const modal = document.getElementById('presets-modal');
  const closeBtn = document.getElementById('presets-modal-close');

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  _renderCards();
}

export function openPresetsModal() {
  document.getElementById('presets-modal')?.classList.add('open');
}

function closeModal() {
  document.getElementById('presets-modal')?.classList.remove('open');
}

function _renderCards() {
  const grid = document.getElementById('presets-grid');
  if (!grid) return;
  grid.innerHTML = '';

  SONG_PRESETS.forEach((preset, i) => {
    const card = document.createElement('button');
    card.className = 'preset-card';
    card.innerHTML = `
      <span class="preset-card-name">${preset.name}</span>
      <span class="preset-card-bpm">${preset.bpm} BPM</span>
      <span class="preset-card-desc">${preset.description}</span>
    `;
    card.addEventListener('click', () => _loadPreset(preset));
    grid.appendChild(card);
  });
}

function _loadPreset(preset) {
  const hasContent = Object.values(state.patterns).some(bundle =>
    bundle.pattern.some(row => row.some(Boolean))
  );

  if (hasContent && !confirm(`Load "${preset.name}"? This will replace all current patterns.`)) return;

  // Deep-clone preset patterns so edits don't mutate the preset definitions
  state.patterns = {};
  Object.entries(preset.patterns).forEach(([id, bundle]) => {
    state.patterns[id] = {
      stepCount: bundle.stepCount,
      swing: bundle.swing,
      pattern: bundle.pattern.map(row => [...row]),
      velocities: bundle.velocities.map(row => [...row]),
      activeTrackIndices: [...bundle.activeTrackIndices],
      tracks: bundle.tracks.map(t => ({ ...t })),
    };
  });

  state.bpm = preset.bpm;
  state.songChain = [...preset.songChain];
  state.songChainPosition = 0;
  loadPatternById(preset.activePatternId);

  closeModal();
  autosave();
  _callbacks?.onLoaded();
}
