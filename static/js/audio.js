// Ladda in ljudfilen
const audio = new Audio("/static/audio/Det var så roligt Ljudfiler/Det var så roligt No vocals.mp3");

// När sidan laddas – koppla knapparna till funktionerna
document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play-button");
    const pauseButton = document.getElementById("pause-button");

// Initialt, se till att endast play-knappen är synlig
playButton.style.display = "inline";
pauseButton.style.display = "none";


// När play-knappen klickas
playButton.addEventListener("click", function () {
    audio.play();
    // Byt bild: visa pause-knappen, göm play-knappen
    playButton.style.display = "none";
    pauseButton.style.display = "inline";
});

// När pause-knappen klickas
pauseButton.addEventListener("click", function () {
    audio.pause();
    // Byt bild: visa play-knappen, göm pause-knappen
    playButton.style.display = "inline";
    pauseButton.style.display = "none";
});

// När ljudet är slut, visa play-knappen och göm pause-knappen igen
audio.addEventListener("ended", function () {
    playButton.style.display = "inline";
    pauseButton.style.display = "none";
});
});
// Sidomeny - visa/dölj
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");

    menuButton.addEventListener("click", function () {
        sideMenu.classList.toggle("open");
    });
});
