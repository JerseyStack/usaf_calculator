// js/calculator.js
import { PT_DATA } from "./pt-data.js";

/* =====================================
   Helpers
===================================== */
function ageToBracket(age) {
  if (age < 25) return "<25";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  if (age <= 54) return "50-54";
  if (age <= 59) return "55-59";
  return "60+";
}

function mmssToSeconds(str) {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

function scoreFromTable(table, value, isTime = false) {
  let best = 0;

  for (const key in table) {
    if (isTime) {
      if (mmssToSeconds(value) <= mmssToSeconds(key)) {
        best = Math.max(best, table[key]);
      }
    } else {
      if (Number(value) >= Number(key)) {
        best = Math.max(best, table[key]);
      }
    }
  }
  return best;
}

/* =====================================
   Calculator Logic
===================================== */
document.getElementById("calcBtn").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const gender = document.getElementById("gender").value;
  const age = Number(document.getElementById("age").value);
  const cardioType = document.getElementById("cardioType").value;
  const cardioVal = document.getElementById("cardio").value;
  const pushups = Number(document.getElementById("pushups").value);
  const plank = document.getElementById("plank").value;

  if (!age || !cardioVal || !pushups || !plank) {
    output.textContent = "Please fill out all fields.";
    return;
  }

  const bracket = ageToBracket(age);
  const data = PT_DATA[gender]?.[bracket];

  if (!data) {
    output.textContent = "This age group is not supported yet.";
    return;
  }

  // Scoring
  const cardioScore = scoreFromTable(
    data[cardioType],
    cardioVal,
    cardioType === "run"
  );

  const pushScore = scoreFromTable(da
