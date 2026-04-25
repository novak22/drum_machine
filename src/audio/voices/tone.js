export function triggerToneVoice(ctx, params, time, velocity = 1.0) {
  const osc = ctx.createOscillator();
  osc.type = params.oscType || 'sine';

  const startPitch = params.pitchStart * (velocity * 0.2 + 0.8);
  osc.frequency.setValueAtTime(startPitch, time);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(params.pitchEnd, 1),
    time + params.pitchDecay
  );

  const gainNode = ctx.createGain();
  const peakGain = params.gain * velocity;
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(peakGain, time + params.attackTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, time + params.attackTime + params.decayTime);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + params.attackTime + params.decayTime);
}
