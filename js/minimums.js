const genderEl = document.getElementById("gender");
const ageEl = document.getElementById("age");
const resultsEl = document.getElementById("results");
const summaryEl = document.getElementById("summary");

/* --- LOAD CONTEXT FROM CALCULATOR (URL PARAMS) --- */
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);

  const gender = params.get("gender");
  const age = params.get("age");
  const cardio = params.get("cardio");
  const upper = params.get("upper");
  const core = params.get("core");

  if (gender) genderEl.value = gender;
  if (age) ageEl.value = age;

  if (gender || age || cardio || upper || core) {
    summaryEl.innerHTML = `
      <strong>From Calculator:</strong><br>
      Gender: ${gender || "—"}<br>
      Age: ${age || "—"}<br>
      Cardio: ${cardio || "—"}<br>
      Upper: ${upper || "—"}<br>
      Core: ${core || "—"}
    `;
  } else {
    summaryEl.innerHTML = `
      <em>
        Opened directly.<br>
        Enter age manually or return to the calculator.
      </em>
    `;
  }
}

/* --- CALCULATE MINIMUMS --- */
function calculateMinimums() {
  const age = Number(ageEl.value);

  if (!age) {
    resultsEl.innerHTML =
      "<em>Please enter your age or return to the calculator.</em>";
    return;
  }

  const targetScore = 75;
  const maxComponent = 50;

  const assumption = document.querySelector(
    'input[name="assumption"]:checked'
  ).value;

  let cardio = 0, upper = 0, core = 0;

  if (assumption === "cardio") {
    cardio = maxComponent;
    const remaining = targetScore - cardio;
    upper = core = Math.ceil(remaining / 2);
  }

  if (assumption === "upper") {
    upper = maxComponent;
    const remaining = targetScore - upper;
    cardio = core = Math.ceil(remaining / 2);
  }

  if (assumption === "core") {
    core = maxComponent;
    const remaining = targetScore - core;
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
