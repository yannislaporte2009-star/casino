const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

function getColor(n) {
  if (n === 0) return 'green';
  return redNumbers.includes(n) ? 'red' : 'black';
}

let credits = parseInt(localStorage.getItem('slotCredits')) || 100;
let bet = 10;
let spinning = false;
let currentBetType = 'color';
let currentChoice = 'red';

const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet-display');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const betMinusMin = document.getElementById('bet-minus-Min');
const betMinushalb = document.getElementById('bet-minus-/2');
const betMinus1000 = document.getElementById('bet-minus-1000');
const betMinus100 = document.getElementById('bet-minus-100');
const betMinus10 = document.getElementById('bet-minus-10');
const betPlus10 = document.getElementById('bet-plus-10');
const betPlus100 = document.getElementById('bet-plus-100');
const betPlus1000 = document.getElementById('bet-plus-1000');
const betPlusdoppel = document.getElementById('bet-plus-x2');
const betPlusmax = document.getElementById('bet-plus-Max');
const escBtn = document.getElementById('esc');
const wheelEl = document.getElementById('wheel');
const numberInput = document.getElementById('number-input');
const colorOptions = document.getElementById('color-options');
const parityOptions = document.getElementById('parity-options');
const numberOptions = document.getElementById('number-options');

updateDisplay();

function updateDisplay() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  localStorage.setItem('slotCredits', credits);
}

function saveHighscore(score) {
  let name = localStorage.getItem('playerName');
  if (!name) {
    name = prompt("Wie ist dein Name?", "Spieler") || "Spieler";
    localStorage.setItem('playerName', name);
  }
  const data = localStorage.getItem('highscores');
  const list = data ? JSON.parse(data) : [];
  list.push({ name: name, score: score });
  localStorage.setItem('highscores', JSON.stringify(list));
}

escBtn.addEventListener('click', () => { window.location.href = "index.html"; });

betMinusMin.addEventListener('click', () => { if (spinning) return; bet = 10; updateDisplay(); });
betMinushalb.addEventListener('click', () => { if (spinning) return; bet = Math.max(10, Math.floor(bet / 2)); updateDisplay(); });
betMinus1000.addEventListener('click', () => { if (spinning) return; bet = Math.max(10, bet - 1000); updateDisplay(); });
betMinus100.addEventListener('click', () => { if (spinning) return; bet = Math.max(10, bet - 100); updateDisplay(); });
betMinus10.addEventListener('click', () => { if (spinning) return; bet = Math.max(10, bet - 10); updateDisplay(); });
betPlus10.addEventListener('click', () => { if (spinning) return; bet = Math.min(1000000000000, bet + 10); updateDisplay(); });
betPlus100.addEventListener('click', () => { if (spinning) return; bet = Math.min(1000000000000, bet + 100); updateDisplay(); });
betPlus1000.addEventListener('click', () => { if (spinning) return; bet = Math.min(1000000000000, bet + 1000); updateDisplay(); });
betPlusdoppel.addEventListener('click', () => { if (spinning) return; bet = Math.min(1000000000000, bet * 2); updateDisplay(); });
betPlusmax.addEventListener('click', () => { if (spinning) return; bet = Math.min(credits, 1000000000000); updateDisplay(); });

document.querySelectorAll('input[name="bet-type"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentBetType = e.target.value;
    colorOptions.style.display = currentBetType === 'color' ? '' : 'none';
    parityOptions.style.display = currentBetType === 'parity' ? '' : 'none';
    numberOptions.style.display = currentBetType === 'number' ? '' : 'none';
    if (currentBetType === 'color') currentChoice = 'red';
    if (currentBetType === 'parity') currentChoice = 'even';
    if (currentBetType === 'number') currentChoice = parseInt(numberInput.value) || 0;
    document.querySelectorAll('.bet-choice').forEach(b => b.classList.remove('active'));
  });
});

document.querySelectorAll('.bet-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    if (spinning) return;
    currentChoice = btn.dataset.choice;
    btn.parentElement.querySelectorAll('.bet-choice').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

numberInput.addEventListener('change', () => {
  let val = Math.min(36, Math.max(0, parseInt(numberInput.value) || 0));
  numberInput.value = val;
  if (currentBetType === 'number') currentChoice = val;
});

function setButtonsDisabled(state) {
  [spinBtn, betMinusMin, betMinushalb, betMinus1000, betMinus100, betMinus10,
   betPlus10, betPlus100, betPlus1000, betPlusdoppel, betPlusmax].forEach(b => b.disabled = state);
}

function spinWheel(duration) {
  return new Promise(resolve => {
    const start = Date.now();
    const interval = setInterval(() => {
      const n = Math.floor(Math.random() * 37);
      wheelEl.textContent = n;
      wheelEl.style.color = getColor(n) === 'red' ? '#e74c3c' : (getColor(n) === 'black' ? '#000' : '#2ecc71');
      if (Date.now() - start > duration) {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * 37);
        wheelEl.textContent = finalNumber;
        const c = getColor(finalNumber);
        wheelEl.style.color = c === 'red' ? '#e74c3c' : (c === 'black' ? '#000' : '#2ecc71');
        resolve(finalNumber);
      }
    }, 80);
  });
}

spinBtn.addEventListener('click', async () => {
  if (spinning) return;
  if (credits < bet) { messageEl.textContent = "Nicht genug Guthaben!"; return; }
  if (currentBetType === 'number') currentChoice = parseInt(numberInput.value) || 0;

  spinning = true;
  setButtonsDisabled(true);
  credits -= bet;
  updateDisplay();
  messageEl.textContent = "Kugel rollt...";

  const result = await spinWheel(2000);
  const color = getColor(result);
  let win = 0;

  if (currentBetType === 'color' && color === currentChoice) {
    win = bet * 2;
  } else if (currentBetType === 'parity') {
    const isEven = result !== 0 && result % 2 === 0;
    if ((currentChoice === 'even' && isEven) || (currentChoice === 'odd' && !isEven)) win = bet * 2;
  } else if (currentBetType === 'number' && result === currentChoice) {
    win = bet * 35;
  }

  if (win > 0) {
    credits += win;
    messageEl.textContent = `Zahl ${result} (${color === 'red' ? 'Rot' : color === 'black' ? 'Schwarz' : 'Grün'}) – Gewonnen! +${win}`;
    saveHighscore(win);
  } else {
    messageEl.textContent = `Zahl ${result} (${color === 'red' ? 'Rot' : color === 'black' ? 'Schwarz' : 'Grün'}) – Verloren.`;
  }

  updateDisplay();
  spinning = false;
  setButtonsDisabled(false);

  if (credits <= 0) {
    messageEl.textContent = "Guthaben aufgebraucht. Spiel wird zurückgesetzt.";
    setTimeout(() => { credits = 100; updateDisplay(); }, 1500);
  }
});