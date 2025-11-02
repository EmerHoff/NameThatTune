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
    this.deezerService = DeezerService; // Serviço exporta funções, não é uma classe
    this.player = new Player("preview-container");
    this.answerOptions = new AnswerOptions("answers-container");
    this.scoreBoard = new ScoreBoard();
    this.modal = new Modal();
    this.optionTracksCache = {}; // Cache options for each track
    this.lastGameMode = "normal"; // Track last game mode for retry
    this.lastGenreId = null; // Track last genre ID for retry

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
   * @param {string} gameMode - 'daily' for daily game, 'normal' for normal game
   * @param {number} genreId - Genre ID for normal game mode
   */
  async initGame(gameMode = "normal", genreId = null) {
    this.showLoading();
    this.hideError();
    this.hideGame();
    this.hideMainMenu();

    try {
      console.log(
        `[GameController] Iniciando jogo no modo: ${gameMode}, genreId: ${genreId}`
      );
      let tracks;

      if (gameMode === "daily") {
        console.log(`[GameController] Buscando músicas para Jogo Diário...`);
        tracks = await this.deezerService.getDailyGameTracks(5);
      } else if (gameMode === "normal" && genreId) {
        console.log(
          `[GameController] Buscando músicas para Jogo Normal com gênero ${genreId}...`
        );
        this.lastGenreId = genreId; // Save genre ID for retry
        tracks = await this.deezerService.getNormalGameTracks(genreId, 5);
      } else {
        console.log(
          `[GameController] Modo não especificado, usando Jogo Diário como fallback...`
        );
        // Fallback: usar daily game se não especificado
        tracks = await this.deezerService.getDailyGameTracks(5);
      }

      console.log(`[GameController] Tracks recebidos:`, tracks);

      if (!tracks || tracks.length === 0) {
        throw new Error("Nenhuma música foi encontrada. Tente novamente.");
      }

      console.log(
        `[GameController] ${tracks.length} músicas carregadas com sucesso!`
      );

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
        // Determina o genreId:
        // - No modo normal, usa o lastGenreId
        // - No modo daily, usa o genreId da música atual (se disponível)
        const genreId = this.lastGenreId || currentTrack.genreId || null;

        if (!genreId) {
          throw new Error("Genre ID não disponível para buscar opções");
        }

        // Busca opções do mesmo gênero da música atual
        const randomOptions = await this.deezerService.getRandomOptions(
          genreId,
          this.gameState.gameTracks,
          3
        );

        // Include current track + 3 random options = 4 total options
        this.optionTracksCache[currentTrack.id] = [
          currentTrack,
          ...randomOptions,
        ];
      } catch (error) {
        console.error(
          "Failed to load option tracks, using game tracks:",
          error
        );
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
      const perfectScore =
        score.correctCount === this.gameState.gameTracks.length;
      if (perfectScore) {
        soundManager.playVictory();
      } else if (score.correctCount === 0) {
        soundManager.playDefeat();
      }

      this.modal.showResults(score, this.gameState.gameTracks.length, results);
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
    const mainMenu = document.getElementById("main-menu");
    const genreSelection = document.getElementById("genre-selection");
    if (mainMenu) mainMenu.classList.remove("hidden");
    if (genreSelection) genreSelection.classList.add("hidden");
  }

  hideMainMenu() {
    const mainMenu = document.getElementById("main-menu");
    const genreSelection = document.getElementById("genre-selection");
    if (mainMenu) mainMenu.classList.add("hidden");
    if (genreSelection) genreSelection.classList.add("hidden");
  }
}

export default GameController;
