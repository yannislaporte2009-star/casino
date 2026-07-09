// ===== Gemeinsame Bestenliste-Logik (JSONBin) =====
// Wird von slots.js, roulette.js und blackjack.js benutzt.
// Es wird IMMER nur der höchste Guthabenstand pro Spieler gespeichert,
// egal in welchem Spiel er erreicht wurde.

const JSONBIN_BIN_ID = '6a3e350dda38895dfe01939c';
const JSONBIN_ACCESS_KEY = '$2a$10$titeiD3M2vVROlysgeWMU.paA12GSjVGUVumB/TaeJ0fGlp2yH6NC';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

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

// Prüft, ob currentCredits ein neuer Bestwert für den Spieler ist,
// und speichert ihn in diesem Fall online in der gemeinsamen Bestenliste.
async function saveHighscore(currentCredits) {
  const name = getPlayerName();

  try {
    const getResponse = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Access-Key': JSONBIN_ACCESS_KEY }
    });
    const getData = await getResponse.json();
    const list = (getData.record && getData.record.highscores) ? getData.record.highscores : [];

    const existingEntry = list.find(entry => entry.name === name);

    if (existingEntry) {
      if (currentCredits > existingEntry.score) {
        existingEntry.score = currentCredits;
      } else {
        // Kein neuer Bestwert -> nichts zu tun
        return;
      }
    } else {
      list.push({ name: name, score: currentCredits });
    }

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
