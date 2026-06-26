// ===== Bestenliste-Logik =====
// Liest die Highscore-Liste aus localStorage und zeigt sie an.
// Format eines Eintrags: { name: "Max", score: 150 }

function getHighscores() {
  const data = localStorage.getItem('highscores');
  return data ? JSON.parse(data) : [];
}

function saveHighscores(list) {
  localStorage.setItem('highscores', JSON.stringify(list));
}

function renderHighscores() {
  const list = getHighscores();
  // Höchste Punktzahl zuerst
  list.sort((a, b) => b.score - a.score);

  const tbody = document.getElementById('highscore-body');
  const table = document.getElementById('highscore-table');
  const emptyMessage = document.getElementById('empty-message');

  tbody.innerHTML = '';

  if (list.length === 0) {
    table.style.display = 'none';
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

document.getElementById('esc').addEventListener('click', () => {
  if (confirm('Bestenliste wirklich löschen?')) {
    localStorage.removeItem('highscores');
    renderHighscores();
  }
});

renderHighscores();