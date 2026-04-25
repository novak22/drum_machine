function midiToPattern(midiData, instruments) {
  const pattern = Array(16).fill(null).map(() => Array(16).fill(false));

  if (!midiData.track) return pattern;

  let drumTrack = midiData.track.find(t =>
    t.event?.some(e => e.channel === 9)
  ) ?? midiData.track[0];

  if (!drumTrack?.event) return pattern;

  const ppq = midiData.timeDivision || 480;
  const ticksPerStep = ppq / 4;
  let currentTick = 0;

  drumTrack.event.forEach(event => {
    currentTick += event.deltaTime || 0;

    if (event.type === 9 && event.data?.length >= 2) {
      const note     = event.data[0];
      const velocity = event.data[1];
      if (velocity === 0) return;

      const trackIdx = instruments.findIndex(inst => inst.gmNote === note);
      if (trackIdx === -1) return;

      const step = Math.floor(currentTick / ticksPerStep) % 16;
      pattern[trackIdx][step] = true;
    }
  });

  return pattern;
}

export function importMIDI(instruments, onSuccess) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.mid,.midi';

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const midiData = MidiParser.parse(new Uint8Array(arrayBuffer));
      const pattern = midiToPattern(midiData, instruments);
      onSuccess(pattern);
    } catch (error) {
      console.error('MIDI import error:', error);
      alert("Failed to import MIDI file. Please ensure it's a valid MIDI file.");
    }
  });

  input.click();
}
