/**
 * Game State Management
 * Manages the state of the game
 */

class GameState {
  constructor() {
    this.gameTracks = [];
    this.userAnswers = {};
    this.listenTimes = {}; // Track how many seconds each track was listened to
    this.isGameFinished = false;
    this.currentTrackIndex = 0;
  }

  /**
   * Resets the game state
   */
  reset() {
    this.userAnswers = {};
    this.listenTimes = {};
    this.isGameFinished = false;
    this.currentTrackIndex = 0;
  }

  /**
   * Sets the game tracks
   * @param {Array} tracks - Array of game tracks
   */
  setTracks(tracks) {
    this.gameTracks = tracks;
  }

  /**
   * Gets the current track
   * @returns {Object|null} Current track or null
   */
  getCurrentTrack() {
    return this.gameTracks[this.currentTrackIndex] || null;
  }

  /**
   * Moves to the next track
   */
  nextTrack() {
    this.currentTrackIndex++;
  }

  /**
   * Checks if game is finished
   * @returns {boolean} True if game is finished
   */
  isFinished() {
    return this.currentTrackIndex >= this.gameTracks.length;
  }

  /**
   * Records a user answer
   * @param {string} trackId - Selected track ID
   * @param {number} listenTime - Seconds listened to this track
   */
  recordAnswer(trackId, listenTime = 1) {
    this.userAnswers[this.currentTrackIndex] = trackId;
    this.listenTimes[this.currentTrackIndex] = listenTime;
  }

  /**
   * Updates listen time for current track
   * @param {number} seconds - New maximum seconds listened
   */
  updateListenTime(seconds) {
    if (this.currentTrackIndex in this.listenTimes) {
      // Only update if increasing
      if (seconds > this.listenTimes[this.currentTrackIndex]) {
        this.listenTimes[this.currentTrackIndex] = seconds;
      }
    } else {
      this.listenTimes[this.currentTrackIndex] = seconds;
    }
  }

  /**
   * Calculates the score
   * @returns {Object} Score object with total points and correct count
   */
  calculateScore() {
    let correctCount = 0;
    let totalPoints = 0;
    
    this.gameTracks.forEach((track, index) => {
      const isCorrect = this.userAnswers[index] === track.id;
      if (isCorrect) {
        correctCount++;
        // Points based on how little time was listened
        // 1 second = 100 points, 2 seconds = 80 points, 5 seconds = 50 points, 10 seconds = 20 points
        const listenTime = this.listenTimes[index] || 1;
        let points = 0;
        
        if (listenTime <= 1) {
          points = 100;
        } else if (listenTime <= 2) {
          points = 80;
        } else if (listenTime <= 5) {
          points = 50;
        } else if (listenTime <= 10) {
          points = 20;
        } else {
          points = 10;
        }
        
        totalPoints += points;
      }
    });
    
    return {
      correctCount,
      totalPoints,
    };
  }

  /**
   * Gets game results
   * @returns {Array} Array of result objects
   */
  getResults() {
    const results = [];
    this.gameTracks.forEach((track, index) => {
      const isCorrect = this.userAnswers[index] === track.id;
      const userAnswer = this.gameTracks.find(
        (t) => t.id === this.userAnswers[index]
      );
      const listenTime = this.listenTimes[index] || 1;
      
      let points = 0;
      if (isCorrect) {
        if (listenTime <= 1) {
          points = 100;
        } else if (listenTime <= 2) {
          points = 80;
        } else if (listenTime <= 5) {
          points = 50;
        } else if (listenTime <= 10) {
          points = 20;
        } else {
          points = 10;
        }
      }
      
      results.push({
        track,
        isCorrect,
        userAnswer,
        listenTime,
        points,
      });
    });
    return results;
  }
}

export default GameState;

