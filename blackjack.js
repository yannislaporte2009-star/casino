const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

let credits = parseInt(localStorage.getItem('slotCredits')) || 100;
let bet = 10;
let deck = [];
let playerHand = [];
let dealerHand = [];
let roundActive = false;

const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet-display');
const messageEl = document.getElementById('message');
const escBtn = document.getElementById('esc');
const betMinus10 = document.getElementById('bet-minus-10');
const betMinus100 = document.getElementById('bet-minus-100');
const betMinus1000 = document.getElementById('bet-minus-1000');
const betMinushalb = document.getElementById('bet-minus-halb');
const betMinusMin = document.getElementById('bet-minus-Min');
const betPlus10 = document.getElementById('bet-plus-10');
const betPlus100 = document.getElementById('bet-plus-100');
const betPlus1000 = document.getElementById('bet-plus-1000');
const betPlusx2 = document.getElementById('bet-plus-x2');
const betPlusMax = document.getElementById('bet-plus-Max');
const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const playerHandEl = document.getElementById('player-hand');
const dealerHandEl = document.getElementById('dealer-hand');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');

updateDisplay();

function updateDisplay() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  localStorage.setItem('slotCredits', credits);
}

escBtn.addEventListener('click', () => {
  window.location.href = "index.html";
});

betMinus10.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.max(10, bet - 10);
  updateDisplay();
});

betMinus100.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.max(10, bet - 100);
  updateDisplay();
});
betMinus1000.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.max(10, bet - 1000);
  updateDisplay();
});
betMinushalb.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.max(10, bet / 2);
  updateDisplay();
});
betMinusMin.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.max(10, bet = 10);
  updateDisplay();
});

betPlus10.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.min(1000000000000, bet + 10);
  updateDisplay();
});

betPlus100.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.min(1000000000000, bet + 100);
  updateDisplay();
});
betPlus1000.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.min(1000000000000, bet + 1000);
  updateDisplay();
});
betPlusx2.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.min(1000000000000, bet * 2);
  updateDisplay();
});

betPlusMax.addEventListener('click', () => {
  if (roundActive) return;
  bet = Math.min(credits, 1000000000);
  updateDisplay();
});
function buildDeck() {
  deck = [];
  for (const s of suits) {
    for (const r of ranks) {
      deck.push({ rank: r, suit: s });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  if (deck.length === 0) buildDeck();
  return deck.pop();
}

function cardValue(card) {
  if (card.rank === 'A') return 11;
  if (['J','Q','K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

function handScore(hand) {
  let score = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter(c => c.rank === 'A').length;
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function renderHand(hand, el, hideFirst) {
  el.innerHTML = '';
  hand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (hideFirst && index === 0) {
      cardEl.textContent = '🂠';
      cardEl.classList.add('hidden-card');
    } else {
      cardEl.textContent = card.rank + card.suit;
      if (card.suit === '♥' || card.suit === '♦') {
        cardEl.classList.add('red-card');
      }
    }
    el.appendChild(cardEl);
  });
}

function renderAll(hideDealerFirst) {
  renderHand(playerHand, playerHandEl, false);
  renderHand(dealerHand, dealerHandEl, hideDealerFirst);
  playerScoreEl.textContent = handScore(playerHand);
  dealerScoreEl.textContent = hideDealerFirst ? '?' : handScore(dealerHand);
}

dealBtn.addEventListener('click', () => {
  if (credits < bet) {
    messageEl.textContent = "Nicht genug Guthaben!";
    return;
  }
  credits -= bet;
  updateDisplay();

  buildDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  roundActive = true;

  renderAll(true);
  messageEl.textContent = "Hit oder Stand?";

  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  betMinus10.disabled = true;
  betMinus100.disabled = true;
  betMinus1000.disabled = true;
  betMinushalb.disabled = true;
  betMinusMin.disabled = true;
  betPlus10.disabled = true;
  betPlus100.disabled = true;
  betPlus1000.disabled = true;
  betPlusx2.disabled = true;
  betPlusMax.disabled = true;

  if (handScore(playerHand) === 21) {
    endRound();
  }
});

hitBtn.addEventListener('click', () => {
  if (!roundActive) return;
  playerHand.push(drawCard());
  renderAll(true);

  if (handScore(playerHand) > 21) {
    endRound();
  }
});

standBtn.addEventListener('click', () => {
  if (!roundActive) return;
  endRound();
});

async function endRound() {
  roundActive = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;

  const playerScore = handScore(playerHand);

  if (playerScore <= 21) {
    while (handScore(dealerHand) < 17) {
      dealerHand.push(drawCard());
    }
  }

  renderAll(false);

  const dealerScore = handScore(dealerHand);
  let win = 0;
  let result = "";

  if (playerScore > 21) {
    result = "! Verloren.";
  } else if (dealerScore > 21) {
    win = bet * 2;
    result = "Dealer überzieht! Gewonnen! +" + win;
  } else if (playerScore > dealerScore) {
    win = bet * 2;
    result = "Gewonnen! +" + win;
  } else if (playerScore === dealerScore) {
    win = bet;
    result = "Unentschieden. Einsatz zurück.";
  } else {
    result = "Verloren.";
  }

  messageEl.textContent = result;

  if (win > 0) {
    credits += win;
  }

  
  await saveHighscore(credits);

  updateDisplay();
  dealBtn.disabled = false;
  betMinus10.disabled = false;
  betMinus100.disabled = false;
  betMinus1000.disabled = false;
  betMinushalb.disabled = false;
  betMinusMin.disabled = false;
  betPlus10.disabled = false;
  betPlus100.disabled = false;
  betPlus1000.disabled = false;
  betPlusx2.disabled = false;
  betPlusMax.disabled = false;


  if (credits <= 0) {
    messageEl.textContent = "Guthaben aufgebraucht. Spiel wird zurückgesetzt.";
    setTimeout(() => {
      credits = 100;
      updateDisplay();
    }, 1500);
  }
}