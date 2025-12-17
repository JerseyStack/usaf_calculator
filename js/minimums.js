import { PT_DATA } from "./pt-data.js";

const PASSING_SCORE = 75;
const MAX = {
  cardio: 50,
  pushups: 15,
  core: 15
};

const SAFE_MIN = {
  pushups: 10,
  core: 10
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function ageToBracket(age) {
  if (age < 25) return "<25";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  return "50+";
}

function findMetricForScore(table, target, isTime = false) {
  let best = null;

  for (const [metric, score] of Object.entries(table)) {
    if (score >= target) {
      if (!best) best = metric;

      if (isTime) {
        if (metric > best) best = metric; // slower = worse
      } else {
        if (+metric < +best) best = metric; // fewer = worse
      }
    }
  }
  return best;
}

// --------------------------------------------------
// Profile generator
// --------------------------------------------------
function buildProfiles(data, cardioType) {
  return [
    {
      title: "🅰 Strength-Focused",
      pushups: MAX.pushups,
      core: SAFE_MIN.core
    },
    {
      title: "🅱 Core-Focused",
      pushups: SAFE_MIN.pushups,
      core: MAX.core
    },
    {
      title: "🅲 Cardio-Focused",
      pushups: SAFE_MIN.pushups,
      core: SAFE_MIN.core,
      cardio: MAX.cardio
    }
  ].map(profile => {
    const pushScore = profile.pushups;
    const coreScore = profile.core;
    const cardioScore =
      profile.cardio ?? PASSING_SCORE - (pushScore + coreScore);

    return {
      title: profile.title,
      pushups:
        pushScore === MAX.pushups
          ? "MAX"
          : findMetricForScore(data.pushups, pushScore),
      core:
        coreScore === MAX.core
          ? "MAX"
          : findMetricForScore(data.plank, coreScore, true),
      cardio:
        profile.cardio === MAX.cardio
          ? "MAX"
          : findMetricForScore(
              data[cardioType],
              cardioScore,
              cardioType === "run"
            ),
      total:
        pushScore +
        coreScore +
        (profile.cardio ?? cardioScore)
    };
  });
}

// --------------------------------------------------
// UI
// --------------------------------------------------
document.getElementById("calcBtn").onclick = () => {
  const gender = document.getElementById("gender").value;
  const age = +document.getElementById("age").value;
  const cardioType = document.getElementById("cardioType").value;
  const results = document.getElementById("results");

  results.innerHTML = "";

  if (!age) {
    results.textContent = "Please enter your age.";
    return;
  }

  const bracket = ageToBracket(age);
  const data = PT_DATA[gender][bracket];

  const profiles = buildProfiles(data, cardioType);

  profiles.forEach(p => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "1rem";
    card.style.marginBottom = "1rem";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <ul>
        <li>Cardio (${cardioType}): ${p.cardio}</li>
        <li>Pushups: ${p.pushups}</li>
        <li>Core (Plank): ${p.core}</li>
        <li><strong>Total: ${p.total.toFixed(1)}</strong></li>
      </ul>
    `;

    results.appendChild(card);
  });
};
