import { state, INSTRUMENTS } from '../state.js';
import { TRACK_COLORS } from '../constants.js';
import { autosave } from '../storage.js';
import { setTrackVolume, setTrackFxSend } from '../audio/engine.js';

let _onLabelClick = null;
let _painting = false;
let _paintValue = false;
let _velDrag = null; // { id, step, startY, startVel }

function isMobile() { return window.innerWidth <= 640; }

export function initGrid(onLabelClick) {
  _onLabelClick = onLabelClick;

  document.getElementById('close-library-btn')?.addEventListener('click', () => {
    if (state.ui.editKitMode) toggleEditMode();
  });

  let _prevMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== _prevMobile) {
      _prevMobile = nowMobile;
      renderGrid();
    }
  });

  document.addEventListener('mouseup', () => {
    _painting = false;
    if (_velDrag) { autosave(); _velDrag = null; }
  });

  document.addEventListener('mousemove', (e) => {
    if (!_velDrag) return;
    const { id, step, startY, startVel } = _velDrag;
    const delta = (startY - e.clientY) / 80;
    state.velocities[id][step] = Math.max(0.05, Math.min(1.0, startVel + delta));
    refreshVelBar(id, step);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main render
// ─────────────────────────────────────────────────────────────────────────────

export function renderGrid() {
  const sequencer = document.getElementById('sequencer');
  sequencer.innerHTML = '';

  const { stepCount } = state;
  const mobile = isMobile();
  const totalBars = Math.ceil(stepCount / 4);

  if (state.ui.mobileBar >= totalBars) state.ui.mobileBar = 0;

  const startStep = mobile ? state.ui.mobileBar * 4 : 0;
  const count = mobile ? Math.min(4, stepCount - startStep) : stepCount;
  const cols = `repeat(${count}, 1fr)`;

  if (!mobile) {
    sequencer.appendChild(buildBeatHeader(stepCount, cols));
  }

  for (const instrumentId of state.activeTrackIndices) {
    sequencer.appendChild(buildTrackRow(instrumentId, count, cols, startStep, mobile));
  }

  sequencer.appendChild(buildAddTrackRow());

  if (state.ui.editKitMode) {
    sequencer.classList.add('edit-mode');
    sequencer.querySelectorAll('.track').forEach(t => { t.draggable = true; });
  }

  syncAllTrackVisuals();

  if (mobile) {
    renderMobileTabs(totalBars);
    renderPageDots(totalBars);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section builders
// ─────────────────────────────────────────────────────────────────────────────

function buildBeatHeader(stepCount, cols) {
  const header = document.createElement('div');
  header.className = 'beat-header';

  const labelSpacer = document.createElement('div');
  labelSpacer.className = 'beat-label-spacer';
  header.appendChild(labelSpacer);

  const mixerSpacer = document.createElement('div');
  mixerSpacer.className = 'beat-mixer-spacer';
  header.appendChild(mixerSpacer);

  const beatCells = document.createElement('div');
  beatCells.className = 'beat-cells';
  beatCells.style.gridTemplateColumns = cols;

  for (let step = 0; step < stepCount; step++) {
    const bar = Math.floor(step / 4);
    const cell = document.createElement('div');
    cell.className = 'beat-cell' +
      (step > 0 && step % 4 === 0 ? ' bar-start' : '') +
      (bar % 2 === 1 ? ' bar-odd' : '');
    cell.textContent = step % 4 === 0 ? String(bar + 1) : '·';
    beatCells.appendChild(cell);
  }
  header.appendChild(beatCells);

  const fxSpacer = document.createElement('div');
  fxSpacer.className = 'beat-fx-spacer';
  header.appendChild(fxSpacer);

  return header;
}

function buildTrackRow(instrumentId, count, cols, startStep, mobile) {
  const t = state.tracks[instrumentId];
  const color = TRACK_COLORS[instrumentId];

  const row = document.createElement('div');
  row.className = 'track';
  row.dataset.track = instrumentId;
  row.style.setProperty('--track-color', color);

  // Label with × remove button
  const label = document.createElement('div');
  label.className = 'track-label';
  label.title = 'Click to edit sound';
  label.addEventListener('click', () => _onLabelClick?.(instrumentId));

  const labelText = document.createElement('span');
  labelText.className = 'label-text';
  labelText.textContent = INSTRUMENTS[instrumentId].name;
  label.appendChild(labelText);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = '×';
  removeBtn.title = `Remove ${INSTRUMENTS[instrumentId].name}`;
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!confirm(`Remove ${INSTRUMENTS[instrumentId].name} from the kit?`)) return;
    state.activeTrackIndices = state.activeTrackIndices.filter(id => id !== instrumentId);
    renderGrid();
    renderLibrary();
    autosave();
  });
  label.appendChild(removeBtn);
  row.appendChild(label);

  row.appendChild(buildMixerStrip(instrumentId, t));
  row.appendChild(buildStepsColumn(instrumentId, count, cols, color, startStep, mobile));
  row.appendChild(buildFxStrip(instrumentId, t));

  attachDragHandlers(row, instrumentId);

  return row;
}

function buildMixerStrip(id, t) {
  const strip = document.createElement('div');
  strip.className = 'mixer-strip';

  const msRow = document.createElement('div');
  msRow.className = 'ms-buttons';

  const muteBtn = document.createElement('button');
  muteBtn.className = 'mute-btn' + (t.muted ? ' active' : '');
  muteBtn.textContent = 'M';
  muteBtn.title = 'Mute';
  muteBtn.addEventListener('click', () => {
    state.tracks[id].muted = !state.tracks[id].muted;
    syncAllTrackVisuals();
    autosave();
  });

  const soloBtn = document.createElement('button');
  soloBtn.className = 'solo-btn' + (t.solo ? ' active' : '');
  soloBtn.textContent = 'S';
  soloBtn.title = 'Solo';
  soloBtn.addEventListener('click', () => {
    state.tracks[id].solo = !state.tracks[id].solo;
    syncAllTrackVisuals();
    autosave();
  });

  msRow.appendChild(muteBtn);
  msRow.appendChild(soloBtn);
  strip.appendChild(msRow);

  const volSlider = document.createElement('input');
  volSlider.type = 'range';
  volSlider.className = 'vol-slider';
  volSlider.min = 0; volSlider.max = 1; volSlider.step = 0.01;
  volSlider.value = t.volume;
  volSlider.title = `Volume: ${Math.round(t.volume * 100)}%`;
  volSlider.addEventListener('input', () => {
    const vol = parseFloat(volSlider.value);
    state.tracks[id].volume = vol;
    setTrackVolume(id, vol);
    autosave();
  });
  strip.appendChild(volSlider);

  return strip;
}

function buildStepsColumn(id, count, cols, color, startStep = 0, mobile = false) {
  const col = document.createElement('div');
  col.className = 'steps-column';

  const stepRow = document.createElement('div');
  stepRow.className = 'step-row';
  stepRow.style.gridTemplateColumns = cols;

  for (let i = 0; i < count; i++) {
    const step = startStep + i;
    const bar = Math.floor(step / 4);
    const btn = document.createElement('button');
    btn.className = 'step' +
      (!mobile && step > 0 && step % 4 === 0 ? ' bar-start' : '') +
      (bar % 2 === 1 ? ' bar-odd' : '');
    btn.dataset.track = id;
    btn.dataset.step = step;
    if (state.pattern[id][step]) btn.classList.add('active');

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      _painting = true;
      _paintValue = !state.pattern[id][step];
      applyStep(id, step, _paintValue);
    });
    btn.addEventListener('mouseenter', () => {
      if (_painting) applyStep(id, step, _paintValue);
    });
    stepRow.appendChild(btn);
  }
  col.appendChild(stepRow);

  const velRow = document.createElement('div');
  velRow.className = 'vel-row';
  velRow.style.gridTemplateColumns = cols;

  for (let i = 0; i < count; i++) {
    const step = startStep + i;
    const cell = document.createElement('div');
    cell.className = 'vel-cell';
    cell.dataset.track = id;
    cell.dataset.step = step;

    const bar = document.createElement('div');
    bar.className = 'vel-bar';
    bar.style.height = `${state.velocities[id][step] * 100}%`;
    bar.style.background = state.pattern[id][step] ? color : 'rgba(255,255,255,0.15)';
    cell.appendChild(bar);

    cell.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      _velDrag = { id, step, startY: e.clientY, startVel: state.velocities[id][step] };
    });
    velRow.appendChild(cell);
  }
  col.appendChild(velRow);

  return col;
}

