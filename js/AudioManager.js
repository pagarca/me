let audioCtx = null;
let humOsc1 = null;
let humOsc2 = null;
let humGain = null;
let soundEnabled = false;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function playKeyClick() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.12));
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.value = 0.28;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
}

function startHum() {
    if (humOsc1) return;
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    humOsc1 = ctx.createOscillator();
    humOsc1.type = 'sawtooth';
    humOsc1.frequency.value = 50;

    humOsc2 = ctx.createOscillator();
    humOsc2.type = 'sine';
    humOsc2.frequency.value = 100;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0, ctx.currentTime);
    humGain.gain.linearRampToValueAtTime(0.016, ctx.currentTime + 1.5);

    humOsc1.connect(filter);
    humOsc2.connect(filter);
    filter.connect(humGain);
    humGain.connect(ctx.destination);

    humOsc1.start();
    humOsc2.start();
}

function stopHum() {
    if (!humOsc1) return;
    const ctx = getCtx();
    humGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    const o1 = humOsc1, o2 = humOsc2;
    humOsc1 = null;
    humOsc2 = null;
    humGain = null;
    setTimeout(() => {
        try { o1.stop(); o2.stop(); } catch (_) {}
    }, 900);
}

export function enableSound() {
    soundEnabled = true;
    startHum();
}

export function disableSound() {
    soundEnabled = false;
    stopHum();
}
