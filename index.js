
let credits = parseInt(localStorage.getItem('Credits')) || 100;
 
const creditsEl = document.getElementById('Credits');
 
function updateDisplay() {
  creditsEl.textContent = credits;
}
 
updateDisplay();

const slotsBTN = document.getElementById('slot-machine');


slotsBTN.addEventListener('click', () => {
  window.location.href = "slots.html";
});

