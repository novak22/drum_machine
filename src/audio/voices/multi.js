export function triggerMultiVoice(ctx, params, time, velocity = 1.0, dest = ctx.destination) {
  for (let i = 0; i < params.bursts; i++) {
    const burstTime = time + i * params.burstDelay;
    const bufferSize = Math.ceil(ctx.sampleRate * params.noiseDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      data[j] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = params.filterType;
    filter.frequency.value = params.filterFreq;

    const gain = ctx.createGain();
    const peakGain = params.gain * velocity;
    gain.gain.setValueAtTime(peakGain, burstTime);
    gain.gain.exponentialRampToValueAtTime(0.01, burstTime + params.decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(burstTime);
  }
}
