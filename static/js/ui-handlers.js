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

    /* ── koppla currentTime → slider & etiketter ─────────────── */
  audioAPI.onTimeUpdate((now, total) => {
    if (total) {                         // duration blir känd efter metadata
      progressBar.max           = total;
      totTimeLabel.textContent  = fmt(total);
    }
    progressBar.value           = now;   // flytta pricken
    curTimeLabel.textContent    = fmt(now);
  });

  
  progressBar.classList.add("scrubbable");
  progressBar.addEventListener("input",() => audioAPI.seekTo(+progressBar.value));


  const openBtn  = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");

  openBtn .addEventListener("click", () => sideMenu.classList.add("open"));
  closeBtn.addEventListener("click", () => sideMenu.classList.remove("open"));

  const resetTempoBtn = document.querySelector('[data-reset="tempo"]');
  const tempoSlider   = document.getElementById("tempo-slider");
  const tempoDisplay  = document.getElementById("tempo-display");

  const DEFAULT_TEMPO = parseInt(tempoSlider.getAttribute("value"), 10);

  resetTempoBtn.addEventListener("click", () => {
    tempoSlider.value  = DEFAULT_TEMPO;
    tempoDisplay.textContent = `${DEFAULT_TEMPO} BPM`;

  });

  let current = 0; 
  let currentSong = songs[0];                           

  function nextSong() {
    current = (current + 1) % songs.length;    
    audioAPI.loadSong(songs[current]);
    currentSong = songs[current];
    
    progressBar.value        = 0;
    curTimeLabel.textContent = "00:00";
    totTimeLabel.textContent = "--:--";


    audioAPI.play();                           
    playBtn .style.display = "none";           
    pauseBtn.style.display = "inline";
  }

  document
    .querySelector('img[alt="shuffle"]')       
    .addEventListener("click", nextSong);

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
/* ----- Modalknappar (tips, info) ------------------------------ */
document.querySelectorAll('[data-action]').forEach(btn => {
  const action = btn.dataset.action;          // "tips", "info", "lang" ...

  if (action === 'tips' || action === 'info') {
    btn.addEventListener('click', () => {
      fillModal(action);                      // <-- NYTT
      bootstrap.Modal
        .getOrCreateInstance(
          document.getElementById(`${action}Modal`)
        )
        .show();
    });
  }
});         
});  