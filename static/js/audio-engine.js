// audio-engine.js
import { songs } from "./songs.js";

export function initAudioEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const audioVocals = new Audio();
  const audioInstr  = new Audio();

  audioVocals.preservesPitch = audioInstr.preservesPitch = true;      
  audioVocals.webkitPreservesPitch = audioInstr.webkitPreservesPitch = true;
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
    document.getElementById("song-writers").innerHTML   =
      "<strong>Låtskrivare:</strong> " + song.writers.join(", ");
    document.getElementById("song-lyrics").textContent  = song.lyrics;

     // ── tempo UI vid första inladdningen ───────────────────────
    const tempoSlider  = document.getElementById("tempo-slider");
    const tempoDisplay = document.getElementById("tempo-display");
    tempoSlider.value       = song.defaultBpm;           
    tempoDisplay.textContent = `${song.defaultBpm} BPM`;
    setPlaybackRate(1);                                  // originalhastighet
  }

  /* ------- ladda första låten -------------------------------- */
  loadSong(songs[0]);

  /* ------- sliders → gain-lyssnare ------------- */
  sMaster.addEventListener("input", () => {
    const val = +sMaster.value;
    gainMaster.gain.value = val;
  
    /* --- synka mute-knappen ---------------------------------- */
    if (val === 0) {                          // volym = 0  ⇒ visa MUTED
      if (!muteBtn.classList.contains("muted")) {
        muteBtn.classList.add("muted");
        muteIcon.src = "/static/images/icon_mute.png";
      }
    } else {                                  // volym > 0 ⇒ visa UNMUTED
      if (muteBtn.classList.contains("muted")) {
        muteBtn.classList.remove("muted");
        muteIcon.src = "/static/images/icon_unmute.png";
      }
      /* spara ev. nytt ”senaste värde” för återställning */
      prevMasterValue = sMaster.value;
    }
  });
  sVocals.addEventListener("input", () => gainVocals.gain.value = +sVocals.value);
  sInstr .addEventListener("input", () => gainInstr .gain.value = +sInstr .value);

  /* ------- play/pause ---------------------------------------- */
  function play()  { ctx.resume(); audioVocals.play(); audioInstr.play(); }
  function pause() {               audioVocals.pause(); audioInstr.pause(); }

  function setPlaybackRate(factor) {
    audioVocals.playbackRate = factor;   // båda spår får samma faktor
    audioInstr .playbackRate = factor;
  }

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
  // ── När låten tar slut ─────────────────────────────────────
  audioVocals.addEventListener("ended", () => {
  // 1. Återställ uppspelningstiden
    audioVocals.currentTime = 0;
    audioInstr.currentTime  = 0;

  // 2. Visa play-knapp, göm paus
    const playBtn  = document.getElementById("play-button");
    const pauseBtn = document.getElementById("pause-button");
    playBtn.style.display  = "inline";
    pauseBtn.style.display = "none";

  // 3. Återställ progress-baren & tidsetiketter
    const progressBar = document.getElementById("seek");
    const curTime     = document.getElementById("cur-time");
    const totTime     = document.getElementById("tot-time");

    progressBar.value        = 0;
    curTime.textContent      = "00:00";
    totTime.textContent      = "--:--";
  });

  /* ------- export -------------------------------------------- */
  return { play, pause, loadSong, resetVolumes, ctx,
    onTimeUpdate, seekTo, setPlaybackRate  };   
}
