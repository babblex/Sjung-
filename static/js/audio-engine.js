// audio-engine.js
import { songs } from "./songs.js";   // ✔

export function initAudioEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const audioVocals = new Audio();
  const audioInstr  = new Audio();
  audioVocals.crossOrigin = audioInstr.crossOrigin = "anonymous";

  const srcVocals = ctx.createMediaElementSource(audioVocals);
  const srcInstr  = ctx.createMediaElementSource(audioInstr);

  const gainMaster = ctx.createGain();
  const gainVocals = ctx.createGain();
  const gainInstr  = ctx.createGain();

  srcVocals.connect(gainVocals).connect(gainMaster);
  srcInstr.connect(gainInstr).connect(gainMaster);
  gainMaster.connect(ctx.destination);

  /* ------- sliders ------------------------------------------- */
  const sMaster = document.getElementById("vol-master");
  gainMaster.gain.value = parseFloat(sMaster.value);

  const sVocals = document.getElementById("vol-vocals");
  const sInstr  = document.getElementById("vol-instr");

  /* ------- mute-knapp --------------------------- */
  const muteBtn  = document.querySelector('.mute-btn[data-track="master"]');
  const muteIcon = muteBtn.querySelector('img');

  let prevMasterValue = sMaster.value;

  muteBtn.addEventListener("click", () => {
    const nowMuted = muteBtn.classList.toggle("muted");
    if (nowMuted) {
      prevMasterValue        = sMaster.value;
      sMaster.value          = 0;
      gainMaster.gain.value  = 0;
      muteIcon.src = "/static/images/icon_mute.png";
    } else {
      sMaster.value          = prevMasterValue;
      gainMaster.gain.value  = parseFloat(prevMasterValue);
      muteIcon.src = "/static/images/icon_unmute.png";
    }
  });

  /* ------- volym-reset -------------------------- */
  const DEFAULT_MASTER = 0.5, DEFAULT_VOCALS = 1, DEFAULT_INSTR = 1;

  const resetVolBtn = document.querySelector(
    ".panel--volume [data-reset='volume']"
  );

  function resetVolumes() {
    sMaster.value = DEFAULT_MASTER;
    sVocals.value = DEFAULT_VOCALS;
    sInstr.value  = DEFAULT_INSTR;

    gainMaster.gain.value = DEFAULT_MASTER;
    gainVocals.gain.value = DEFAULT_VOCALS;
    gainInstr.gain.value  = DEFAULT_INSTR;

    muteBtn.classList.remove("muted");
    muteIcon.src = "/static/images/icon_unmute.png";
  }
  resetVolBtn.addEventListener("click", resetVolumes);

  /* ------- ★ loadSong-funktionen ----------------------------- */
  function loadSong(song) {
    audioVocals.src  = song.audioVocals;
    audioInstr.src   = song.audioInstr;
    audioVocals.load();           
    audioInstr.load();            
    audioVocals.currentTime = audioInstr.currentTime = 0;

    document.getElementById("song-title").textContent   = song.title;
    document.getElementById("song-writers").textContent =
      "Text & musik: " + song.writers.join(", ");
    document.getElementById("song-lyrics").textContent  = song.lyrics;
  }

  /* ------- ladda första låten -------------------------------- */
  loadSong(songs[0]);

  /* ------- sliders → gain-lyssnare ------------- */
  sMaster.addEventListener("input", () => gainMaster.gain.value = +sMaster.value);
  sVocals.addEventListener("input", () => gainVocals.gain.value = +sVocals.value);
  sInstr .addEventListener("input", () => gainInstr .gain.value = +sInstr .value);

  /* ------- play/pause ---------------------------------------- */
  function play()  { ctx.resume(); audioVocals.play(); audioInstr.play(); }
  function pause() {               audioVocals.pause(); audioInstr.pause(); }

  // ⭐ Anropas varje gång ljudspelaren rapporterar ny tid
  function onTimeUpdate(callback) {
    audioVocals.addEventListener("timeupdate", () => {
      callback(audioVocals.currentTime, audioVocals.duration || 0);
    });
  }

  // ⭐ Hoppa till valfri position i låten (scrub)
  function seekTo(seconds) {
    audioVocals.currentTime = seconds;
    audioInstr.currentTime  = seconds;  // håller spåren i synk
  }

  /* ------- export -------------------------------------------- */
  return { play, pause, loadSong, resetVolumes, ctx,
    onTimeUpdate, seekTo };   
}
