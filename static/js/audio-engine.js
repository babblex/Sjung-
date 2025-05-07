// audio-engine.js
export function initAudioEngine() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const audioVocals = new Audio("/static/audio/Det var så roligt Ljudfiler/Det var så roligt Sopran.mp3");
    const audioInstr  = new Audio("/static/audio/Det var så roligt Ljudfiler/Det var så roligt No vocals.mp3");
    audioVocals.crossOrigin = audioInstr.crossOrigin = "anonymous";
  
    const srcVocals = ctx.createMediaElementSource(audioVocals);
    const srcInstr  = ctx.createMediaElementSource(audioInstr);
  
    const gainMaster = ctx.createGain();
    const gainVocals = ctx.createGain();
    const gainInstr  = ctx.createGain();
  
    srcVocals.connect(gainVocals).connect(gainMaster);
    srcInstr.connect(gainInstr).connect(gainMaster);
    gainMaster.connect(ctx.destination);
  
    const sMaster = document.getElementById("vol-master");
    gainMaster.gain.value = parseFloat(sMaster.value);
    const sVocals = document.getElementById("vol-vocals");
    const sInstr  = document.getElementById("vol-instr");

        // === MUTE-knappen (master) ===========================================
    const muteBtn   = document.querySelector('.mute-btn[data-track="master"]');
    const muteIcon  = muteBtn.querySelector('img');

    let prevMasterValue = sMaster.value;     // minne för volym före mute

    muteBtn.addEventListener('click', () => {
      const nowMuted = muteBtn.classList.toggle('muted');   // växlar klass

      if (nowMuted) {
        // --- Stäng av ljudet men låt låtarna spela vidare ---
        prevMasterValue     = sMaster.value;                // spara gammalt värde
        sMaster.value       = 0;
        gainMaster.gain.value = 0;
        muteIcon.src = "/static/images/icon_mute.png";
      } else {
        // --- Återställ till tidigare nivå ---
        sMaster.value       = prevMasterValue;
        gainMaster.gain.value = parseFloat(prevMasterValue);
        muteIcon.src = "/static/images/icon_unmute.png";
      }
    });

    const DEFAULT_MASTER = 0.5;
    const DEFAULT_VOCALS = 1;
    const DEFAULT_INSTR  = 1;
  
    const resetVolBtn = document.querySelector(
      '.panel--volume [data-reset="volume"]'
    );
  
    function resetVolumes() {
      // flytta sliders
      sMaster.value = DEFAULT_MASTER;
      sVocals.value = DEFAULT_VOCALS;
      sInstr.value  = DEFAULT_INSTR;
  
      // uppdatera gains
      gainMaster.gain.value = DEFAULT_MASTER;
      gainVocals.gain.value = DEFAULT_VOCALS;
      gainInstr.gain.value  = DEFAULT_INSTR;
  
      // slå av ev. mute + byt ikon
      muteBtn.classList.remove('muted');
      muteIcon.src = "/static/images/icon_unmute.png";
    }
  
    resetVolBtn.addEventListener('click', resetVolumes);

  
    sMaster.addEventListener("input", () => gainMaster.gain.value = +sMaster.value);
    sVocals.addEventListener("input", () => gainVocals.gain.value = +sVocals.value);
    sInstr.addEventListener("input", () => gainInstr.gain.value   = +sInstr.value);
  
    function play()  { ctx.resume(); audioVocals.play(); audioInstr.play(); }
    function pause() { audioVocals.pause(); audioInstr.pause(); }
  
    return { play, pause, ctx };  
  }