function buildFxStrip(id, t) {
  const strip = document.createElement('div');
  strip.className = 'fx-strip';

  const lbl = document.createElement('span');
  lbl.className = 'fx-label';
  lbl.textContent = 'FX';
  strip.appendChild(lbl);

  const fxSlider = document.createElement('input');
  fxSlider.type = 'range';
  fxSlider.className = 'fx-slider';
  fxSlider.min = 0; fxSlider.max = 1; fxSlider.step = 0.01;
  fxSlider.value = t.fxSend;
  fxSlider.title = `Reverb send: ${Math.round(t.fxSend * 100)}%`;
  fxSlider.addEventListener('input', () => {
    const amt = parseFloat(fxSlider.value);
    state.tracks[id].fxSend = amt;
    setTrackFxSend(id, amt);
    autosave();
  });
  strip.appendChild(fxSlider);

  return strip;
}

function buildAddTrackRow() {
  const row = document.createElement('div');
  row.className = 'add-track-row';
  row.textContent = '+ Add instrument';
  row.addEventListener('click', () => {
    if (!state.ui.editKitMode) toggleEditMode();
  });
  return row;
}

// ─────────────────────────────────────────────────────────────────────────────
// Drag-to-reorder
// ─────────────────────────────────────────────────────────────────────────────

