const symbols = ["🎰", "🍒", "🍋", "🍇", "⭐"];
const payouts = { "🎰": 50, "🍒": 10, "🍋": 10, "🍇": 10, "⭐": 20 };

let credits = 100;
let bet = 10;
let spinning = false;

const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet-display');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const betMinus = document.getElementById('bet-minus');
const betPlus = document.getElementById('bet-plus');
const escBtn = document.getElementById('esc');
const reels = [document.getElementById('reel0'), document.getElementById('reel1'), document.getElementById('reel2')];

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateDisplay() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
}

betMinus.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.max(10, bet - 10);
  updateDisplay();
});

betPlus.addEventListener('click', () => {
  if (spinning) return;
  bet = Math.min(1000000, bet + 10);
  updateDisplay();
});

escBtn.addEventListener('click', () => {
  window.location.href = "menu.html";
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

spinBtn.addEventListener('click', async () => {
  if (spinning) return;
  if (credits < bet) {
    messageEl.textContent = "Nicht genug Guthaben!";
    return;
  }
  spinning = true;
  spinBtn.disabled = true;
  betMinus.disabled = true;
  betPlus.disabled = true;
  credits -= bet;
  updateDisplay();
  messageEl.textContent = "Walzen drehen...";

  const results = await Promise.all([
    spinReel(reels[0], 600),
    spinReel(reels[1], 900),
    spinReel(reels[2], 1200)
  ]);

  if (results[0] === results[1] && results[1] === results[2]) {
    const win = bet * payouts[results[0]];
    credits += win;
    messageEl.textContent = "Gewonnen! +" + win + " Guthaben";
  } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
    const win = Math.round(bet * 2);
    credits += win;
    messageEl.textContent = "Zwei gleiche! +" + win + " Guthaben";
  } else {
    messageEl.textContent = "Leider verloren. Nochmal versuchen!";
  }

  updateDisplay();
  spinning = false;
  spinBtn.disabled = false;
  betMinus.disabled = false;
  betPlus.disabled = false;

  if (credits <= 0) {
    messageEl.textContent = "Guthaben aufgebraucht. Spiel wird zurückgesetzt.";
    setTimeout(() => {
      credits = 100;
      updateDisplay();
    }, 1500);
  }
});