// Ladda in ljudfilen
const audio = new Audio("/static/audio/Det var så roligt Ljudfiler/Det var så roligt Alt.mp3");

// När sidan laddas – koppla knapparna till funktionerna
document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play-button");
    const pauseButton = document.getElementById("pause-button");

    playButton.addEventListener("click", function () {
        audio.play();
    });

    pauseButton.addEventListener("click", function () {
        audio.pause();
    });
});
