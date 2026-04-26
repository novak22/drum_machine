import { SONG_PRESET_CATEGORIES } from '../song-presets.js';
import { state, loadPatternById } from '../state.js';
import { autosave } from '../storage.js';

let _callbacks = null;
let _activeCategoryIndex = 0;

export function initPresetsModal(callbacks) {
  _callbacks = callbacks;

  const modal = document.getElementById('presets-modal');
  document.getElementById('presets-modal-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  _renderTabs();
  _renderCards();
}

export function openPresetsModal() {
  document.getElementById('presets-modal')?.classList.add('open');
}

function closeModal() {
  document.getElementById('presets-modal')?.classList.remove('open');
}

function _renderTabs() {
  const tabBar = document.getElementById('presets-tabs');
  if (!tabBar) return;
  tabBar.innerHTML = '';

  SONG_PRESET_CATEGORIES.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'preset-tab' + (i === _activeCategoryIndex ? ' active' : '');
    btn.textContent = cat.name;
    btn.addEventListener('click', () => {
      _activeCategoryIndex = i;
      tabBar.querySelectorAll('.preset-tab').forEach((t, j) =>
        t.classList.toggle('active', j === i)
      );
      _renderCards();
    });
    tabBar.appendChild(btn);
  });
}

function _renderCards() {
  const grid = document.getElementById('presets-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const category = SONG_PRESET_CATEGORIES[_activeCategoryIndex];
  category.presets.forEach(preset => {
    const card = document.createElement('button');
    card.className = 'preset-card';
    card.innerHTML = `
      <span class="preset-card-name">${preset.name}</span>
      <span class="preset-card-bpm">${preset.bpm} BPM${preset.patterns.A.swing ? ` · ${preset.patterns.A.swing}% swing` : ''}</span>
      <span class="preset-card-desc">${preset.description}</span>
    `;
    card.addEventListener('click', () => _loadPreset(preset));
    grid.appendChild(card);
  });
}

function _loadPreset(preset) {
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
