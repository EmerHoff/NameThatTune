/**
 * Main Entry Point
 * Initializes the game and sets up event listeners
 */

import GameController from "./game/game.controller.js";

// Initialize game controller
const gameController = new GameController();

// Menu state
let currentMenuVisible = true;

// Show main menu
function showMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  const gameContainer = document.getElementById("game-container");
  const loading = document.getElementById("loading");
  
  mainMenu.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  loading.classList.add("hidden");
  currentMenuVisible = true;
}

// Hide main menu and show game
function hideMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  mainMenu.classList.add("hidden");
  currentMenuVisible = false;
}

// Set up event listeners
document.getElementById("menu-btn").addEventListener("click", () => {
  if (!currentMenuVisible) {
    showMainMenu();
  }
});

document.getElementById("retry-game-btn").addEventListener("click", () => {
  hideMainMenu();
  gameController.initGame();
});

document.getElementById("daily-game-btn").addEventListener("click", () => {
  hideMainMenu();
  gameController.initGame();
});

document.getElementById("normal-game-btn").addEventListener("click", () => {
  hideMainMenu();
  gameController.initGame();
});

// Initialize: show menu on page load
window.addEventListener("DOMContentLoaded", () => {
  showMainMenu();
});

