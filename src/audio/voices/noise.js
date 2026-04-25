export function triggerNoiseVoice(ctx, params, time, velocity = 1.0) {
  const bufferSize = Math.ceil(ctx.sampleRate * params.noiseDuration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = params.filterType;
  filter.frequency.value = params.filterFreq;
  filter.Q.value = params.filterQ;

  const gainNode = ctx.createGain();
  const peakGain = params.gain * velocity;
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(peakGain, time + params.attackTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, time + params.attackTime + params.decayTime);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(time);
}
