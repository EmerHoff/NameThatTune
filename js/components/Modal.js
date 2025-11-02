/**
 * Modal Component
 * Handles result modal display
 */

class Modal {
  constructor() {
    this.modal = document.getElementById("result-modal");
    this.title = document.getElementById("result-title");
    this.message = document.getElementById("result-message");
    this.details = document.getElementById("result-details");
    this.closeButton = document.getElementById("close-modal-btn");
    this.onClose = null;

    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.hide();
        if (this.onClose) {
          this.onClose();
        }
      });
    }
  }

  /**
   * Sets callback for when modal is closed
   * @param {Function} callback - Callback function
   */
  setCloseCallback(callback) {
    this.onClose = callback;
  }

  /**
   * Shows the modal with results
   * @param {Object} score - Score object with correctCount and totalPoints
   * @param {number} totalTracks - Total number of tracks
   * @param {Array} results - Array of result objects
   */
  showResults(score, totalTracks, results) {
    if (this.title) {
      const percentage = Math.round((score.correctCount / totalTracks) * 100);
      let emoji = "🎵";
      if (percentage === 100) emoji = "🏆";
      else if (percentage >= 80) emoji = "🌟";
      else if (percentage >= 50) emoji = "👍";
      else emoji = "💪";
      
      this.title.innerHTML = `${emoji} Resultado Final`;
    }
    
    if (this.message) {
      const percentage = Math.round((score.correctCount / totalTracks) * 100);
      this.message.innerHTML = `
        <div class="score-summary">
          <div class="score-big">${score.correctCount}/${totalTracks}</div>
          <div class="score-percentage">${percentage}% de acerto</div>
          <div class="score-points">${score.totalPoints} pontos</div>
        </div>
      `;
    }

    if (this.details) {
      this.details.innerHTML = "";
      results.forEach((result, index) => {
        const item = document.createElement("div");
        item.className = `result-item ${result.isCorrect ? "correct" : "incorrect"}`;
        item.style.animationDelay = `${index * 0.1}s`;
        
        if (result.isCorrect) {
          item.innerHTML = `
            <div class="result-header">
              <div class="result-number">${index + 1}</div>
              <div class="result-status correct-status">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
                <span>Correto</span>
              </div>
            </div>
            <div class="result-track-info">
              <div class="result-track-title">${result.track.title}</div>
              <div class="result-track-artist">${result.track.artist}</div>
            </div>
            <div class="result-meta">
              <span class="result-time">⏱️ ${result.listenTime}s</span>
              <span class="result-points">✨ ${result.points} pts</span>
            </div>
          `;
        } else {
          item.innerHTML = `
            <div class="result-header">
              <div class="result-number">${index + 1}</div>
              <div class="result-status incorrect-status">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                </svg>
                <span>Incorreto</span>
              </div>
            </div>
            <div class="result-track-info">
              <div class="result-track-title">${result.track.title}</div>
              <div class="result-track-artist">${result.track.artist}</div>
            </div>
            <div class="result-wrong-answer">
              <div class="result-wrong-label">Você escolheu:</div>
              <div class="result-wrong-track">${result.userAnswer?.title || "N/A"} - ${result.userAnswer?.artist || "N/A"}</div>
            </div>
          `;
        }
        
        this.details.appendChild(item);
      });
    }

    this.show();
  }

  /**
   * Shows the modal
   */
  show() {
    if (this.modal) {
      this.modal.classList.remove("hidden");
      // Hide question container (but keep game-container visible for modal positioning)
      const questionContainer = document.querySelector(".question-container");
      const questionTitle = document.getElementById("question-title");
      const answersTitle = document.querySelector(".answers-section h2");
      
      if (questionContainer) {
        questionContainer.style.display = "none";
      }
      if (questionTitle) {
        questionTitle.style.display = "none";
      }
      if (answersTitle) {
        answersTitle.style.display = "none";
      }
    }
  }

  /**
   * Hides the modal
   */
  hide() {
    if (this.modal) {
      this.modal.classList.add("hidden");
      // Show question container when modal is hidden
      const questionContainer = document.querySelector(".question-container");
      const questionTitle = document.getElementById("question-title");
      const answersTitle = document.querySelector(".answers-section h2");
      
      if (questionContainer) {
        questionContainer.style.display = "";
      }
      if (questionTitle) {
        questionTitle.style.display = "";
      }
      if (answersTitle) {
        answersTitle.style.display = "";
      }
    }
  }
}

export default Modal;

