import { PT_DATA } from "./pt-data.js";

// =================================================
// Helpers
// =================================================
const mmssToSec = str => {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
};

function ageToBracket(age) {
  if (age < 25) return "<25";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  return "50+";
}

function scoreFromTable(table, input, isTime = false) {
  let bestScore = 0;

  for (const [metric, score] of Object.entries(table)) {
    if (isTime) {
      if (mmssToSec(input) <= mmssToSec(metric)) {
        bestScore = Math.max(bestScore, score);
      }
    } else {
      if (+input >= +metric) {
        bestScore = Math.max(bestScore, score);
      }
    }
  }
  return bestScore;
}

// =================================================
// Calculator logic
// =================================================
document.getElementById("calcBtn").onclick = () => {
  const gender = document.getElementById("gender").value;
  const age = +document.getElementById("age").value;
  const cardioType = document.getElementById("cardioType").value;

  const runTime = document.getElementById("runTime")?.value;
  const hamr = document.getElementById("hamr")?.value;
  const pushups = document.getElementById("pushups")?.value;
  const plank = document.getElementById("plank")?.value;

  const output = document.getElementById("output");

  if (!age) {
    output.textContent = "Please enter your age.";
    return;
  }

  const bracket = ageToBracket(age);
  const data = PT_DATA[gender][bracket];

  let total = 0;

  // ---------------- Cardio ----------------
  let cardioScore = 0;
  if (cardioType === "run" && runTime) {
    cardioScore = scoreFromTable(data.run, runTime, true);
  }

  if (cardioType === "hamr" && hamr) {
    cardioScore = scoreFromTable(data.hamr, hamr);
  }

  total += cardioScore;

  // ---------------- Strength ----------------
  const pushScore = scoreFromTable(data.pushups, pushups);
  total += pushScore;

  // ---------------- Core ----------------
  const plankScore = scoreFromTable(data.plank, plank, true);
  total += plankScore;

  // ---------------- Output ----------------
  output.innerHTML = `
    <strong>Total Score:</strong> ${total.toFixed(1)}<br><br>
    Cardio: ${cardioScore.toFixed(1)}<br>
    Pushups: ${pushScore.toFixed(1)}<br>
    Plank: ${plankScore.toFixed(1)}
  `;
};

