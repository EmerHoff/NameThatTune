/**
 * Answer Options Component
 * Handles rendering and interaction with answer options
 */

import soundManager from "../utils/sounds.util.js";

class AnswerOptions {
  constructor(containerId) {
    this.containerId = containerId;
    this.onAnswerSelected = null;
  }

  /**
   * Sets the callback for when an answer is selected
   * @param {Function} callback - Callback function
   */
  setAnswerCallback(callback) {
    this.onAnswerSelected = callback;
  }

  /**
   * Renders answer options
   * @param {Object} currentTrack - Current track being played
   * @param {Array} optionTracks - Array of tracks to use as options (includes current track + random ones)
   * @param {boolean} isFinished - Whether game is finished
   */
  render(currentTrack, optionTracks, isFinished = false) {
    const container = document.getElementById(this.containerId);
    container.innerHTML = "";

    // Ensure current track is in options and shuffle
    const allOptions = [...optionTracks];
    if (!allOptions.find(t => t.id === currentTrack.id)) {
      allOptions.push(currentTrack);
    }
    
    const shuffledAnswers = allOptions.sort(() => Math.random() - 0.5);

    shuffledAnswers.forEach((answerTrack) => {
      const option = document.createElement("div");
      option.className = "answer-option";
      option.dataset.trackId = answerTrack.id;

      if (answerTrack.coverImage) {
        const coverImg = document.createElement("img");
        coverImg.src = answerTrack.coverImage;
        coverImg.alt = `${answerTrack.title} - ${answerTrack.artist}`;
        coverImg.className = "track-cover";
        option.appendChild(coverImg);
      } else {
        const placeholderImg = document.createElement("div");
        placeholderImg.className = "track-cover";
        placeholderImg.style.background =
          "linear-gradient(135deg, #26C6DA 0%, #6A1B9A 100%)";
        placeholderImg.style.display = "flex";
        placeholderImg.style.alignItems = "center";
        placeholderImg.style.justifyContent = "center";
        placeholderImg.style.color = "white";
        placeholderImg.style.fontSize = "1.5rem";
        placeholderImg.textContent = "🎵";
        option.appendChild(placeholderImg);
      }

      const trackInfo = document.createElement("div");
      trackInfo.className = "track-info";

      const title = document.createElement("div");
      title.className = "track-title";
      title.textContent = answerTrack.title;

      const artist = document.createElement("div");
      artist.className = "track-artist";
      artist.textContent = answerTrack.artist;

      trackInfo.appendChild(title);
      trackInfo.appendChild(artist);
      option.appendChild(trackInfo);

      if (!isFinished) {
        let hovered = false;
        option.addEventListener("mouseenter", () => {
          if (!hovered) {
            soundManager.playClick();
            hovered = true;
          }
        });
        
        option.addEventListener("click", () => {
          if (this.onAnswerSelected) {
            this.onAnswerSelected(answerTrack.id);
          }
        });
      }

      container.appendChild(option);
    });
  }

  /**
   * Shows feedback for selected answer
   * @param {string} selectedTrackId - Selected track ID
   * @param {string} correctTrackId - Correct track ID
   */
  showFeedback(selectedTrackId, correctTrackId) {
    const options = document.querySelectorAll(".answer-option");

    options.forEach((option) => {
      option.style.pointerEvents = "none";
      if (option.dataset.trackId === selectedTrackId) {
        if (selectedTrackId === correctTrackId) {
          option.classList.add("correct");
          soundManager.playCorrect();
        } else {
          option.classList.add("incorrect");
          soundManager.playIncorrect();
          const correctOption = document.querySelector(
            `[data-track-id="${correctTrackId}"]`
          );
          if (correctOption) {
            correctOption.classList.add("correct");
          }
        }
      }
    });
  }

  /**
   * Clears all feedback classes
   */
  clearFeedback() {
    const options = document.querySelectorAll(".answer-option");
    options.forEach((option) => {
      option.classList.remove("correct", "incorrect");
      option.style.pointerEvents = "";
    });
  }
}

export default AnswerOptions;

