/**
 * Audio Utilities
 * Helper functions for audio manipulation
 */

/**
 * Stops an audio element completely
 * @param {HTMLAudioElement} audio - Audio element to stop
 */
export function stopAudio(audio) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audio.load();
  }
}

/**
 * Updates volume icon based on volume level
 * @param {HTMLElement} iconElement - Icon element to update
 * @param {number} volume - Volume level (0-1)
 */
export function updateVolumeIcon(iconElement, volume) {
  if (volume === 0) {
    iconElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor"/>
        <path d="M16 12L21 17L19.59 18.41L14.59 13.41L16 12Z" fill="currentColor"/>
        <path d="M21 7L19.59 8.41L14.59 13.41L16 15L21 10V7Z" fill="currentColor"/>
      </svg>
    `;
  } else if (volume < 0.5) {
    iconElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor"/>
        <path d="M16.5 12C16.5 10.23 15.48 8.71 14.44 7.69L15.85 6.28C17.19 7.6 18 9.47 18 11.5C18 13.53 17.19 15.4 15.85 16.72L14.44 15.31C15.48 14.29 16.5 12.77 16.5 12Z" fill="currentColor"/>
      </svg>
    `;
  } else {
    iconElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor"/>
        <path d="M16.5 12C16.5 10.23 15.48 8.71 14.44 7.69L15.85 6.28C17.19 7.6 18 9.47 18 11.5C18 13.53 17.19 15.4 15.85 16.72L14.44 15.31C15.48 14.29 16.5 12.77 16.5 12Z" fill="currentColor"/>
        <path d="M19 12C19 9.11 17.72 6.57 15.73 4.83L14.32 6.24C15.94 7.66 17 9.67 17 12C17 14.33 15.94 16.34 14.32 17.76L15.73 19.17C17.72 17.43 19 14.89 19 12Z" fill="currentColor"/>
      </svg>
    `;
  }
}

/**
 * Formats seconds to MM:SS format
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

