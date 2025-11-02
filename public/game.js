const API_BASE_URL = window.location.origin;

let gameTracks = [];
let userAnswers = {};
let isGameFinished = false;
let currentTrackIndex = 0;

/**
 * Initialize the game
 */
async function initGame() {
  showLoading();
  hideError();
  hideGame();

  try {
    console.log(`[Frontend] Fetching tracks from: ${API_BASE_URL}/api/game/tracks?count=5`);
    const response = await fetch(`${API_BASE_URL}/api/game/tracks?count=5`);

    console.log(`[Frontend] Response status: ${response.status}`);
    console.log(`[Frontend] Response ok: ${response.ok}`);

    const contentType = response.headers.get("content-type");
    console.log(`[Frontend] Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("[Frontend] Non-JSON response received:", text.substring(0, 500));
      throw new Error(
        `O servidor retornou uma resposta inválida (Content-Type: ${contentType}). Verifique se o servidor está rodando.`
      );
    }

    let data;
    try {
      data = await response.json();
      console.log("[Frontend] JSON parsed successfully:", data);
    } catch (jsonError) {
      console.error("[Frontend] Failed to parse JSON:", jsonError);
      const text = await response.text();
      console.error("[Frontend] Response text:", text.substring(0, 500));
      throw new Error(
        "Erro ao processar resposta do servidor. Verifique se o servidor está rodando corretamente."
      );
    }

    if (!response.ok) {
      const errorMsg =
        data.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error("[Frontend] Response not OK:", errorMsg);
      throw new Error(errorMsg);
    }

    gameTracks = data.tracks || [];
    console.log(`[Frontend] Received ${gameTracks.length} tracks`);
    
    if (gameTracks.length === 0) {
      console.error("[Frontend] No tracks in response");
      throw new Error("Nenhuma música foi encontrada. Tente novamente.");
    }

    resetGame();
    showCurrentTrack();
    hideLoading();
    showGame();
  } catch (error) {
    console.error("Error initializing game:", error);
    let errorMessage = "Erro desconhecido ao carregar músicas";
    
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      errorMessage =
        "Erro ao processar resposta do servidor. Verifique se o servidor está rodando corretamente.";
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Não foi possível conectar ao servidor. Verifique se o servidor está rodando em http://localhost:3000";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showError(errorMessage);
    hideLoading();
  }
}

/**
 * Reset game state
 */
function resetGame() {
  userAnswers = {};
  isGameFinished = false;
  currentTrackIndex = 0;
  updateScore();
}

/**
 * Show current track (one at a time)
 */
function showCurrentTrack() {
  if (currentTrackIndex >= gameTracks.length) {
    finishGame();
    return;
  }

  const previousAudio = document.getElementById("preview-audio");
  if (previousAudio) {
    previousAudio.pause();
    previousAudio.currentTime = 0;
    previousAudio.src = "";
    previousAudio.load();
  }

  const currentTrack = gameTracks[currentTrackIndex];
  const questionTitle = document.getElementById("question-title");
  const currentTrackDisplay = document.getElementById("current-track");
  
  questionTitle.textContent = `Música ${currentTrackIndex + 1}`;
  currentTrackDisplay.textContent = currentTrackIndex + 1;

  renderPreview(currentTrack);
  renderAnswers();
}

/**
 * Render preview for current track
 */
function renderPreview(track) {
  const container = document.getElementById("preview-container");
  container.innerHTML = "";

  const previewCard = document.createElement("div");
  previewCard.className = "preview-card";
  previewCard.id = "preview-card";
  previewCard.dataset.coverImage = track.coverImage || "";

  const playerWrapper = document.createElement("div");
  playerWrapper.className = "player-wrapper";

  const coverContainer = document.createElement("div");
  coverContainer.className = "cover-container";
  coverContainer.id = "cover-container";
  const placeholder = document.createElement("div");
  placeholder.className = "album-cover placeholder-cover";
  placeholder.innerHTML = "🎵";
  coverContainer.appendChild(placeholder);
  playerWrapper.appendChild(coverContainer);

  const playerControls = document.createElement("div");
  playerControls.className = "player-controls";

  if (track.previewUrl) {
    const audio = document.createElement("audio");
    audio.id = "preview-audio";
    audio.src = track.previewUrl;
    audio.preload = "metadata";
    audio.autoplay = false;
    audio.volume = 0.5;

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    progressBar.appendChild(progressFill);
    
    const timeDisplay = document.createElement("div");
    timeDisplay.className = "time-display";
    const currentTime = document.createElement("span");
    currentTime.className = "current-time";
    currentTime.textContent = "0:00";
    const totalTime = document.createElement("span");
    totalTime.className = "total-time";
    totalTime.textContent = "0:00";
    timeDisplay.appendChild(currentTime);
    timeDisplay.appendChild(totalTime);
    
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(timeDisplay);

    const controlsBar = document.createElement("div");
    controlsBar.className = "controls-bar";
    
    const playButton = document.createElement("button");
    playButton.className = "play-button";
    playButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
      </svg>
    `;
    
    playButton.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <rect x="9" y="9" width="2" height="6" fill="currentColor"/>
            <rect x="13" y="9" width="2" height="6" fill="currentColor"/>
          </svg>
        `;
      } else {
        audio.pause();
        playButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
          </svg>
        `;
      }
    });

    const volumeContainer = document.createElement("div");
    volumeContainer.className = "volume-container";
    
    const volumeIcon = document.createElement("div");
    volumeIcon.className = "volume-icon";
    volumeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor"/>
        <path d="M16.5 12C16.5 10.23 15.48 8.71 14.44 7.69L15.85 6.28C17.19 7.6 18 9.47 18 11.5C18 13.53 17.19 15.4 15.85 16.72L14.44 15.31C15.48 14.29 16.5 12.77 16.5 12Z" fill="currentColor"/>
        <path d="M19 12C19 9.11 17.72 6.57 15.73 4.83L14.32 6.24C15.94 7.66 17 9.67 17 12C17 14.33 15.94 16.34 14.32 17.76L15.73 19.17C17.72 17.43 19 14.89 19 12Z" fill="currentColor"/>
      </svg>
    `;
    
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.className = "volume-slider";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = "50";
    volumeSlider.title = "Volume";
    
    volumeSlider.addEventListener("input", (e) => {
      const volume = parseInt(e.target.value) / 100;
      audio.volume = volume;
      updateVolumeIcon(volumeIcon, volume);
    });
    
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeSlider);

    controlsBar.appendChild(playButton);
    controlsBar.appendChild(volumeContainer);

    audio.addEventListener("loadedmetadata", () => {
      const duration = Math.floor(audio.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    });

    audio.addEventListener("timeupdate", () => {
      const current = Math.floor(audio.currentTime);
      const duration = audio.duration || 0;
      const percentage = duration > 0 ? (current / duration) * 100 : 0;
      progressFill.style.width = `${percentage}%`;
      
      const minutes = Math.floor(current / 60);
      const seconds = current % 60;
      currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    });

    audio.addEventListener("ended", () => {
      playButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
        </svg>
      `;
      progressFill.style.width = "0%";
      currentTime.textContent = "0:00";
    });

    playerControls.appendChild(progressContainer);
    playerControls.appendChild(controlsBar);
  } else {
    const noPreview = document.createElement("div");
    noPreview.className = "no-preview";
    noPreview.textContent = "Preview não disponível";
    playerControls.appendChild(noPreview);
  }

  playerWrapper.appendChild(playerControls);
  previewCard.appendChild(playerWrapper);
  container.appendChild(previewCard);
}

