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
      this.title.textContent = "Resultado Final";
    }
    if (this.message) {
      this.message.textContent = `Você acertou ${score.correctCount} de ${totalTracks} músicas!\nPontuação total: ${score.totalPoints} pontos`;
    }

    if (this.details) {
      this.details.innerHTML = "";
      results.forEach((result, index) => {
        const item = document.createElement("div");
        item.className = `result-item ${result.isCorrect ? "correct" : "incorrect"}`;
        item.innerHTML = `
          <strong>Música ${index + 1}:</strong><br>
          ${result.isCorrect ? "✅" : "❌"} ${result.track.title} - ${result.track.artist}
          ${result.isCorrect ? `<br><small>Você ouviu ${result.listenTime}s - ${result.points} pontos</small>` : ""}
          ${
            !result.isCorrect
              ? `<br><small>Você escolheu: ${result.userAnswer?.title} - ${result.userAnswer?.artist}</small>`
              : ""
          }
        `;
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
    }
  }

  /**
   * Hides the modal
   */
  hide() {
    if (this.modal) {
      this.modal.classList.add("hidden");
    }
  }
}

export default Modal;

