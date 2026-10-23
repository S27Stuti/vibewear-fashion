/**
 * deliveryAudioUtils.js
 * 
 * Provides 100% dependency-free audio synthesis using the standard Web Audio API
 * and Web Speech Synthesis API.
 * Works natively in Chrome, Edge, Firefox, Safari on Windows, Mac, Android, and iOS.
 */

// 1. Double-chime notification sound (pleasant "ding-dong" tone for incoming messages)
export const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // High note (E5 ~ 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Higher chime note (B5 ~ 987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);

    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 1000);
  } catch (err) {
    // Graceful fallback if audio is not permitted before user gesture
  }
};

// 2. Realistic telephony ringtone generator (US/India dual-tone: 440Hz + 480Hz)
export const startPhoneRingtone = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return () => {};
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let isRunning = true;
    let loopTimeout = null;

    const playOneRingCycle = () => {
      if (!isRunning) return;
      const now = ctx.currentTime;

      // 440 Hz (Concert A) + 480 Hz (Standard Ringback tone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      // Smooth envelope for realistic telephone ring
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 1.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);

      // Repeat ring after 2.2 seconds silence (standard ringing cadence)
      loopTimeout = setTimeout(playOneRingCycle, 2800);
    };

    playOneRingCycle();

    return () => {
      isRunning = false;
      if (loopTimeout) clearTimeout(loopTimeout);
      try {
        ctx.close();
      } catch (e) {}
    };
  } catch (err) {
    return () => {};
  }
};

// 3. Spoken voice simulation for Delivery Partner (Vikram)
export const speakRiderVoice = (
  text = 'Namaste! Main Vikram bol raha hoon VibeWear express delivery se. Main aapke delivery address ke paas hoon. Please keep your delivery PIN 5821 ready!'
) => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Attempt to pick an Indian English or Hindi voice if available in the OS
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferred = voices.find(
          (v) =>
            v.lang.toLowerCase().includes('hi-in') ||
            v.lang.toLowerCase().includes('en-in') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('hindi')
        );
        if (preferred) {
          utterance.voice = preferred;
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    // Speech synthesis fallback
  }
};

// 4. Stop any speech currently playing
export const stopSpeech = () => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}
};
