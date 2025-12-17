/* ===========================
   CONFIG
=========================== */
const TARGET = {
  cardio: 50,
  upper: 12.5,
  core: 12.5
};

/* ===========================
   ELEMENTS
=========================== */
const form = document.getElementById("ptForm");
const genderEl = document.getElementById("gender");
const ageEl = document.getElementById("age");
const cardioEl = document.getElementById("cardio");

const cardUpper = document.getElementById("card-upper");
const cardCore = document.getElementById("card-core");
const cardCardio = document.getElementById("card-cardio");

/* ===========================
   HELPERS
=========================== */
function getAgeBracket(age) {
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

function findMinimum(table, target) {
  let min = null;
  for (const value in table) {
    if (table[value] >= target) {
      if (!min || Number(value) < Number(min)) {
        min = value;
      }
    }
  }
  return min ?? "N/A";
}

/* ===========================
   MAIN
=========================== */
function update() {
  const gender = genderEl.value;
  const age = parseInt(ageEl.value, 10);
  const cardioType = cardioEl.value;
  const bracket = getAgeBracket(age);

  const data = PT_DATA[gender][bracket];

  const pushups = findMinimum(data.pushups, TARGET.upper);
  const handRelease = data.handRelease
    ? findMinimum(data.handRelease, TARGET.upper)
    : "—";

  const situps = findMinimum(data.situps, TARGET.core);
  const crunch = data.crunch
    ? findMinimum(data.crunch, TARGET.core)
    : "—";
  const plank = data.plank
    ? findMinimum(data.plank, TARGET.core)
    : "—";

  const cardio = findMinimum(data[cardioType], TARGET.cardio);

  cardUpper.innerHTML = `
    <h2>Upper Body (12.5 pts)</h2>
    <div class="value">Push-ups: ${pushups}</div>
    <div class="value">Hand-Release: ${handRelease}</div>
    <div class="note">Choose the easier option</div>
  `;

  cardCore.innerHTML = `
    <h2>Core (12.5 pts)</h2>
    <div class="value">Sit-ups: ${situps}</div>
    <div class="value">Crunches: ${crunch}</div>
    <div class="value">Plank: ${plank}</div>
    <div class="note">Any one counts</div>
  `;

  cardCardio.innerHTML = `
    <h2>Cardio (50 pts)</h2>
    <div class="value">
      ${cardioType === "run" ? "2-Mile Run" : "HAMR"}: ${cardio}
    </div>
    <div class="note">Maxing cardio gives the most buffer</div>
  `;
}

/* ===========================
   EVENTS
=========================== */
form.addEventListener("submit", function (e) {
  e.preventDefault();
  update();
});
