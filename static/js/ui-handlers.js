// ui-handlers.js
import { initAudioEngine } from "./audio-engine.js";

document.addEventListener("DOMContentLoaded", () => {
  /* === A.  starta ljudmotorn === */
  const audioAPI = initAudioEngine();   // { play, pause, ctx }

  /* === B.  play/pause‑knappar === */
  const playBtn  = document.getElementById("play-button");
  const pauseBtn = document.getElementById("pause-button");

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

  /* === C.  sidomeny === */
  const openBtn  = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");

  openBtn .addEventListener("click", () => sideMenu.classList.add("open"));
  closeBtn.addEventListener("click", () => sideMenu.classList.remove("open"));
});