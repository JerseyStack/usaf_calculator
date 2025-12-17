/* --------------------------------------------------------------
   minimums.js – a tiny, self‑contained module.
   It does NOT depend on any library (no jQuery, no frameworks).
   -------------------------------------------------------------- */

/* ---- 1️⃣  Data table -------------------------------------------------
   The official USAF Air Force PT minimum tables are far more detailed,
   but for a demo we’ll keep a tiny subset.  You can replace the
   numbers with the real values – just keep the same structure.

   Structure:
   data[gender][assumption][ageRange] = {
       minScore: number,   // minimum component score that gives 75 points
       maxScore: number    // maximum (the best you can possibly earn)
   }
--------------------------------------------------------------------- */
const ptData = {
  male: {
    cardio: {
      // age ranges are inclusive, "min" ≤ age ≤ "max"
      "17-20": { minScore: 20, maxScore: 35 },
      "21-25": { minScore: 22, maxScore: 38 },
      "26-30": { minScore: 24, maxScore: 40 },
      "31-35": { minScore: 26, maxScore: 42 },
      // … add the rest of the ranges you need
    },
    upper: {
      "17-20": { minScore: 30, maxScore: 45 },
      "21-25": { minScore: 32, maxScore: 47 },
      // …
    },
    core: {
      "17-20": { minScore: 25, maxScore: 40 },
      "21-25": { minScore: 27, maxScore: 42 },
      // …
    }
  },

  female: {
    cardio: {
      "17-20": { minScore: 15, maxScore: 30 },
      "21-25": { minScore: 16, maxScore: 32 },
      // …
    },
    upper: {
      "17-20": { minScore: 25, maxScore: 40 },
      "21-25": { minScore: 27, maxScore: 42 },
      // …
    },
    core: {
      "17-20": { minScore: 20, maxScore: 35 },
      "21-25": { minScore: 22, maxScore: 37 },
      // …
    }
  }
};

/* --------------------------------------------------------------
   2️⃣  Helper: find the row that matches the entered age.
   Returns the object `{minScore, maxScore}` or `null` if not found.
--------------------------------------------------------------------- */
function lookupScore(gender, assumption, age) {
  const table = ptData[gender][assumption];
  for (const range in table) {
    const [low, high] = range.split('-').map(Number);
    if (age >= low && age <= high) {
      return table[range];
    }
  }
  return null; // age not covered (should not happen if range is complete)
}

/* --------------------------------------------------------------
   3️⃣  UI handling
--------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ptForm');
  const resultsDiv = document.getElementById('results');
  const summaryDiv = document.getElementById('summary');

  // Optional: fill the “summary” area with a quick note
  summaryDiv.textContent = `Enter your gender, age and pick which component you assume to be at its maximum. The calculator will show the minimum score needed in the other two components to reach the 75‑point threshold.`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();               // stop the page from reloading
    resultsDiv.innerHTML = '';        // clear any old output

    const gender = document.getElementById('gender').value;
    const age = Number(document.getElementById('age').value);
    const assumption = document.querySelector('input[name="assumption"]:checked').value;

    // ---------- Basic validation ----------
    if (!age || age < 17 || age > 80) {
      resultsDiv.textContent = 'Please enter a valid age between 17 and 80.';
      return;
    }

    // ---------- Grab the minimums ----------
    const scoreInfo = lookupScore(gender, assumption, age);
    if (!scoreInfo) {
      resultsDiv.textContent = `No data for ${gender}/${assumption} at age ${age}.`;
      return;
    }

    // ---------- Build the output ----------
    const { minScore, maxScore } = scoreInfo;

    const html = `
      <h2>Results for a ${age}‑year‑old ${gender.charAt(0).toUpperCase() + gender.slice(1)}</h2>
      <p>Assumption: <strong>Maximum ${assumption.charAt(0).toUpperCase() + assumption.slice(1)} </strong></p>
      <p>Minimum ${assumption} score required to reach 75 points: <strong>${minScore}</strong></p>
      <p>Maximum possible ${assumption} score (if you ace it): <strong>${maxScore}</strong></p>
    `;

    resultsDiv.innerHTML = html;
  });
});
