/* Original, locally synthesized ambient score. No streaming or audio downloads. */
(() => {
  const toggle = document.querySelector('#soundToggle');
  const label = document.querySelector('#soundLabel');
  const volume = document.querySelector('#soundVolume');
  const status = document.querySelector('#soundStatus');
  let context, master, enabled = false, timer, flutterTimer, noise, measure = 0;
  const chords = [[146.83,220,293.66,349.23],[130.81,196,261.63,329.63],
    [174.61,220,261.63,349.23],[164.81,246.94,329.63,392]];

  function tone(frequency, time, duration, level, type = 'sine') {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(level, time + Math.min(.8, duration / 5));
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + duration + .1);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }

  function playMeasure() {
    if (!enabled || document.hidden) return;
    const now = context.currentTime + .05;
    const chord = chords[measure++ % chords.length];
    chord.forEach((note, i) => tone(note, now + i * .12, 9, .055));
    [0, 2, 1, 3].forEach((step, i) => tone(chord[step] * 2, now + i * 1.5, 3, .045));
    timer = setTimeout(playMeasure, 8000);
  }

  /* Wing beats: two soft filtered-noise puffs, like velvet wings closing. */
  function noiseBuffer() {
    if (noise) return noise;
    const length = Math.floor(context.sampleRate * .2);
    noise = context.createBuffer(1, length, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    return noise;
  }
  function wingBeat() {
    if (!enabled || document.hidden) return;
    const start = context.currentTime + .02;
    [0, .16].forEach(offset => {
      const src = context.createBufferSource();
      src.buffer = noiseBuffer();
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 380 + Math.random() * 180;
      filter.Q.value = 1.3;
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, start + offset);
      gain.gain.linearRampToValueAtTime(.08, start + offset + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, start + offset + .19);
      src.connect(filter).connect(gain).connect(master);
      src.start(start + offset);
      src.stop(start + offset + .25);
      src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); };
    });
    flutterTimer = setTimeout(wingBeat, 1800 + Math.random() * 1600);
  }

  function setLevel() {
    if (!master) return;
    master.gain.setTargetAtTime(enabled ? Number(volume.value) / 100 * .55 : 0,
      context.currentTime, .2);
  }

  toggle.addEventListener('click', async () => {
    toggle.disabled = true;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        context = new Audio();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
      }
      await context.resume();
      enabled = !enabled;
      clearTimeout(timer);
      clearTimeout(flutterTimer);
      setLevel();
      if (enabled) { playMeasure(); wingBeat(); }
      label.textContent = enabled ? 'Sound on' : 'Enable sound';
      toggle.setAttribute('aria-pressed', String(enabled));
      status.textContent = enabled ? 'Ambient music enabled' : 'Sound muted';
    } catch {
      enabled = false;
      label.textContent = 'Sound unavailable';
      status.textContent = 'This browser could not start audio.';
    } finally { toggle.disabled = false; }
  });
  volume.addEventListener('input', setLevel);
  window.addEventListener('bugfound', ({detail}) => {
    if (!enabled || document.hidden || !context) return;
    tone(392 + detail * 62, context.currentTime + .02, 1.2, .09, 'triangle');
    if (detail === 5)
      [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => tone(n, context.currentTime + .2 + i * .13, 1.8, .08));
  });
  window.addEventListener('metamorphosis', ({detail}) => {
    if (!enabled || document.hidden || !context) return;
    const notes = detail === 2 ? [587.33, 739.99, 880, 1174.66] : [293.66, 440];
    notes.forEach((n, i) => tone(n, context.currentTime + i * .16, 2, .07));
  });
  document.addEventListener('visibilitychange', async () => {
    clearTimeout(timer);
    clearTimeout(flutterTimer);
    if (!context) return;
    try {
      if (document.hidden) await context.suspend();
      else if (enabled) { await context.resume(); playMeasure(); wingBeat(); }
    } catch { /* The visitor can resume from the sound control. */ }
  });
})();
