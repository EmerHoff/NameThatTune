/**
 * Player Component
 * Handles audio player rendering and interaction
 */

import { updateVolumeIcon, formatTime, stopAudio } from "../utils/audio.util.js";
import soundManager from "../utils/sounds.util.js";

class Player {
  constructor(containerId) {
    this.containerId = containerId;
    this.audio = null;
    this.playButton = null;
    this.volumeSlider = null;
    this.volumeIcon = null;
    this.progressFill = null;
    this.currentTimeElement = null;
    this.totalTimeElement = null;
    this.coverContainer = null;
    this.previewCard = null;
    this.maxPlayTime = 1; // Start with 1 second
    this.onTimeLimitChange = null; // Callback when time limit changes
    this.timeLimitButtons = [];
  }

  /**
   * Sets callback for when time limit changes
   * @param {Function} callback - Callback function that receives new time limit
   */
  setTimeLimitCallback(callback) {
    this.onTimeLimitChange = callback;
  }

  /**
   * Renders the player for a track
   * @param {Object} track - Track object with previewUrl and coverImage
   */
  render(track) {
    // Reset max play time to 1 second for new track
    this.maxPlayTime = 1;
    const container = document.getElementById(this.containerId);
    container.innerHTML = "";

    this.previewCard = document.createElement("div");
    this.previewCard.className = "preview-card";
    this.previewCard.id = "preview-card";
    this.previewCard.dataset.coverImage = track.coverImage || "";

    const playerWrapper = document.createElement("div");
    playerWrapper.className = "player-wrapper";

    this.coverContainer = document.createElement("div");
    this.coverContainer.className = "cover-container";
    this.coverContainer.id = "cover-container";
    const placeholder = document.createElement("div");
    placeholder.className = "album-cover placeholder-cover";
    placeholder.innerHTML = "🎵";
    this.coverContainer.appendChild(placeholder);
    playerWrapper.appendChild(this.coverContainer);

    const playerControls = document.createElement("div");
    playerControls.className = "player-controls";

    if (track.previewUrl) {
      this.audio = document.createElement("audio");
      this.audio.id = "preview-audio";
      this.audio.src = track.previewUrl;
      this.audio.preload = "metadata";
      this.audio.autoplay = false;
      this.audio.volume = 0.5;

      const progressContainer = document.createElement("div");
      progressContainer.className = "progress-container";

      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";
      this.progressFill = document.createElement("div");
      this.progressFill.className = "progress-fill";
      progressBar.appendChild(this.progressFill);

      const timeDisplay = document.createElement("div");
      timeDisplay.className = "time-display";
      this.currentTimeElement = document.createElement("span");
      this.currentTimeElement.className = "current-time";
      this.currentTimeElement.textContent = "0:00";
      this.totalTimeElement = document.createElement("span");
      this.totalTimeElement.className = "total-time";
      this.totalTimeElement.textContent = "0:00";
      timeDisplay.appendChild(this.currentTimeElement);
      timeDisplay.appendChild(this.totalTimeElement);

      progressContainer.appendChild(progressBar);
      progressContainer.appendChild(timeDisplay);

      const controlsBar = document.createElement("div");
      controlsBar.className = "controls-bar";

      this.playButton = document.createElement("button");
      this.playButton.className = "play-button";
      this.playButton.innerHTML = this.getPlayIcon();

      this.playButton.addEventListener("click", () => {
        soundManager.playClick();
        this.togglePlay();
      });

      const volumeContainer = document.createElement("div");
      volumeContainer.className = "volume-container";

      this.volumeIcon = document.createElement("div");
      this.volumeIcon.className = "volume-icon";
      updateVolumeIcon(this.volumeIcon, 0.5);

      this.volumeSlider = document.createElement("input");
      this.volumeSlider.type = "range";
      this.volumeSlider.className = "volume-slider";
      this.volumeSlider.min = "0";
      this.volumeSlider.max = "100";
      this.volumeSlider.value = "50";
      this.volumeSlider.title = "Volume";

      this.volumeSlider.addEventListener("input", (e) => {
        const volume = parseInt(e.target.value) / 100;
        this.audio.volume = volume;
        updateVolumeIcon(this.volumeIcon, volume);
      });

      volumeContainer.appendChild(this.volumeIcon);
      volumeContainer.appendChild(this.volumeSlider);

      controlsBar.appendChild(this.playButton);
      controlsBar.appendChild(volumeContainer);

      this.setupAudioEvents();

      // Time limit controls
      const timeLimitContainer = document.createElement("div");
      timeLimitContainer.className = "time-limit-container";
      
      const timeLimitLabel = document.createElement("div");
      timeLimitLabel.className = "time-limit-label";
      timeLimitLabel.textContent = "Ouvir mais:";
      
      const timeLimitButtons = document.createElement("div");
      timeLimitButtons.className = "time-limit-buttons";
      
      const timeOptions = [2, 5, 10];
      this.timeLimitButtons = [];
      
      timeOptions.forEach((seconds) => {
        const button = document.createElement("button");
        button.className = "time-limit-btn";
        const span = document.createElement("span");
        span.textContent = `+${seconds}s`;
        button.appendChild(span);
        button.dataset.seconds = seconds;
        // Disable if this time option is already reached or exceeded
        button.disabled = seconds <= this.maxPlayTime;
        
        button.addEventListener("click", () => {
          soundManager.playClick();
          this.setMaxPlayTime(seconds);
        });
        
        this.timeLimitButtons.push(button);
        timeLimitButtons.appendChild(button);
      });
      
      // Store reference to update buttons later
      this.updateTimeLimitButtons();
      
      timeLimitContainer.appendChild(timeLimitLabel);
      timeLimitContainer.appendChild(timeLimitButtons);
      
      playerControls.appendChild(progressContainer);
      playerControls.appendChild(controlsBar);
      playerControls.appendChild(timeLimitContainer);
    } else {
      const noPreview = document.createElement("div");
      noPreview.className = "no-preview";
      noPreview.textContent = "Preview não disponível";
      playerControls.appendChild(noPreview);
    }

    playerWrapper.appendChild(playerControls);
    this.previewCard.appendChild(playerWrapper);
    container.appendChild(this.previewCard);
  }

