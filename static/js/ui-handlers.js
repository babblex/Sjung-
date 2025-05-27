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
  const elCur  = document.getElementById("lyric-current");
  const elNext = document.getElementById("lyric-next");
  let   cueIndex = 0;

  // ── tempo-element ──────────────────────────────────────────
  const tempoSlider  = document.getElementById("tempo-slider");
  const tempoDisplay = document.getElementById("tempo-display");

/* Standard-BPM för aktuell låt – skrivs över i loadSong/nextSong */
let defaultBpm = +tempoSlider.value;    // 136 vid sidladdning

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

  let currentSong = songs[0];

    /* ── koppla currentTime → slider & etiketter ─────────────── */
  audioAPI.onTimeUpdate((now, total) => {
    if (total) {                         // duration blir känd efter metadata
      progressBar.max           = total;
      totTimeLabel.textContent  = fmt(total);
    }
    progressBar.value           = now;   // flytta pricken
    curTimeLabel.textContent    = fmt(now);
    


        const cues = currentSong.cues;
    if (cues && cueIndex + 1 < cues.length &&
        now >= cues[cueIndex + 1].t) {

      cueIndex++;

      // animera båda raderna upp en radhöjd (2.7 rem)
      elCur.style.transform  = "translateY(-2.7rem)";
      elNext.style.transform = "translateY(-2.7rem)";

      // efter animationen (350 ms) – återställ position och text
      setTimeout(() => {
        elCur.style.transform  = "translateY(0)";
        elNext.style.transform = "translateY(0)";
        elCur.textContent  = cues[cueIndex].line;
        elNext.textContent = cues[cueIndex + 1]?.line || "";
      }, 350);
    }
  });

  /* ── Tempo-slider → ändra playbackRate ───────────────────── */
  tempoSlider.addEventListener("input", () => {
    const bpm    = +tempoSlider.value;      // läs slider-värde (t.ex. 150)
    const factor = bpm / defaultBpm;        // 150 / 136 ≈ 1,10

    audioAPI.setPlaybackRate(factor);       // skalar båda ljudspår
    tempoDisplay.textContent = `${bpm} BPM`; // uppdatera etiketten i UI:t
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
    tempoSlider.value       = defaultBpm;          // 136 eller låtens egen BPM
    tempoDisplay.textContent = `${defaultBpm} BPM`;
    audioAPI.setPlaybackRate(1);                   // ← NY rad: tillbaka till originaltempo
  });

  let current = 0;                            

  function nextSong() {
    current = (current + 1) % songs.length;    
    audioAPI.loadSong(songs[current]);
    currentSong = songs[current];
    cueIndex            = 0;
    elCur.textContent   = currentSong.cues[0]?.line || "";
    elNext.textContent  = currentSong.cues[1]?.line || "";
    elCur.style.transform  = "translateY(0)";
    elNext.style.transform = "translateY(0)";

    /* ── tempo UI när vi byter låt ─────────────────────────────── */
    defaultBpm             = currentSong.defaultBpm;   // ny referens-BPM
    tempoSlider.min        = 100;                       // samma spann
    tempoSlider.max        = 175;
    tempoSlider.value      = defaultBpm;
    tempoDisplay.textContent = `${defaultBpm} BPM`;
    audioAPI.setPlaybackRate(1);                       // återställ hastighet

    
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

    /* ----- ögon-ikonen: visa/dölj långtext ------------------------ */
  const toggleBtn  = document.getElementById("toggle-btn");
  const lyricsFull = document.getElementById("song-lyrics");

  const showIcon = toggleBtn.getAttribute("data-see-lyrics");   // öppen ikon
  const hideIcon = toggleBtn.getAttribute("data-hide-lyrics");  // stängd ikon

  toggleBtn.src = showIcon;           // startläge: text dold

  toggleBtn.addEventListener("click", () => {
    const isHidden = lyricsFull.classList.toggle("d-none"); // växla synlighet
    toggleBtn.src   = isHidden ? showIcon : hideIcon;       // byt ikon
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