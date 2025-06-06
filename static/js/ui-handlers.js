// ui-handlers.js
import { initAudioEngine } from "./audio-engine.js";
import { songs } from "./songs.js";

document.addEventListener("DOMContentLoaded", () => {

  const audioAPI = initAudioEngine();   

  const playBtn  = document.getElementById("play-button");
  const pauseBtn = document.getElementById("pause-button");

  const progressBar  = document.getElementById("seek");
  const curTimeLabel = document.getElementById("cur-time");
  const totTimeLabel = document.getElementById("tot-time");

  // ── tempo-element ──────────────────────────────────────────
  const tempoSlider  = document.getElementById("tempo-slider");
  const tempoDisplay = document.getElementById("tempo-display");

/* Standard-BPM for current song – overwrites in loadSong/nextSong */
let defaultBpm = +tempoSlider.value;    // 136

  function fmt(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  }

  playBtn.addEventListener("click", () => {
    audioAPI.play();
    playBtn.style.display  = "none";
    pauseBtn.style.display = "inline";
  });

  pauseBtn.addEventListener("click", () => {
    audioAPI.pause();
    playBtn.style.display  = "inline";
    pauseBtn.style.display = "none";
  });

    /* ── Connect currentTime → slider & lables ─────────────── */
  audioAPI.onTimeUpdate((now, total) => {
    if (total) {               
      progressBar.max           = total;
      totTimeLabel.textContent  = fmt(total);
    }
    progressBar.value           = now;   // Move circle position
    curTimeLabel.textContent    = fmt(now);
  });

  /* ── Tempo-slider → change playbackRate ───────────────────── */
  tempoSlider.addEventListener("input", () => {
    const bpm    = +tempoSlider.value;      // Read slider-value (t.ex. 150)
    const factor = bpm / defaultBpm;        // 150 / 136 ≈ 1,10

    audioAPI.setPlaybackRate(factor);     
    tempoDisplay.textContent = `${bpm} BPM`; // Update label in the UI
  });

  
  progressBar.classList.add("scrubbable");
  progressBar.addEventListener("input",() => audioAPI.seekTo(+progressBar.value));


  const openBtn  = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");

  openBtn .addEventListener("click", () => sideMenu.classList.add("open"));
  closeBtn.addEventListener("click", () => sideMenu.classList.remove("open"));

  const resetTempoBtn = document.querySelector('[data-reset="tempo"]');

  resetTempoBtn.addEventListener("click", () => {
    tempoSlider.value       = defaultBpm;          // 136 or the songs own BPM
    tempoDisplay.textContent = `${defaultBpm} BPM`;
    audioAPI.setPlaybackRate(1);                   // Back to original tempo
  });

  let current = 0; 
  let currentSong = songs[0];                           

  function nextSong() {
    current = (current + 1) % songs.length;
    loadSelectedSong();
  }
  
  function prevSong() {
    current = (current - 1 + songs.length) % songs.length;
    loadSelectedSong();
  }
  
  function loadSelectedSong() {
    audioAPI.loadSong(songs[current]);
    currentSong = songs[current];

    defaultBpm = currentSong.defaultBpm;
  
    const minBpm = Math.round(defaultBpm * 0.9);   // –10%
    const maxBpm = Math.round(defaultBpm * 1.1);   // +10%
    
    tempoSlider.min  = minBpm;
    tempoSlider.max  = maxBpm;
    tempoSlider.value = defaultBpm;
    tempoDisplay.textContent = `${tempoSlider.value} BPM`;
    
    audioAPI.setPlaybackRate(1);
  
    progressBar.value        = 0;
    curTimeLabel.textContent = "00:00";
    totTimeLabel.textContent = "--:--";
  
    
    playBtn.style.display  = "inline";
    pauseBtn.style.display = "none";
  }

  document
    .querySelector('img[alt="shuffle"]')       
    .addEventListener("click", nextSong);

  document
    .querySelector('img[alt="fast-forward"]')
    .addEventListener("click", nextSong);
  
  document
    .querySelector('img[alt="rewind"]')
    .addEventListener("click", prevSong);

  const toggleBtn = document.querySelector('#toggle-btn'); 
  const lyricsBox = document.getElementById('song-lyrics'); 

  const seeLyricsSrc = toggleBtn.getAttribute('data-see-lyrics');  
  const hideLyricsSrc = toggleBtn.getAttribute('data-hide-lyrics'); 

  lyricsBox.style.display = 'block'; 
  toggleBtn.src = seeLyricsSrc; 

  toggleBtn.addEventListener('click', function () {

    lyricsBox.style.display = (lyricsBox.style.display === 'none') ? 'block' : 'none';
    toggleBtn.src = (lyricsBox.style.display === 'none') ? hideLyricsSrc : seeLyricsSrc;
  });

  function fillModal(action) {
    if (!currentSong) return;
  
    if (action === "tips") {
      const body = document.getElementById("tipsModalBody");
      body.innerHTML = `
        <h6>Fokus på text</h6>
        <ul>${currentSong.tips.focusText
                .map(t => `<li>${t}</li>`).join("")}</ul>
  
        <h6>Musikens form som inom-musikaliskt fokus</h6>
        <ul>${currentSong.tips.musikForm
                .map(t => `<li>${t}</li>`).join("")}</ul>`;
    }
  
    if (action === "info") {
      document.getElementById("infoModalBody").innerHTML =
        currentSong.infoHtml;
    }
  }
/* ----- Modalbuttons (tips, info) ------------------------------ */
document.querySelectorAll('[data-action]').forEach(btn => {
  const action = btn.dataset.action;          // "tips", "info", "lang" ...

  if (action === 'tips' || action === 'info') {
    btn.addEventListener('click', () => {
      fillModal(action);       
      bootstrap.Modal
        .getOrCreateInstance(
          document.getElementById(`${action}Modal`)
        )
        .show();
    });
  }
});

const langBtn = document.querySelector('[data-action="lang"]');
const langMenu = document.getElementById("language-menu");

langBtn.addEventListener("click", (e) => {
  // Toggle meny
  const isVisible = langMenu.style.display === "block";
  langMenu.style.display = isVisible ? "none" : "block";

  if (!isVisible) {
    const rect = langBtn.getBoundingClientRect();

    // Positionera meny under knappen
    langMenu.style.position = "absolute";
    langMenu.style.top = `${rect.bottom + window.scrollY}px`;
    langMenu.style.left = `${rect.left + window.scrollX}px`;
  }
});

document.addEventListener("click", (e) => {
  if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
    langMenu.style.display = "none";
  }
});
});  