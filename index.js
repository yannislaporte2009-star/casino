
let credits = parseInt(localStorage.getItem('slotCredits')) || 100;
 
const creditsEl = document.getElementById('credits');
 
function updateDisplay() {
  creditsEl.textContent = credits;
}
 
updateDisplay();

const slotsBTN = document.getElementById('slot-machine');


slotsBTN.addEventListener('click', () => {
  window.location.href = "slots.html";
});

