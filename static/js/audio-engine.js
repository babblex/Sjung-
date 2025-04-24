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
    const sVocals = document.getElementById("vol-vocals");
    const sInstr  = document.getElementById("vol-instr");
  
    sMaster.addEventListener("input", () => gainMaster.gain.value = +sMaster.value);
    sVocals.addEventListener("input", () => gainVocals.gain.value = +sVocals.value);
    sInstr.addEventListener("input", () => gainInstr.gain.value   = +sInstr.value);
  
    function play()  { ctx.resume(); audioVocals.play(); audioInstr.play(); }
    function pause() { audioVocals.pause(); audioInstr.pause(); }
  
    return { play, pause, ctx };  
  }