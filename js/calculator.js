import { PT_DATA } from "./pt-data.js";

// helpers: ageToBracket, scoreFromTable, mmssToSec

function calculateScore() {
  // EVERYTHING you saw printed on the page
}

document
  .getElementById("calcBtn")
  .addEventListener("click", calculateScore);

import { PT_DATA } from "./pt-data.js";

// ---------------------------
// Helpers
// ---------------------------
function ageToBracket(age) {
  if (age < 25) return "<25";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  return null;
}

function mmssToSeconds(str) {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

function scoreFromTable(table, value, isTime = false) {
  let best = 0;

  for (const [metric, score] of Object.entries(table)) {
    if (isTime) {
      if (mmssToSeconds(value) <= mmssToSeconds(metric)) {
        best = Math.max(best, score);
      }
    } else {
      if (+value >= +metric) {
        best = Math.max(best, score);
      }
    }
  }
  return best;
}

// ---------------------------
// Main calculator
// ---------------------------
function calculateScore() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const gender = document.getElementById("gender").value;
  const age = +document.getElementById("age").value;
  const cardioType = document.getElementById("cardioType").value;
  const cardioVal = document.getElementById("cardio").value;
  const pushups = +document.getElementById("pushups").value;
  const plank = document.getElementById("plank").value;

  if (!age || !cardioVal || !pushups || !plank) {
    output.textContent = "Please fill out all fields.";
    return;
  }

  const bracket = ageToBracket(age);
  if (!bracket) {
    output.textContent = "Age bracket not supported.";
    return;
  }

  const data = PT_DATA[gender][bracket];

  const cardioScore = scoreFromTable(
    data[cardioType],
    cardioVal,
    cardioType === "run"
  );

  const pushScore = scoreFromTable(data.pushups, pushups);
  const coreScore = scoreFromTable(data.plank, plank, true);

  const total = cardioScore + pushScore + coreScore;

  output.innerHTML = `
    <h3>Results</h3>
    <ul>
      <li>Cardio: ${cardioScore.toFixed(1)}</li>
      <li>Pushups: ${pushScore.toFixed(1)}</li>
      <li>Core: ${coreScore.toFixed(1)}</li>
      <li><strong>Total: ${total.toFixed(1)}</strong></li>
    </ul>
  `;
}

// ---------------------------
document
  .getElementById("calcBtn")
  .addEventListener("click", calculateScore);
