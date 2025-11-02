/**
 * Game Controller
 * Orchestrates the game flow and coordinates components
 */

import GameState from "./game.state.js";
import DeezerService from "../services/deezer.service.js";
import Player from "../components/Player.js";
import AnswerOptions from "../components/AnswerOptions.js";
import ScoreBoard from "../components/ScoreBoard.js";
import Modal from "../components/Modal.js";
import soundManager from "../utils/sounds.util.js";

class GameController {
  constructor() {
    this.gameState = new GameState();
    this.deezerService = new DeezerService();
    this.player = new Player("preview-container");
    this.answerOptions = new AnswerOptions("answers-container");
    this.scoreBoard = new ScoreBoard();
    this.modal = new Modal();
    this.optionTracksCache = {}; // Cache options for each track

    this.setupAnswerCallback();
    this.setupPlayerTimeLimitCallback();
    this.setupModalCloseCallback();
  }

  /**
   * Sets up the modal close callback
   */
  setupModalCloseCallback() {
    this.modal.setCloseCallback(() => {
      this.showMainMenu();
    });
  }

  /**
   * Sets up the time limit change callback
   */
  setupPlayerTimeLimitCallback() {
    this.player.setTimeLimitCallback((seconds) => {
      this.gameState.updateListenTime(seconds);
      this.updateScore();
    });
  }

  /**
   * Sets up the answer selection callback
   */
  setupAnswerCallback() {
    this.answerOptions.setAnswerCallback((selectedTrackId) => {
      this.handleAnswer(selectedTrackId);
    });
  }

  /**
   * Initializes and starts the game
   */
  async initGame() {
    this.showLoading();
    this.hideError();
    this.hideGame();
    this.hideMainMenu();

    try {
      console.log("Fetching tracks from Deezer API...");
      const tracks = await this.deezerService.getRandomTracks(5);

      if (!tracks || tracks.length === 0) {
        throw new Error("Nenhuma música foi encontrada. Tente novamente.");
      }

      this.gameState.setTracks(tracks);
      this.gameState.reset();
      this.optionTracksCache = {}; // Clear cache for new game
      this.showCurrentTrack();
      this.hideLoading();
      this.showGame();
    } catch (error) {
      console.error("Error initializing game:", error);
      let errorMessage = "Erro desconhecido ao carregar músicas";

      if (error.message) {
        errorMessage = error.message;
      }

      this.showError(errorMessage);
      this.hideLoading();
    }
  }

  /**
   * Shows the current track
   */
  async showCurrentTrack() {
    if (this.gameState.isFinished()) {
      this.finishGame();
      return;
    }

    // Stop previous audio
    this.player.stop();

    const currentTrack = this.gameState.getCurrentTrack();
    if (!currentTrack) {
      return;
    }

    const trackNumber = this.gameState.currentTrackIndex + 1;
    this.scoreBoard.updateCurrentTrack(trackNumber);
    this.player.render(currentTrack);
    this.player.clearFeedback();

    // Get or cache option tracks for this track
    if (!this.optionTracksCache[currentTrack.id]) {
      try {
        const randomOptions = await this.deezerService.getRandomOptions(
          3,
          this.gameState.gameTracks
        );
        // Include current track + 3 random options = 4 total options
        this.optionTracksCache[currentTrack.id] = [currentTrack, ...randomOptions];
      } catch (error) {
        console.error("Failed to load option tracks, using game tracks:", error);
        // Fallback: use game tracks
        this.optionTracksCache[currentTrack.id] = this.gameState.gameTracks;
      }
    }

    this.answerOptions.render(
      currentTrack,
      this.optionTracksCache[currentTrack.id],
      false
    );
    this.answerOptions.clearFeedback();
  }

  /**
   * Handles answer selection
   * @param {string} selectedTrackId - Selected track ID
   */
  handleAnswer(selectedTrackId) {
    const currentTrack = this.gameState.getCurrentTrack();
    if (!currentTrack) {
      return;
    }

    const correctTrackId = currentTrack.id;
    const listenTime = this.player.getMaxPlayTime();
    this.gameState.recordAnswer(selectedTrackId, listenTime);

    // Stop audio immediately
    this.player.stop();

    // Show feedback
    this.showAnswerFeedback(selectedTrackId, correctTrackId);
    this.updateScore();

    // Move to next track after delay
    setTimeout(() => {
      this.gameState.nextTrack();
      if (!this.gameState.isFinished()) {
        this.showCurrentTrack();
      } else {
        this.finishGame();
      }
    }, 1500);
  }

  /**
   * Shows answer feedback
   * @param {string} selectedTrackId - Selected track ID
   * @param {string} correctTrackId - Correct track ID
   */
  showAnswerFeedback(selectedTrackId, correctTrackId) {
    this.answerOptions.showFeedback(selectedTrackId, correctTrackId);

    if (selectedTrackId === correctTrackId) {
      this.player.markCorrect();
      this.player.showCover();
    } else {
      this.player.markIncorrect();
    }
  }

  /**
   * Updates the score display
   */
  updateScore() {
    const score = this.gameState.calculateScore();
    this.scoreBoard.updateScore(score, this.gameState.gameTracks.length);
  }

  /**
   * Finishes the game
   */
  finishGame() {
    this.gameState.isGameFinished = true;
    const score = this.gameState.calculateScore();
    const results = this.gameState.getResults();

    setTimeout(() => {
      // Play victory or defeat sound
      const perfectScore = score.correctCount === this.gameState.gameTracks.length;
      if (perfectScore) {
        soundManager.playVictory();
      } else if (score.correctCount === 0) {
        soundManager.playDefeat();
      }
      
      this.modal.showResults(
        score,
        this.gameState.gameTracks.length,
        results
      );
    }, 500);
  }

  /**
   * Shows/hides loading state
   */
  showLoading() {
    document.getElementById("loading").classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loading").classList.add("hidden");
  }

  /**
   * Shows/hides game container
   */
  showGame() {
    document.getElementById("game-container").classList.remove("hidden");
  }

  hideGame() {
    document.getElementById("game-container").classList.add("hidden");
  }

  /**
   * Shows/hides error message
   */
  showError(message) {
    const errorContainer = document.getElementById("error-container");
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorContainer.classList.remove("hidden");
  }

  hideError() {
    document.getElementById("error-container").classList.add("hidden");
  }

  /**
   * Shows/hides main menu
   */
  showMainMenu() {
    document.getElementById("main-menu").classList.remove("hidden");
  }

  hideMainMenu() {
    document.getElementById("main-menu").classList.add("hidden");
  }
}

export default GameController;

