/**
 * Score Board Component
 * Handles score display and game progress
 */

class ScoreBoard {
  constructor() {
    this.scoreElement = document.getElementById("score");
    this.currentTrackElement = document.getElementById("current-track");
    this.questionTitleElement = document.getElementById("question-title");
  }

  /**
   * Updates the score display
   * @param {Object} score - Score object with correctCount and totalPoints
   * @param {number} totalTracks - Total number of tracks
   */
  updateScore(score, totalTracks) {
    if (this.scoreElement) {
      const maxPossiblePoints = totalTracks * 100; // Maximum points if all correct with 1 second
      this.scoreElement.textContent = `${score.totalPoints}/${maxPossiblePoints}`;
    }
  }

  /**
   * Updates the current track display
   * @param {number} trackNumber - Current track number (1-based)
   */
  updateCurrentTrack(trackNumber) {
    if (this.currentTrackElement) {
      this.currentTrackElement.textContent = trackNumber;
    }
    if (this.questionTitleElement) {
      this.questionTitleElement.textContent = `Música ${trackNumber}`;
    }
  }
}

export default ScoreBoard;

