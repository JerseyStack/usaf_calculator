const genderEl = document.getElementById("gender");
const ageEl = document.getElementById("age");
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

  summaryEl.innerHTML = `
    <strong>From Calculator:</strong><br>
    Gender: ${gender || "—"}<br>
    Age: ${age || "—"}<br>
    Cardio: ${cardio || "—"}<br>
    Upper: ${upper || "—"}<br>
    Core: ${core || "—"}
  `;
}

/* --- MINIMUMS LOGIC --- */
function calculateMinimums() {
  const target = 75;
  const maxScore = 50;

  const assumption = document.querySelector(
    'input[name="assumption"]:checked'
  ).value;

  let cardio = 0, upper = 0, core = 0;

  if (assumption === "cardio") {
    cardio = maxScore;
    const remaining = target - cardio;
    upper = core = Math.ceil(remaining / 2);
  }

  if (assumption === "upper") {
    upper = maxScore;
    const remaining = target - upper;
    cardio = core = Math.ceil(remaining / 2);
  }

  if (assumption === "core") {
    core = maxScore;
    const remaining = target - core;
    cardio = upper = Math.ceil(remaining / 2);
  }

  resultsEl.innerHTML = `
    <strong>Required Scores to Reach 75:</strong><br><br>
    Cardio: ${cardio} pts<br>
    Upper Body: ${upper} pts<br>
    Core: ${core} pts
  `;
}

/* --- FORM HANDLER --- */
document.getElementById("ptForm").addEventListener("submit", e => {
  e.preventDefault();
  calculateMinimums();
});

/* --- INIT --- */
loadFromURL();
