/**
 * Sound Effects Utility
 * Handles game sound effects
 */

class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  /**
   * Plays a tone with specified frequency and duration
   */
  playTone(frequency, duration, type = 'sine', volume = 0.1) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Failed to play sound:', e);
    }
  }

  /**
   * Plays a chord (multiple frequencies)
   */
  playChord(frequencies, duration, type = 'sine', volume = 0.1) {
    if (!this.enabled || !this.audioContext) return;
    
    frequencies.forEach(freq => {
      this.playTone(freq, duration, type, volume / frequencies.length);
    });
  }

  /**
   * Sound: Button hover/click
   */
  playClick() {
    this.playTone(800, 0.05, 'square', 0.1);
  }

  /**
   * Sound: Correct answer
   */
  playCorrect() {
    // Cheerful ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.15);
      }, i * 100);
    });
  }

  /**
   * Sound: Incorrect answer
   */
  playIncorrect() {
    // Dissonant note
    this.playTone(200, 0.3, 'sawtooth', 0.2);
  }

  /**
   * Sound: Victory
   */
  playVictory() {
    // Fanfare: ascending notes
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.15);
      }, i * 80);
    });
  }

  /**
   * Sound: Defeat
   */
  playDefeat() {
    // Descending notes with reverb effect
    const notes = [523.25, 440, 349.23, 261.63]; // C5, A4, F4, C4
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'sine', 0.15);
      }, i * 150);
    });
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

