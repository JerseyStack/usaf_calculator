const genderEl = document.getElementById("gender");
const ageEl = document.getElementById("age");
const cardioEl = document.getElementById("cardio");
const resultsEl = document.getElementById("results");
const summaryEl = document.getElementById("summary");

/* --- LOAD VALUES FROM URL --- */
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);

  const gender = params.get("gender");
  const age = params.get("age");
  const cardio = params.get("cardio");
  const upper = params.get("upper");
  const core = params.get("core");

  if (gender) genderEl.value = gender;
  if (age) ageEl.value = age;
  if (cardio) cardioEl.value = cardio;

  summaryEl.innerHTML = `
    <strong>From Calculator:</strong><br>
    Gender: ${gender || "—"}<br>
    Age: ${age || "—"}<br>
    Cardio: ${cardio || "—"}<br>
    Upper: ${upper || "—"}<br>
    Core: ${core || "—"}
  `;
}

/* --- MINIMUMS LOGIC (SIMPLE, TRANSPARENT) --- */
function calculateMinimums() {
  const targetScore = 75;
  const cardioScore = 50;
  const remaining = targetScore - cardioScore;

  const eachComponent = Math.ceil(remaining / 2);

  resultsEl.innerHTML = `
    <strong>Required Component Scores:</strong><br>
    Upper Body: ${eachComponent} pts<br>
    Core: ${eachComponent} pts
  `;
}

/* --- FORM HANDLER --- */
document.getElementById("ptForm").addEventListener("submit", e => {
  e.preventDefault();
  calculateMinimums();
});

/* --- INIT --- */
loadFromURL();