/**
 * Update volume icon based on volume level
 */
function updateVolumeIcon(iconElement, volume) {
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
 * Render answer options
 */
function renderAnswers() {
  const container = document.getElementById("answers-container");
  container.innerHTML = "";

  const shuffledAnswers = [...gameTracks].sort(() => Math.random() - 0.5);

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
      placeholderImg.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
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

    option.addEventListener("click", () => {
      if (isGameFinished) return;
      selectAnswer(answerTrack.id);
    });

    container.appendChild(option);
  });
}

/**
 * Select an answer
 */
function selectAnswer(selectedTrackId) {
  const correctTrackId = gameTracks[currentTrackIndex].id;
  userAnswers[currentTrackIndex] = selectedTrackId;

  const audio = document.getElementById("preview-audio");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audio.load();
  }

  showAnswerFeedback(selectedTrackId, correctTrackId);
  updateScore();

  setTimeout(() => {
    currentTrackIndex++;
    if (currentTrackIndex < gameTracks.length) {
      showCurrentTrack();
    } else {
      finishGame();
    }
  }, 1500);
}

/**
 * Show answer feedback
 */
function showAnswerFeedback(selectedTrackId, correctTrackId) {
  const options = document.querySelectorAll(".answer-option");
  const previewCard = document.getElementById("preview-card");
  const coverContainer = document.getElementById("cover-container");

  options.forEach((option) => {
    option.style.pointerEvents = "none";
    if (option.dataset.trackId === selectedTrackId) {
      if (selectedTrackId === correctTrackId) {
        option.classList.add("correct");
        if (previewCard) {
          previewCard.classList.add("correct");
          const coverImage = previewCard.dataset.coverImage;
          if (coverImage && coverContainer) {
            coverContainer.innerHTML = "";
            const coverImg = document.createElement("img");
            coverImg.src = coverImage;
            coverImg.alt = "Album cover";
            coverImg.className = "album-cover";
            coverContainer.appendChild(coverImg);
          }
        }
      } else {
        option.classList.add("incorrect");
        if (previewCard) {
          previewCard.classList.add("incorrect");
        }
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
 * Update score display
 */
function updateScore() {
  let correctCount = 0;
  gameTracks.forEach((track, index) => {
    if (userAnswers[index] === track.id) {
      correctCount++;
    }
  });

  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `${correctCount}/${gameTracks.length}`;
}

/**
 * Finish the game
 */
function finishGame() {
  isGameFinished = true;
  let correctCount = 0;
  const results = [];

  gameTracks.forEach((track, index) => {
    const isCorrect = userAnswers[index] === track.id;
    if (isCorrect) {
      correctCount++;
    }
    results.push({
      track,
      isCorrect,
      userAnswer: gameTracks.find((t) => t.id === userAnswers[index]),
    });
  });

  setTimeout(() => {
    showResult(correctCount, results);
  }, 500);
}

/**
 * Show result modal
 */
function showResult(correctCount, results) {
  const modal = document.getElementById("result-modal");
  const title = document.getElementById("result-title");
  const message = document.getElementById("result-message");
  const details = document.getElementById("result-details");

  title.textContent = "Resultado Final";
  message.textContent = `Você acertou ${correctCount} de ${gameTracks.length} músicas!`;

  details.innerHTML = "";
  results.forEach((result, index) => {
    const item = document.createElement("div");
    item.className = `result-item ${result.isCorrect ? "correct" : "incorrect"}`;
    item.innerHTML = `
      <strong>Música ${index + 1}:</strong><br>
      ${result.isCorrect ? "✅" : "❌"} ${result.track.title} - ${result.track.artist}
      ${!result.isCorrect ? `<br><small>Você escolheu: ${result.userAnswer?.title} - ${result.userAnswer?.artist}</small>` : ""}
    `;
    details.appendChild(item);
  });

  modal.classList.remove("hidden");
}

/**
 * Hide result modal
 */
function hideResult() {
  const modal = document.getElementById("result-modal");
  modal.classList.add("hidden");
}

/**
 * Show/hide functions
 */
function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function showGame() {
  document.getElementById("game-container").classList.remove("hidden");
}

function hideGame() {
  document.getElementById("game-container").classList.add("hidden");
}

function showError(message) {
  const errorContainer = document.getElementById("error-container");
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorContainer.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error-container").classList.add("hidden");
}

/**
 * Event listeners
 */
document.getElementById("new-game-btn").addEventListener("click", initGame);
document.getElementById("close-modal-btn").addEventListener("click", hideResult);
document.getElementById("retry-btn").addEventListener("click", initGame);

/**
 * Initialize game on page load
 */
window.addEventListener("DOMContentLoaded", initGame);
