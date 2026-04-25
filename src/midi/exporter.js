export function exportMIDI(pattern, instruments, bpm) {
  if (typeof MidiWriter === 'undefined') {
    alert('MIDI library not loaded yet. Please try again.');
    return;
  }

  const track = new MidiWriter.Track();
  track.setTempo(bpm);

  const events = [];
  for (let step = 0; step < 16; step++) {
    for (let trackIdx = 0; trackIdx < 16; trackIdx++) {
      if (pattern[trackIdx][step]) {
        const gain = instruments[trackIdx].params.gain ?? 1.0;
        const velocity = Math.round(Math.min(127, Math.max(1, gain * 100)));
        events.push({ step, pitch: instruments[trackIdx].gmNote, velocity });
      }
    }
  }

  events.sort((a, b) => a.step - b.step);

  let currentStep = 0;
  events.forEach(event => {
    const stepDiff = event.step - currentStep;
    track.addEvent(new MidiWriter.NoteEvent({
      pitch: event.pitch,
      duration: '16',
      velocity: event.velocity,
      channel: 10,
      ...(stepDiff > 0 && { wait: 'T' + (stepDiff * 128) }),
    }));
    if (stepDiff > 0) currentStep = event.step;
  });

  const writer = new MidiWriter.Writer(track);
  const blob = new Blob([writer.buildFile()], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'drum-pattern.mid';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
