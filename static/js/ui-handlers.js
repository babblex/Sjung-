// ui-handlers.js
import { initAudioEngine } from "./audio-engine.js";
import { songs } from "./songs.js";

document.addEventListener("DOMContentLoaded", () => {

  const audioAPI = initAudioEngine();   

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



  const openBtn  = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");

  openBtn .addEventListener("click", () => sideMenu.classList.add("open"));
  closeBtn.addEventListener("click", () => sideMenu.classList.remove("open"));

  const resetTempoBtn = document.querySelector('[data-reset="tempo"]');
  const tempoSlider   = document.getElementById("tempo-slider");
  const tempoDisplay  = document.getElementById("tempo-display");

  const DEFAULT_TEMPO = parseInt(tempoSlider.getAttribute("value"), 10); // 130

  resetTempoBtn.addEventListener("click", () => {
    tempoSlider.value  = DEFAULT_TEMPO;
    tempoDisplay.textContent = `${DEFAULT_TEMPO} BPM`;

  });

  let current = 0;                            

  function nextSong() {
    current = (current + 1) % songs.length;    
    audioAPI.loadSong(songs[current]);         
    audioAPI.play();                           
    playBtn .style.display = "none";           
    pauseBtn.style.display = "inline";
  }

  
  document
    .querySelector('img[alt="shuffle"]')       
    .addEventListener("click", nextSong);
});


document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('#toggleBtn'); 
  const lyricsBox = document.getElementById('song-lyrics'); 

  const seeLyricsSrc = toggleBtn.getAttribute('data-see-lyrics');  
  const hideLyricsSrc = toggleBtn.getAttribute('data-hide-lyrics'); 

  lyricsBox.style.display = 'block'; 
  toggleBtn.src = seeLyricsSrc; 


  toggleBtn.addEventListener('click', function () {

    lyricsBox.style.display = (lyricsBox.style.display === 'none') ? 'block' : 'none';
    toggleBtn.src = (lyricsBox.style.display === 'none') ? hideLyricsSrc : seeLyricsSrc;
  });
});