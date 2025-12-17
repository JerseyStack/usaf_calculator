const PASSING_SCORE = 75;

// ---------------- Helpers ----------------
function ageToBracket(age) {
  if (age < 25) return "<25";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  return null;
}

function findMetric(table, target, isTime = false) {
  let result = null;

  for (const key in table) {
    if (table[key] >= target) {
      if (!result) result = key;
      if (isTime && key > result) result = key;
      if (!isTime && +key < +result) result = key;
    }
  }
  return result ?? "N/A";
}

// ---------------- Profiles ----------------
function buildProfiles(data, cardioType) {
  return [
    {
      title: "🅰 Strength-Focused",
      push: 15,
      core: 10
    },
    {
      title: "🅱 Core-Focused",
      push: 10,
      core: 15
    },
    {
      title: "🅲 Cardio-Focused",
      push: 10,
      core: 10,
      cardio: 50
    }
  ].map(p => {
    const cardioScore =
      p.cardio ?? PASSING_SCORE - (p.push + p.core);

    return {
      title: p.title,
      pushups: p.push === 15 ? "MAX" : findMetric(data.pushups, p.push),
      plank: p.core === 15 ? "MAX" : findMetric(data.plank, p.core, true),
      cardio:
        p.cardio === 50
          ? "MAX"
          : findMetric(data[cardioType], cardioScore, cardioType === "run"),
      total: p.push + p.core + cardioScore
    };
  });
}

// ---------------- UI ----------------
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
  const data = PT_DATA?.[gender]?.[bracket];

  if (!data) {
    results.textContent = "Age group not supported yet.";
    return;
  }

  buildProfiles(data, cardioType).forEach(p => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "1rem";
    card.style.marginBottom = "1rem";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <ul>
        <li>Cardio (${cardioType}): ${p.cardio}</li>
        <li>Pushups: ${p.pushups}</li>
        <li>Plank: ${p.plank}</li>
        <li><strong>Total: ${p.total}</strong></li>
      </ul>
    `;
    results.appendChild(card);
  });
};
