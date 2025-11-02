/**
 * Main Entry Point
 * Initializes the game and sets up event listeners
 */

import GameController from "./game/game.controller.js";
import DeezerService from "./services/deezer.service.js";

// Initialize game controller
const gameController = new GameController();

// Menu state
let currentMenuVisible = true;

// Get genres from DeezerService (exclui "Todos" com id 0)
const genres = DeezerService.genres.filter((g) => g.id !== 0);

// Show main menu
function showMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  const gameContainer = document.getElementById("game-container");
  const loading = document.getElementById("loading");
  const genreSelection = document.getElementById("genre-selection");
  
  mainMenu.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  loading.classList.add("hidden");
  genreSelection.classList.add("hidden");
  currentMenuVisible = true;
}

// Hide main menu and show game
function hideMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  mainMenu.classList.add("hidden");
  currentMenuVisible = false;
}

// Show genre selection
function showGenreSelection() {
  const mainMenu = document.getElementById("main-menu");
  const genreSelection = document.getElementById("genre-selection");
  const gameContainer = document.getElementById("game-container");
  const loading = document.getElementById("loading");
  
  mainMenu.classList.add("hidden");
  genreSelection.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  loading.classList.add("hidden");
  
  // Render genre cards
  renderGenreCards();
}

// Hide genre selection
function hideGenreSelection() {
  const genreSelection = document.getElementById("genre-selection");
  genreSelection.classList.add("hidden");
}

// Render genre selection cards
function renderGenreCards() {
  const genreGrid = document.getElementById("genre-grid");
  genreGrid.innerHTML = "";
  
  genres.forEach(genre => {
    const card = document.createElement("div");
    card.className = "genre-card";
    card.dataset.genreId = genre.id;
    // Usa picture_medium se disponível, senão usa picture
    const pictureUrl = genre.picture_medium || genre.picture || '';
    card.innerHTML = `
      <div class="genre-image-container">
        <img src="${pictureUrl}" alt="${genre.name}" class="genre-image" />
        <div class="genre-overlay"></div>
      </div>
      <div class="genre-name">${genre.name}</div>
    `;
    
    card.addEventListener("click", () => {
      // Remove selected class from all cards
      document.querySelectorAll(".genre-card").forEach(c => c.classList.remove("selected"));
      // Add selected class to clicked card
      card.classList.add("selected");
      
      // Start game with selected genre after a short delay for visual feedback
      setTimeout(() => {
        hideGenreSelection();
        gameController.lastGameMode = 'normal';
        gameController.lastGenreId = genre.id;
        gameController.initGame('normal', genre.id);
      }, 300);
    });
    
    genreGrid.appendChild(card);
  });
}

// Set up event listeners
document.getElementById("menu-btn").addEventListener("click", () => {
  if (!currentMenuVisible) {
    showMainMenu();
  }
});

document.getElementById("retry-game-btn").addEventListener("click", () => {
  hideMainMenu();
  hideGenreSelection();
  // Use the last game mode and genre
  const gameMode = gameController.lastGameMode || 'normal';
  const genreId = gameController.lastGenreId || null;
  gameController.initGame(gameMode, genreId);
});

document.getElementById("daily-game-btn").addEventListener("click", () => {
  hideMainMenu();
  gameController.lastGameMode = 'daily';
  gameController.initGame('daily');
});

document.getElementById("normal-game-btn").addEventListener("click", () => {
  hideMainMenu();
  showGenreSelection();
});

document.getElementById("back-to-menu-btn").addEventListener("click", () => {
  hideGenreSelection();
  showMainMenu();
});

// Initialize: show menu on page load
window.addEventListener("DOMContentLoaded", () => {
  showMainMenu();
});