  /**
   * Sets up audio event listeners
   */
  setupAudioEvents() {
    this.audio.addEventListener("loadedmetadata", () => {
      const duration = Math.floor(this.audio.duration);
      this.totalTimeElement.textContent = formatTime(duration);
    });

    this.audio.addEventListener("timeupdate", () => {
      const current = this.audio.currentTime;
      const duration = this.audio.duration || 0;
      
      // Add playing class for sound wave animation
      const progressContainer = this.progressFill.parentElement.parentElement;
      if (progressContainer && !this.audio.paused) {
        progressContainer.classList.add("playing");
      } else if (progressContainer) {
        progressContainer.classList.remove("playing");
      }
      
      // Stop at max play time
      if (current >= this.maxPlayTime) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.playButton.innerHTML = this.getPlayIcon();
        this.progressFill.style.width = "0%";
        this.currentTimeElement.textContent = "0:00";
        if (progressContainer) {
          progressContainer.classList.remove("playing");
        }
        return;
      }
      
      const currentRounded = Math.floor(current);
      const percentage = duration > 0 ? (current / duration) * 100 : 0;
      this.progressFill.style.width = `${percentage}%`;
      this.currentTimeElement.textContent = formatTime(currentRounded);
    });

    this.audio.addEventListener("ended", () => {
      this.playButton.innerHTML = this.getPlayIcon();
      this.progressFill.style.width = "0%";
      this.currentTimeElement.textContent = "0:00";
      const progressContainer = this.progressFill.parentElement.parentElement;
      if (progressContainer) {
        progressContainer.classList.remove("playing");
      }
    });

    this.audio.addEventListener("pause", () => {
      const progressContainer = this.progressFill.parentElement.parentElement;
      if (progressContainer) {
        progressContainer.classList.remove("playing");
      }
    });
  }

  /**
   * Updates time limit button states
   */
  updateTimeLimitButtons() {
    if (!this.timeLimitButtons) return;
    
    this.timeLimitButtons.forEach((button) => {
      const buttonSeconds = parseInt(button.dataset.seconds);
      // Disable button if this time has already been reached
      button.disabled = buttonSeconds <= this.maxPlayTime;
    });
  }

  /**
   * Sets the maximum play time
   * @param {number} seconds - Maximum seconds to play
   */
  setMaxPlayTime(seconds) {
    if (seconds <= this.maxPlayTime) {
      return; // Can't decrease time
    }
    
    this.maxPlayTime = seconds;
    this.updateTimeLimitButtons();
    
    // Notify callback
    if (this.onTimeLimitChange) {
      this.onTimeLimitChange(this.maxPlayTime);
    }
    
    // If audio is playing, restart to apply new limit
    if (this.audio && !this.audio.paused) {
      this.audio.currentTime = 0;
    }
  }

  /**
   * Gets the current max play time
   * @returns {number} Current max play time in seconds
   */
  getMaxPlayTime() {
    return this.maxPlayTime;
  }

  /**
   * Toggles play/pause
   */
  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playButton.innerHTML = this.getPauseIcon();
    } else {
      this.audio.pause();
      this.playButton.innerHTML = this.getPlayIcon();
    }
  }

  /**
   * Stops the audio
   */
  stop() {
    if (this.audio) {
      stopAudio(this.audio);
      if (this.playButton) {
        this.playButton.innerHTML = this.getPlayIcon();
      }
    }
  }

  /**
   * Shows the album cover
   */
  showCover() {
    if (this.previewCard && this.coverContainer) {
      const coverImage = this.previewCard.dataset.coverImage;
      if (coverImage) {
        this.coverContainer.innerHTML = "";
        const coverImg = document.createElement("img");
        coverImg.src = coverImage;
        coverImg.alt = "Album cover";
        coverImg.className = "album-cover";
        this.coverContainer.appendChild(coverImg);
      }
    }
  }

  /**
   * Adds correct feedback class
   */
  markCorrect() {
    if (this.previewCard) {
      this.previewCard.classList.add("correct");
    }
  }

  /**
   * Adds incorrect feedback class
   */
  markIncorrect() {
    if (this.previewCard) {
      this.previewCard.classList.add("incorrect");
    }
  }

  /**
   * Removes feedback classes
   */
  clearFeedback() {
    if (this.previewCard) {
      this.previewCard.classList.remove("correct", "incorrect");
    }
  }

  /**
   * Gets play icon SVG
   */
  getPlayIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
      </svg>
    `;
  }

  /**
   * Gets pause icon SVG
   */
  getPauseIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <rect x="9" y="9" width="2" height="6" fill="currentColor"/>
        <rect x="13" y="9" width="2" height="6" fill="currentColor"/>
      </svg>
    `;
  }
}

export default Player;

