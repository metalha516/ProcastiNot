// Web Audio API 40 Hz Gamma Wave Neural Entrainment & Focus Soundscapes Engine
// Synthesizes 40 Hz binaural beats, isochronic pulses, colored noise, and chimes in real-time.

class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Master & Channel Gains
  private masterGain: GainNode | null = null;
  private gammaGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  // Binaural Beat Oscillators
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private merger: ChannelMergerNode | null = null;

  // Isochronic Pulse Nodes
  private isochronicCarrier: OscillatorNode | null = null;
  private isochronicLFO: OscillatorNode | null = null;
  private isochronicLFOGain: GainNode | null = null;

  // Ambient Noise Sources
  private ambientSource: AudioBufferSourceNode | null = null;

  // State cache
  private currentMode: 'binaural' | 'isochronic' = 'binaural';
  private carrierFreq: number = 216; // Standard carrier
  private gammaBeatFreq: number = 40; // 40 Hz Gamma
  private currentAmbient: 'none' | 'pink' | 'brown' | 'rain' | 'library' = 'none';
  private gammaVol: number = 0.35;
  private ambientVol: number = 0.25;

  public async initContext(): Promise<AudioContext | null> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;
      this.ctx = new AudioCtxClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.gammaGain = this.ctx.createGain();
      this.gammaGain.gain.setValueAtTime(this.gammaVol, this.ctx.currentTime);
      this.gammaGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVol, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Will resume on next user gesture
      }
    }
    return this.ctx;
  }

  public async start(
    mode: 'binaural' | 'isochronic' = 'binaural',
    ambient: 'none' | 'pink' | 'brown' | 'rain' | 'library' = 'none',
    gammaVolume: number = 0.35,
    ambientVolume: number = 0.25
  ) {
    await this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {}
    }

    this.stopAudioNodes();

    this.currentMode = mode;
    this.currentAmbient = ambient;
    this.gammaVol = gammaVolume;
    this.ambientVol = ambientVolume;

    if (this.gammaGain) {
      this.gammaGain.gain.setValueAtTime(gammaVolume, this.ctx.currentTime);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(ambientVolume, this.ctx.currentTime);
    }

    // Start selected 40Hz Mode
    if (mode === 'binaural') {
      this.startBinaural();
    } else {
      this.startIsochronic();
    }

    // Start Ambient Soundscape if requested
    if (ambient !== 'none') {
      this.startAmbient(ambient);
    }

    this.isRunning = true;
  }

  private startBinaural() {
    if (!this.ctx || !this.gammaGain) return;

    const leftFreq = this.carrierFreq;
    const rightFreq = this.carrierFreq + this.gammaBeatFreq; // 216 + 40 = 256 Hz

    this.oscLeft = this.ctx.createOscillator();
    this.oscRight = this.ctx.createOscillator();

    this.oscLeft.type = 'sine';
    this.oscRight.type = 'sine';

    this.oscLeft.frequency.setValueAtTime(leftFreq, this.ctx.currentTime);
    this.oscRight.frequency.setValueAtTime(rightFreq, this.ctx.currentTime);

    // Channel merger for true stereo binaural delivery
    this.merger = this.ctx.createChannelMerger(2);

    const gainL = this.ctx.createGain();
    const gainR = this.ctx.createGain();
    gainL.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.5, this.ctx.currentTime);

    this.oscLeft.connect(gainL);
    this.oscRight.connect(gainR);

    gainL.connect(this.merger, 0, 0); // Left channel
    gainR.connect(this.merger, 0, 1); // Right channel

    this.merger.connect(this.gammaGain);

    this.oscLeft.start();
    this.oscRight.start();
  }

  private startIsochronic() {
    if (!this.ctx || !this.gammaGain) return;

    // Carrier tone (432 Hz warm resonant sine)
    this.isochronicCarrier = this.ctx.createOscillator();
    this.isochronicCarrier.type = 'sine';
    this.isochronicCarrier.frequency.setValueAtTime(this.carrierFreq, this.ctx.currentTime);

    // Carrier gain modulated by 40Hz LFO
    const pulseGain = this.ctx.createGain();
    pulseGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    // 40Hz Square/Pulse modulator
    this.isochronicLFO = this.ctx.createOscillator();
    this.isochronicLFO.type = 'sine';
    this.isochronicLFO.frequency.setValueAtTime(this.gammaBeatFreq, this.ctx.currentTime);

    this.isochronicLFOGain = this.ctx.createGain();
    this.isochronicLFOGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    this.isochronicLFO.connect(this.isochronicLFOGain);
    this.isochronicLFOGain.connect(pulseGain.gain);

    this.isochronicCarrier.connect(pulseGain);
    pulseGain.connect(this.gammaGain);

    this.isochronicCarrier.start();
    this.isochronicLFO.start();
  }

  private startAmbient(type: 'pink' | 'brown' | 'rain' | 'library') {
    if (!this.ctx || !this.ambientGain) return;

    // Generate 6 seconds of seamless looping noise buffer
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 6;
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    const leftData = buffer.getChannelData(0);
    const rightData = buffer.getChannelData(1);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
        b6 = white * 0.115926;
        leftData[i] = pink;
        rightData[i] = pink * 0.96;
      }
    } else if (type === 'brown') {
      let lastOutL = 0.0;
      let lastOutR = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
        lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;
        leftData[i] = lastOutL * 2.8;
        rightData[i] = lastOutR * 2.8;
      }
    } else if (type === 'rain') {
      // High-fidelity natural rain synthesis:
      // Layer 1: continuous pink/brown rain curtain wash
      // Layer 2: randomized spatial rain droplet impacts with subtle resonance
      let b0L = 0, b1L = 0, b2L = 0;
      let b0R = 0, b1R = 0, b2R = 0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        
        b0L = 0.99 * b0L + whiteL * 0.06;
        b1L = 0.95 * b1L + whiteL * 0.12;
        b2L = 0.85 * b2L + whiteL * 0.25;
        const washL = (b0L + b1L + b2L) * 0.16;

        b0R = 0.99 * b0R + whiteR * 0.06;
        b1R = 0.95 * b1R + whiteR * 0.12;
        b2R = 0.85 * b2R + whiteR * 0.25;
        const washR = (b0R + b1R + b2R) * 0.16;

        // Occasional randomized raindrop strikes
        const dropL = Math.random() > 0.994 ? (Math.random() * 0.35) : 0;
        const dropR = Math.random() > 0.994 ? (Math.random() * 0.35) : 0;

        leftData[i] = washL + dropL;
        rightData[i] = washR + dropR;
      }
    } else if (type === 'library') {
      // Cozy study cafe & library: warm low-frequency air hum + gentle room tone
      let lastOutL = 0.0;
      let lastOutR = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + 0.015 * whiteL) / 1.015;
        lastOutR = (lastOutR + 0.015 * whiteR) / 1.015;
        const roomHum = Math.sin((2 * Math.PI * 55 * i) / sampleRate) * 0.03;
        leftData[i] = lastOutL * 1.8 + roomHum;
        rightData[i] = lastOutR * 1.75 + roomHum;
      }
    }

    this.ambientSource = this.ctx.createBufferSource();
    this.ambientSource.buffer = buffer;
    this.ambientSource.loop = true;

    // Smooth filtering tailored for pleasant listening
    const filter = this.ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
    } else if (type === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    } else if (type === 'library') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    }

    this.ambientSource.connect(filter);
    filter.connect(this.ambientGain);

    this.ambientSource.start();
  }

  public setGammaVolume(volume: number) {
    this.gammaVol = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.gammaGain) {
      this.gammaGain.gain.setValueAtTime(this.gammaVol, this.ctx.currentTime);
    }
  }

  public setAmbientVolume(volume: number) {
    this.ambientVol = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.ambientVol, this.ctx.currentTime);
    }
  }

  public setMode(mode: 'binaural' | 'isochronic') {
    if (this.currentMode === mode && this.isRunning) return;
    this.currentMode = mode;
    if (this.isRunning) {
      this.start(this.currentMode, this.currentAmbient, this.gammaVol, this.ambientVol);
    }
  }

  public setAmbient(ambient: 'none' | 'pink' | 'brown' | 'rain' | 'library') {
    this.currentAmbient = ambient;
    if (this.isRunning) {
      this.stopAmbientOnly();
      if (ambient !== 'none') {
        this.startAmbient(ambient);
      }
    }
  }

  private stopAmbientOnly() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch {
        // ignore already stopped
      }
      this.ambientSource = null;
    }
  }

  private stopAudioNodes() {
    if (this.oscLeft) {
      try { this.oscLeft.stop(); this.oscLeft.disconnect(); } catch {}
      this.oscLeft = null;
    }
    if (this.oscRight) {
      try { this.oscRight.stop(); this.oscRight.disconnect(); } catch {}
      this.oscRight = null;
    }
    if (this.isochronicCarrier) {
      try { this.isochronicCarrier.stop(); this.isochronicCarrier.disconnect(); } catch {}
      this.isochronicCarrier = null;
    }
    if (this.isochronicLFO) {
      try { this.isochronicLFO.stop(); this.isochronicLFO.disconnect(); } catch {}
      this.isochronicLFO = null;
    }
    this.stopAmbientOnly();
  }

  public stop() {
    this.stopAudioNodes();
    this.isRunning = false;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  // Synthesized Sound Effects for timer events & mindfulness
  public playChime(type: 'start' | 'complete' | 'mindfulness') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    if (type === 'start') {
      // Pleasant rising arpeggio C5 -> E5 -> G5
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.55);
      });
    } else if (type === 'complete') {
      // Warm gong / bell chord for completed focus session
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 2.6);
      });
    } else if (type === 'mindfulness') {
      // Soft 432 Hz Tibetan singing bowl tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.1);
    }
  }
}

export const gammaEngine = new GammaAudioEngine();