function attachDragHandlers(row, instrumentId) {
  row.addEventListener('dragstart', (e) => {
    if (!state.ui.editKitMode) { e.preventDefault(); return; }
    e.dataTransfer.setData('text/plain', String(instrumentId));
    e.dataTransfer.effectAllowed = 'move';
    row.classList.add('dragging');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    document.querySelectorAll('.track').forEach(t =>
      t.classList.remove('drag-over-top', 'drag-over-bottom'));
  });

  row.addEventListener('dragover', (e) => {
    if (!state.ui.editKitMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = row.getBoundingClientRect();
    const above = e.clientY < rect.top + rect.height / 2;
    row.classList.toggle('drag-over-top', above);
    row.classList.toggle('drag-over-bottom', !above);
  });

  row.addEventListener('dragleave', (e) => {
    if (!row.contains(e.relatedTarget)) {
      row.classList.remove('drag-over-top', 'drag-over-bottom');
    }
  });

  row.addEventListener('drop', (e) => {
    if (!state.ui.editKitMode) return;
    e.preventDefault();
    row.classList.remove('drag-over-top', 'drag-over-bottom');

    const srcId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (srcId === instrumentId) return;

    const rect = row.getBoundingClientRect();
    const insertBefore = e.clientY < rect.top + rect.height / 2;

    const srcIdx = state.activeTrackIndices.indexOf(srcId);
    state.activeTrackIndices.splice(srcIdx, 1);

    const dstIdx = state.activeTrackIndices.indexOf(instrumentId);
    state.activeTrackIndices.splice(insertBefore ? dstIdx : dstIdx + 1, 0, srcId);

    renderGrid();
    renderLibrary();
    autosave();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit-kit mode
// ─────────────────────────────────────────────────────────────────────────────

export function toggleEditMode() {
  state.ui.editKitMode = !state.ui.editKitMode;
  const seq = document.getElementById('sequencer');
  const lib = document.getElementById('kit-library');
  const btn = document.getElementById('edit-kit-btn');

  seq.classList.toggle('edit-mode', state.ui.editKitMode);
  lib.classList.toggle('open', state.ui.editKitMode);

  document.querySelectorAll('.track').forEach(t => {
    t.draggable = state.ui.editKitMode;
  });

  if (btn) {
    btn.textContent = state.ui.editKitMode ? 'Done' : 'Edit Kit';
    btn.classList.toggle('active', state.ui.editKitMode);
  }

  if (state.ui.editKitMode) renderLibrary();
}

// ─────────────────────────────────────────────────────────────────────────────
// Library
// ─────────────────────────────────────────────────────────────────────────────

export function renderLibrary() {
  const container = document.getElementById('library-items');
  if (!container) return;
  container.innerHTML = '';

  const activeSet = new Set(state.activeTrackIndices);
  const available = INSTRUMENTS.filter(inst => !activeSet.has(inst.id));

  if (available.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'lib-empty';
    msg.textContent = 'All instruments are in use';
    container.appendChild(msg);
    return;
  }

  available.forEach(inst => {
    const color = TRACK_COLORS[inst.id];
    const item = document.createElement('div');
    item.className = 'library-item';
    item.style.setProperty('--item-color', color);

    const swatch = document.createElement('span');
    swatch.className = 'lib-swatch';

    const nameEl = document.createElement('span');
    nameEl.className = 'lib-name';
    nameEl.textContent = inst.name;

    const typeEl = document.createElement('span');
    typeEl.className = 'lib-type';
    typeEl.textContent = inst.type;

    const addBtn = document.createElement('button');
    addBtn.className = 'lib-add-btn';
    addBtn.textContent = '+';
    addBtn.title = `Add ${inst.name}`;
    addBtn.addEventListener('click', () => {
      state.activeTrackIndices.push(inst.id);
      renderGrid();
      renderLibrary();
      autosave();
    });

    item.appendChild(swatch);
    item.appendChild(nameEl);
    item.appendChild(typeEl);
    item.appendChild(addBtn);
    container.appendChild(item);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile bar navigation
// ─────────────────────────────────────────────────────────────────────────────

function renderMobileTabs(totalBars) {
  const container = document.getElementById('mobile-bar-tabs');
  if (!container) return;
  container.innerHTML = '';
  for (let b = 0; b < totalBars; b++) {
    const btn = document.createElement('button');
    btn.className = 'bar-tab' + (b === state.ui.mobileBar ? ' active' : '');
    btn.textContent = `Bar ${b + 1}`;
    btn.addEventListener('click', () => {
      state.ui.mobileBar = b;
      renderGrid();
    });
    container.appendChild(btn);
  }
}

function renderPageDots(totalBars) {
  const container = document.getElementById('page-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let b = 0; b < totalBars; b++) {
    const dot = document.createElement('div');
    dot.className = 'page-dot' + (b === state.ui.mobileBar ? ' active' : '');
    container.appendChild(dot);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step helpers
// ─────────────────────────────────────────────────────────────────────────────

function applyStep(id, step, value) {
  if (state.pattern[id][step] === value) return;
  state.pattern[id][step] = value;
  const btn = document.querySelector(`.step[data-track="${id}"][data-step="${step}"]`);
  btn?.classList.toggle('active', value);
  refreshVelBar(id, step);
  autosave();
}

function refreshVelBar(id, step) {
  const cell = document.querySelector(`.vel-cell[data-track="${id}"][data-step="${step}"]`);
  if (!cell) return;
  const bar = cell.querySelector('.vel-bar');
  if (!bar) return;
  bar.style.height = `${state.velocities[id][step] * 100}%`;
  bar.style.background = state.pattern[id][step]
    ? TRACK_COLORS[id]
    : 'rgba(255,255,255,0.15)';
}

function syncAllTrackVisuals() {
  const anySolo = state.activeTrackIndices.some(id => state.tracks[id].solo);

  for (const id of state.activeTrackIndices) {
    const t = state.tracks[id];
    const row = document.querySelector(`.track[data-track="${id}"]`);
    if (!row) continue;

    row.classList.toggle('is-dimmed', t.muted || (anySolo && !t.solo));
    row.querySelector('.mute-btn')?.classList.toggle('active', t.muted);
    row.querySelector('.solo-btn')?.classList.toggle('active', t.solo);
  }
}

export function toggleStep(id, step) {
  applyStep(id, step, !state.pattern[id][step]);
}

export function highlightStep(step) {
  if (step !== null && isMobile()) {
    const bar = Math.floor(step / 4);
    if (bar !== state.ui.mobileBar) {
      state.ui.mobileBar = bar;
      renderGrid();
    }
  }
  document.querySelectorAll('.step.current').forEach(el => el.classList.remove('current'));
  if (step !== null) {
    document.querySelectorAll(`.step[data-step="${step}"]`).forEach(el => el.classList.add('current'));
  }
}
