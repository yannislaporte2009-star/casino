let credits = parseInt(localStorage.getItem('Credits')) || 100;

const creditsEl = document.getElementById('Credits');

function updateDisplay() {
  creditsEl.textContent = credits;
}

updateDisplay();


function getPlayerName() {
  let name = localStorage.getItem('playerName');
  if (!name) {
    name = prompt("Wie ist dein Name?", "Spieler") || "Spieler";
    localStorage.setItem('playerName', name);
  }
  return name;
}

getPlayerName();

const slotsBTN = document.getElementById('slot-machine');

slotsBTN.addEventListener('click', () => {
  window.location.href = "slots.html";
});

const highscoreBTN = document.getElementById('highscore-button');

highscoreBTN.addEventListener('click', () => {
  window.location.href = "bestenliste.html";
});