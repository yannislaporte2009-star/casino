async function getHighscores() {
  try {
    const response = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Access-Key': JSONBIN_ACCESS_KEY }
    });
    const data = await response.json();
    return (data.record && data.record.highscores) ? data.record.highscores : [];
  } catch (e) {
    console.error('Bestenliste konnte nicht geladen werden:', e);
    return [];
  }
}

async function renderHighscores() {
  const tbody = document.getElementById('highscore-body');
  const table = document.getElementById('highscore-table');
  const emptyMessage = document.getElementById('empty-message');

  emptyMessage.textContent = 'Bestenliste wird geladen...';
  table.style.display = 'none';
  emptyMessage.style.display = 'block';

  const list = await getHighscores();
  // Höchste Punktzahl zuerst
  list.sort((a, b) => b.score - a.score);

  tbody.innerHTML = '';

  if (list.length === 0) {
    table.style.display = 'none';
    emptyMessage.textContent = 'Noch keine Einträge. Spiel eine Runde und gewinne, um hier zu erscheinen!';
    emptyMessage.style.display = 'block';
    return;
  }

  table.style.display = '';
  emptyMessage.style.display = 'none';

  list.forEach((entry, index) => {
    const row = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;

    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;

    const scoreCell = document.createElement('td');
    scoreCell.textContent = entry.score;

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    tbody.appendChild(row);
  });
}

document.getElementById('esc').addEventListener('click', () => {
  window.location.href = "index.html";
});

renderHighscores();