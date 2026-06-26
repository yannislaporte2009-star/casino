let credits = parseInt(localStorage.getItem('slotCredits')) || 100;

const creditsEl = document.getElementById('credits');

function updateDisplay() {
  creditsEl.textContent = credits;
}

updateDisplay();

// Spielername einmalig abfragen und in localStorage speichern
function getPlayerName() {
  let name = localStorage.getItem('playerName');
  if (!name) {
    try {
      name = prompt("Wie ist dein Name?", "Spieler") || "Spieler";
    } catch (e) {
      name = "Spieler";
    }
    localStorage.setItem('playerName', name);
  }
  return name;
}

// Sicherstellen, dass beim ersten Besuch direkt nach dem Namen gefragt wird
getPlayerName();

const slotsBTN = document.getElementById('slot-machine');

slotsBTN.addEventListener('click', () => {
  window.location.href = "slots.html";
});

const highscoreBTN = document.getElementById('highscore-button');

highscoreBTN.addEventListener('click', () => {
  window.location.href = "bestenliste.html";
});