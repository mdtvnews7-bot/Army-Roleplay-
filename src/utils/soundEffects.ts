// Web Audio API synthesizer for authentic military acoustic feedback

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

// Tactical button click / radio squeak
export function playTacticalClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio context error
  }
}

// Military Drum Roll
export function playDrumRoll(durationMs = 1200) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;
    const count = 28;
    const interval = (durationMs / 1000) / count;

    for (let i = 0; i < count; i++) {
      const hitTime = startTime + i * interval;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 40, hitTime);
      
      const volume = 0.02 + (i / count) * 0.07;
      gain.gain.setValueAtTime(volume, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(hitTime);
      osc.stop(hitTime + 0.04);
    }
  } catch {
    // Ignore audio error
  }
}

// Ceremonial Bugle / Brass Fanfare for Military Promotion
export function playPromotionFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime + 0.1;
    // Military triad fanfare notes: C4, G4, C5, E5, G5
    const notes = [
      { f: 261.63, d: 0.16, pause: 0.04 }, // C4
      { f: 329.63, d: 0.16, pause: 0.04 }, // E4
      { f: 392.00, d: 0.20, pause: 0.04 }, // G4
      { f: 523.25, d: 0.45, pause: 0.08 }, // C5
      { f: 392.00, d: 0.18, pause: 0.04 }, // G4
      { f: 523.25, d: 0.18, pause: 0.04 }, // C5
      { f: 659.25, d: 0.70, pause: 0.05 }, // E5
    ];

    let currentOffset = 0;
    notes.forEach((n) => {
      const noteStart = startTime + currentOffset;
      const noteEnd = noteStart + n.d;

      // Brass main harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(n.f, noteStart);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(n.f * 2, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      // Low pass filter for warm brass timbre
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, noteStart);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(noteStart);
      osc2.start(noteStart);
      osc1.stop(noteEnd);
      osc2.stop(noteEnd);

      currentOffset += n.d + n.pause;
    });
  } catch {
    // Ignore audio error
  }
}

// Medal Awarding Chime
export function playMedalChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;
    const chords = [587.33, 739.99, 880.00, 1174.66]; // D-maj crystal arpeggio

    chords.forEach((freq, idx) => {
      const noteStart = startTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.08, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.9);
    });
  } catch {
    // Ignore audio error
  }
}

// Personnel Transfer / Deployment dispatch sound
export function playTransferChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;
    // Ascending dispatch chime: F4, A4, C5
    const notes = [349.23, 440.00, 523.25];
    notes.forEach((freq, idx) => {
      const noteStart = startTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.09, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.4);
    });
  } catch {
    // Ignore audio error
  }
}

