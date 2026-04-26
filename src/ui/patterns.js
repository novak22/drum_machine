import { state, saveCurrentToPattern, loadPatternById, createPattern } from '../state.js';
import { autosave } from '../storage.js';
import { renderGrid } from './grid.js';

const PATTERN_LETTERS = 'ABCDEFGH';

export function renderPatternBank() {
  const bank = document.getElementById('pattern-bank');
  if (!bank) return;
  bank.innerHTML = '';

  const ids = Object.keys(state.patterns).sort();
  ids.forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'pattern-chip' + (id === state.activePatternId ? ' active' : '');
    btn.textContent = id;
    btn.title = `Pattern ${id}`;
    btn.addEventListener('click', () => {
      if (id === state.activePatternId) return;
      saveCurrentToPattern();
      loadPatternById(id);
      renderGrid();
      renderPatternBank();
      renderSongChain();
      autosave();
    });
    bank.appendChild(btn);
  });

  // Show + button only if there are slots left
  const newBtn = document.getElementById('new-pattern-btn');
  if (newBtn) {
    const hasSlots = PATTERN_LETTERS.split('').some(l => !state.patterns[l]);
    newBtn.style.display = hasSlots ? '' : 'none';
  }

  // Sync swing slider to active pattern
  const swingSlider = document.getElementById('swing-slider');
  const swingValue  = document.getElementById('swing-value');
  if (swingSlider) {
    swingSlider.value = state.swing;
    if (swingValue) swingValue.textContent = `${state.swing}%`;
  }
}

export function renderSongChain() {
  const chain = document.getElementById('song-chain');
  if (!chain) return;
  chain.innerHTML = '';

  state.songChain.forEach((id, i) => {
    if (i > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'chain-arrow';
      arrow.textContent = '›';
      chain.appendChild(arrow);
    }

    const chip = document.createElement('button');
    const isPlaying = state.isPlaying && i === state.songChainPosition;
    chip.className = 'chain-chip' + (isPlaying ? ' playing' : '');
    chip.textContent = id;
    chip.title = 'Click to remove';
    chip.addEventListener('click', () => {
      if (state.songChain.length <= 1) return;
      state.songChain.splice(i, 1);
      if (state.songChainPosition >= state.songChain.length) {
        state.songChainPosition = 0;
      }
      renderSongChain();
      autosave();
    });
    chain.appendChild(chip);
  });
}

export function initPatterns() {
  document.getElementById('new-pattern-btn')?.addEventListener('click', () => {
    const next = PATTERN_LETTERS.split('').find(l => !state.patterns[l]);
    if (!next) return;
    createPattern(next);
    loadPatternById(next);
    if (!state.songChain.includes(next)) state.songChain.push(next);
    renderGrid();
    renderPatternBank();
    renderSongChain();
    autosave();
  });

  document.getElementById('song-add-btn')?.addEventListener('click', () => {
    state.songChain.push(state.activePatternId);
    renderSongChain();
    autosave();
  });

  const swingSlider = document.getElementById('swing-slider');
  const swingValue  = document.getElementById('swing-value');
  swingSlider?.addEventListener('input', () => {
    const val = parseInt(swingSlider.value, 10);
    state.swing = val;
    if (swingValue) swingValue.textContent = `${val}%`;
    autosave();
  });
}
