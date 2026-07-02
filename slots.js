const symbols = ["🎰", "🍒", "🍋", "🍇", "⭐"];
const payouts = { "🎰": 30, "🍒": 10, "🍋": 10, "🍇": 10, "⭐": 20 };

let credits = parseInt(localStorage.getItem('slotCredits')) || 100;

let bet = 10;
let spinning = false;
localStorage.setItem('slotCredits', credits);

const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet-display');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const betMinus10 = document.getElementById('bet-minus-10');
const betMinus100 = document.getElementById('bet-minus-100');
const betMinus1000 = document.getElementById('bet-minus-1000');
const betMinushalb = document.getElementById('bet-minus-/2');
const betMinusmin = document.getElementById('bet-minus-Min');
const betPlus10 = document.getElementById('bet-plus-10');
const betPlus100 = document.getElementById('bet-plus-100');
const betPlus1000 = document.getElementById('bet-plus-1000');
const betPlusdoppel = document.getElementById('bet-plus-x2');
const betPlusmax = document.getElementById('bet-plus-Max');
const escBtn = document.getElementById('esc');
const reels = [document.getElementById('reel0'), document.getElementById('reel1'), document.getElementById('reel2')];

// Schalter (Toggles)
const autospinToggle = document.getElementById('autospin');
const autoMaxToggle = document.getElementById('auto-max-einsatz');

updateDisplay();

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateDisplay() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  localStorage.setItem('slotCredits', credits);
}

// Speichert einen Gewinn in der Bestenliste (localStorage)
const JSONBIN_BIN_ID = '6a3e350dda38895dfe01939c';
const JSONBIN_ACCESS_KEY = '$2a$10$titeiD3M2vVROlysgeWMU.paA12GSjVGUVumB/TaeJ0fGlp2yH6NC';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

async function saveHighscore() {
  let name = localStorage.getItem('playerName');
  if (!name) {
    try {
      name = prompt("Wie ist dein Name?", "Spieler") || "Spieler";
    } catch (e) {
      name = "Spieler";
    }
    localStorage.setItem('playerName', name);
  }

  try {
    // Aktuelle Bestenliste vom Server laden
    const getResponse = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Access-Key': JSONBIN_ACCESS_KEY }
    });
    const getData = await getResponse.json();
    const list = (getData.record && getData.record.highscores) ? getData.record.highscores : [];

    const existingEntry = list.find(entry => entry.name === name);

    if (existingEntry) {
      if (credits > existingEntry.score) {
        existingEntry.score = credits;
      }
    } else {
      list.push({ name: name, score: credits });
    }

    // Aktualisierte Liste zurück auf den Server schreiben
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': JSONBIN_ACCESS_KEY
      },
      body: JSON.stringify({ highscores: list })
    });
  } catch (e) {
    console.error('Highscore konnte nicht gespeichert werden:', e);
  }
}

betMinus10.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet - 10);
  updateDisplay();
});
betMinus100.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet - 100);
  updateDisplay();
});
betMinus1000.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet - 1000);
  updateDisplay();
});

betMinushalb.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet / 2);
  updateDisplay();
});
betMinusmin.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet = 10);
  updateDisplay();
});

betPlus10.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000000000, bet + 10);
  updateDisplay();
});

betPlus100.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000000000, bet + 100);
  updateDisplay();
});

betPlus1000.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000000000, bet + 1000);
  updateDisplay();
});

betPlusdoppel.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000000000, bet * 2);
  updateDisplay();
});

betPlusmax.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000000000, bet = credits);
  updateDisplay();
});

escBtn.addEventListener('click', () => {
  window.location.href = "index.html";
});

function spinReel(reelEl, duration) {
  return new Promise(resolve => {
    const start = Date.now();
    const interval = setInterval(() => {
      reelEl.textContent = randomSymbol();
      if (Date.now() - start > duration) {
        clearInterval(interval);
        const finalSymbol = randomSymbol();
        reelEl.textContent = finalSymbol;
        resolve(finalSymbol);
      }
    }, 60);
  });
}

async function doSpin() {
  if (spinning) return;

  // Wenn "Auto Max" aktiv ist, Einsatz automatisch auf Maximum setzen
  if (autoMaxToggle.checked) {
    bet = credits / 10;
    bet = Math.min(1000000000000, bet);
    bet = Math.max(10, bet);  // Sicherstellen, dass der Einsatz mindestens 10 beträgt
    bet = Math.round(bet);
    updateDisplay();
  }

  if (credits < bet) {
    messageEl.textContent = "Nicht genug Guthaben!";
    return;
  }

  spinning = true;
  spinBtn.disabled = true;
  betMinus10.disabled = true;
  betPlus10.disabled = true;
  betMinus100.disabled = true;
  betPlus100.disabled = true;
  betMinus1000.disabled = true;
  betPlus1000.disabled = true;
  betMinushalb.disabled = true;
  betPlusdoppel.disabled = true;
  betMinusmin.disabled = true;
  betPlusmax.disabled = true;
  credits -= bet;
  updateDisplay();
  messageEl.textContent = "Walzen drehen...";

  const results = await Promise.all([
    spinReel(reels[0], 600),
    spinReel(reels[1], 900),
    spinReel(reels[2], 1200)
  ]);

  let win = 0;

  if (results[0] === results[1] && results[1] === results[2]) {
    win = bet * payouts[results[0]];
    credits += win;
    messageEl.textContent = "Gewonnen! +" + win + " Guthaben";
  } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
    win = Math.round(bet * 2);
    credits += win;
    messageEl.textContent = "Zwei gleiche! +" + win + " Guthaben";
  } else {
    messageEl.textContent = "Leider verloren. Nochmal versuchen!";
  }

  if (win > 0) {
    await saveHighscore();
  }

  updateDisplay();
  spinning = false;
  spinBtn.disabled = false;
  betPlus10.disabled = false;
  betMinus10.disabled = false;
  betPlus100.disabled = false;
  betMinus100.disabled = false;
  betPlus1000.disabled = false;
  betMinus1000.disabled = false;
  betPlusdoppel.disabled = false;
  betMinushalb.disabled = false;
  betPlusmax.disabled = false;
  betMinusmin.disabled = false;

  if (credits <= 0) {
    messageEl.textContent = "Guthaben aufgebraucht. Spiel wird zurückgesetzt.";
    
    setTimeout(() => {
      credits = 100;
      updateDisplay();
    }, 100);
  }

  // Wenn Autospin noch aktiv ist, nach kurzer Pause automatisch weiterdrehen
  if (autospinToggle.checked) {
    setTimeout(doSpin, 1000);
  }
}

spinBtn.addEventListener('click', doSpin);

autospinToggle.addEventListener('change', () => {
  if (autospinToggle.checked) {
    doSpin();
  }
});