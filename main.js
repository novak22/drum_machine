import { state, INSTRUMENTS, resetInstruments } from './src/state.js';
import {
  initStorage,
  loadFromLocalStorage,
  saveToLocalStorage,
  autosave,
  clearAll,
} from './src/storage.js';
import { initGrid, renderGrid } from './src/ui/grid.js';
import { bindControls } from './src/ui/controls.js';
import { initSoundDesigner, openModal } from './src/ui/sound-designer.js';
import { exportMIDI } from './src/midi/exporter.js';
import { importMIDI } from './src/midi/importer.js';

function showSaveIndicator(msg = 'Saved') {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(showSaveIndicator._timer);
  showSaveIndicator._timer = setTimeout(() => el.classList.remove('visible'), 2000);
}

// Wire autosave so all modules can call autosave() without knowing about the indicator
initStorage(() => showSaveIndicator());

// Load persisted session
loadFromLocalStorage();

// Sync BPM inputs with loaded state
document.getElementById('bpm-input').value  = state.bpm;
document.getElementById('bpm-slider').value = state.bpm;

// Initialize UI modules
initGrid((track) => openModal(track));
renderGrid();
initSoundDesigner();

// Bind transport / footer controls
bindControls({
  onClear() {
    state.pattern = Array(16).fill(null).map(() => Array(16).fill(false));
    renderGrid();
    autosave();
  },
  onReset() {
    if (!confirm('Reset everything to defaults? This will clear the pattern and restore all sound settings.')) return;
    state.pattern = Array(16).fill(null).map(() => Array(16).fill(false));
    resetInstruments();
    clearAll();
    saveToLocalStorage();
    renderGrid();
    showSaveIndicator('Reset complete');
  },
  onImport() {
    importMIDI(INSTRUMENTS, (pattern) => {
      state.pattern = pattern;
      renderGrid();
      autosave();
    });
  },
  onExport() {
    exportMIDI(state.pattern, INSTRUMENTS, state.bpm);
  },
});
