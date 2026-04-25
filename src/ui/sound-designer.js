import { state, INSTRUMENTS } from '../state.js';
import { loadUserPresets, saveUserPresets, autosave } from '../storage.js';
import { BUILTIN_PRESETS, PARAM_OPTIONS, PARAM_LIMITS } from '../constants.js';
import { getAudioContext, triggerVoice } from '../audio/engine.js';

let userPresets = {};

export function initSoundDesigner() {
  userPresets = loadUserPresets();
  _bindModalEvents();
}

export function openModal(trackIndex) {
  state.ui.selectedTrack = trackIndex;
  state.ui.modalOpen = true;

  const instrument = INSTRUMENTS[trackIndex];
  state.ui.tempParams = structuredClone(instrument.params);

  document.getElementById('modal-title').textContent = `Edit: ${instrument.name}`;
  _renderParamControls(instrument);
  _populatePresetDropdown(instrument.type);

  document.getElementById('sound-designer-modal').classList.add('open');
}

function closeModal() {
  state.ui.modalOpen = false;
  state.ui.selectedTrack = null;
  state.ui.tempParams = null;
  document.getElementById('sound-designer-modal').classList.remove('open');
}

function applyParams() {
  if (state.ui.selectedTrack === null) return;
  INSTRUMENTS[state.ui.selectedTrack].params = structuredClone(state.ui.tempParams);
  autosave();
  closeModal();
}

function previewSound() {
  if (state.ui.selectedTrack === null) return;
  const ctx = getAudioContext();
  triggerVoice(
    { ...INSTRUMENTS[state.ui.selectedTrack], params: state.ui.tempParams },
    ctx.currentTime,
    1.0
  );
}

function _populatePresetDropdown(voiceType) {
  const sel = document.getElementById('preset-select');
  sel.innerHTML = '<option value="">— Presets —</option>';

  const builtin = BUILTIN_PRESETS[voiceType] ?? [];
  if (builtin.length) {
    const grp = document.createElement('optgroup');
    grp.label = 'Built-in';
    builtin.forEach((p, i) => {
      const opt = document.createElement('option');
      opt.value = `builtin:${i}`;
      opt.textContent = p.name;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  }

  const user = userPresets[voiceType] ?? [];
  if (user.length) {
    const grp = document.createElement('optgroup');
    grp.label = 'My Presets';
    user.forEach((p, i) => {
      const opt = document.createElement('option');
      opt.value = `user:${i}`;
      opt.textContent = p.name;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  }
}

function _loadSelectedPreset() {
  const sel = document.getElementById('preset-select');
  if (!sel.value) return;

  const instrument = INSTRUMENTS[state.ui.selectedTrack];
  const [kind, idx] = sel.value.split(':');
  const presets = kind === 'builtin'
    ? (BUILTIN_PRESETS[instrument.type] ?? [])
    : (userPresets[instrument.type] ?? []);

  const preset = presets[parseInt(idx, 10)];
  if (!preset) return;

  state.ui.tempParams = structuredClone(preset.params);
  _renderParamControls(instrument);
}

function _saveCurrentAsPreset() {
  const name = prompt('Preset name:');
  if (!name?.trim()) return;

  const type = INSTRUMENTS[state.ui.selectedTrack].type;
  if (!userPresets[type]) userPresets[type] = [];
  userPresets[type].push({ name: name.trim(), params: structuredClone(state.ui.tempParams) });

  saveUserPresets(userPresets);
  _populatePresetDropdown(type);
}

function _renderParamControls(instrument) {
  const container = document.getElementById('param-controls');
  container.innerHTML = '';

  const params = state.ui.tempParams;

  Object.keys(params).forEach(key => {
    const row = document.createElement('div');
    row.className = 'param-row';

    const label = document.createElement('label');
    label.textContent = _formatParamLabel(key);
    label.htmlFor = `param-${key}`;
    row.appendChild(label);

    const value = params[key];

    if (typeof value === 'string') {
      const select = document.createElement('select');
      select.id = `param-${key}`;
      (PARAM_OPTIONS[key] ?? []).forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });
      select.value = value;
      select.addEventListener('change', e => { state.ui.tempParams[key] = e.target.value; });
      row.appendChild(select);
    } else {
      const limits = PARAM_LIMITS[key] ?? { min: 0, max: 1, step: 0.01 };

      const range = document.createElement('input');
      range.type = 'range';
      range.id = `param-${key}`;
      range.min = limits.min;
      range.max = limits.max;
      range.step = limits.step;
      range.value = value;

      const number = document.createElement('input');
      number.type = 'number';
      number.min = limits.min;
      number.max = limits.max;
      number.step = limits.step;
      number.value = value;

      range.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        number.value = val;
        state.ui.tempParams[key] = val;
      });

      number.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        range.value = val;
        state.ui.tempParams[key] = val;
      });

      row.appendChild(range);
      row.appendChild(number);
    }

    container.appendChild(row);
  });
}

function _formatParamLabel(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

function _bindModalEvents() {
  const modal = document.getElementById('sound-designer-modal');

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('cancel-params-btn').addEventListener('click', closeModal);
  document.getElementById('apply-params-btn').addEventListener('click', applyParams);
  document.getElementById('preview-sound-btn').addEventListener('click', previewSound);
  document.getElementById('load-preset-btn').addEventListener('click', _loadSelectedPreset);
  document.getElementById('save-preset-btn').addEventListener('click', _saveCurrentAsPreset);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === 'Escape' && state.ui.modalOpen) closeModal();
  });
}
