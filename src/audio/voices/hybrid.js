export function triggerHybridVoice(ctx, params, time, velocity = 1.0) {
  // Tone component
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = params.tonePitch;

  const toneGain = ctx.createGain();
  const tonePeak = params.gain * params.toneMix * velocity;
  toneGain.gain.setValueAtTime(tonePeak, time);
  toneGain.gain.exponentialRampToValueAtTime(0.01, time + params.toneDecay);

  osc.connect(toneGain);
  toneGain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + params.toneDecay);

  // Noise component
  const noiseSize = Math.ceil(ctx.sampleRate * params.noiseDecay);
  const noiseBuffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = params.noiseFilterType;
  noiseFilter.frequency.value = params.noiseFilterFreq;

  const noiseGain = ctx.createGain();
  const noisePeak = params.gain * params.noiseMix * velocity;
  noiseGain.gain.setValueAtTime(noisePeak, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + params.noiseDecay);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(time);
}
