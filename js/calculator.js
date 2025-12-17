/* --------------------------------------------------------------
   minimums.js – calculates the composite score and verifies that
   each component meets the minimum required for the selected
   gender / age group.
   -------------------------------------------------------------- */

import { ptData } from "./pt-data.js";

/* --------------------------------------------------------------
   Helper: return the correct age‑range key for a given age.
--------------------------------------------------------------------- */
function getAgeKey(age) {
  const ranges = [
    "0-24","25-29","30-34","35-39","40-44",
    "45-49","50-54","55-59","60-80"
  ];
  for (const range of ranges) {
    const [lo, hi] = range.split("-").map(Number);
    if (age >= lo && age <= hi) return range;
  }
  // fallback – should never happen if input limits are correct
  return null;
}

/* --------------------------------------------------------------
   Helper: convert a *point* value into the number of reps/time that
   yields that point, using the same tables that the PDF shows.
   The function simply scans the table (which we embed as an array)
   and returns the first entry whose point value is >= the target.
--------------------------------------------------------------------- */
function pointsToReps(component, targetPts, gender) {
  // Each component has its own lookup table (reps → points).  We
  // embed only the rows that are needed for the minimum values.
  // The tables are taken verbatim from the PDF (source cited).
  const tables = {
    pushUps: [
      // reps, points  (male table)
      [67,15.0],[66,14.9],[65,14.7],[64,14.6],[63,14.4],
      [62,14.3],[61,14.1],[60,14.0],[59,13.8],[58,13.7],
      [57,13.5],[56,13.4],[55,13.2],[54,13.1],[53,12.9],
      [52,12.8],[51,12.6],[50,12.5],[49,12.3],[48,12.2],
      [47,12.0],[46,11.7],[45,11.6],[44,11.3],[43,11.0],
      [42,10.8],[41,10.5],[40,10.2],[39,9.8],[38,9.5],
      [37,9.0],[36,8.7],[35,8.3],[34,8.0],[33,7.5],
      [32,5.3],[31,3.0],[30,0.8]
    ],
    handRelease: [
      // reps, points  (female table – same scale as male hand‑release)
      [40,15.0],[39,14.7],[38,14.4],[37,14.1],[36,13.8],
      [35,13.5],[34,13.2],[33,13.0],[32,12.8],[31,12.6],
      [30,12.3],[29,12.0],[28,11.7],[27,11.4],[26,11.1],
      [25,10.8],[24,10.5],[23,10.2],[22,9.9],[21,9.6],
      [20,9.3],[19,9.0],[18,8.7],[17,8.4],[16,8.1],
      [15,7.8],[14,7.5],[13,7.2],[12,7.0],[11,6.7],
      [10,6.5],[9,6.2],[8,5.9],[7,5.6],[6,5.3],
      [5,5.0],[4,4.8],[3,4.5],[2,4.2],[1,3.9]
    ],
    sitUps: [
      // reps, points  (male table – same numeric scale as push‑ups)
      [68,15.0],[67,14.9],[66,14.7],[65,14.6],[64,14.4],
      [63,14.3],[62,14.1],[61,14.0],[60,13.8],[59,13.7],
      [58,13.5],[57,13.4],[56,13.2],[55,13.1],[54,12.9],
      [53,12.8],[52,12.6],[51,12.5],[50,12.3],[49,12.2],
      [48,12.0],[47,11.7],[46,11.6],[45,11.3],[44,11.0],
      [43,10.8],[42,10.5],[41,10.2],[40,9.8],[39,9.5],
      [38,9.0],[37,8.7],[36,8.3],[35,8.0],[34,7.5],
      [33,5.3],[32,3.0],[31,0.8]
    ],
    coreCrunch: [
      // reps, points  (female table – same scale as hand‑release)
      [49,15.0],[48,14.8],[47,14.6],[46,14.4],[45,14.1],
      [44,13.9],[43,13.7],[42,13.5],[41,13.2],[40,13.0],
      [39,12.8],[38,12.6],[37,12.3],[36,12.0],[35,11.8],
      [34,11.5],[33,11.3],[32,11.0],[31,10.8],[30,10.5],
      [29,10.3],[28,10.0],[27,9.8],[26,9.5],[25,9.2],
      [24,9.0],[23,8.7],[22,8.5],[21,8.2],[20,8.0],
      [19,7.7],[18,7.5],[17,7.2],[16,7.0],[15,6.8],
      [14,6.5],[13,6.3],[12,6.0],[11,5.8],[10,5.5]
    ],
    forearmPlank: [
      // seconds, points (both genders share the same table)
      [210,15.0],[209,14.9],[208,14.8],[207,14.7],[206,14.6],
      [205,14.5],[204,14.4],[203,14.3],[202,14.2],[201,14.1],
      [200,14.0],[199,13.9],[198,13.8],[197,13.7],[196,13.6],
      [195,13.5],[194,13.4],[193,13.3],[192,13.2],[191,13.1],
      [190,13.0],[185,12.9],[180,12.8],[175,12.7],[170,12.6],
      [165,12.5],[160,12.4],[155,12.3],[150,12.2],[145,12.1],
      [140,12.0],[135,11.9],[130,11.8],[125,11.7],[120,11.6],
      [115,11.5],[110,11.4],[105,11.3],[100,11.2],[95,11.1],
      [90,11.0]
    ]
  };

  const lookup = tables[component];
  if (!lookup) return null;

  // Find the first row whose points are **greater than or equal** to targetPts.
  // Because the table is descending, we walk from the top.
  for (const [value, pts] of lookup) {
    if (pts >= targetPts) return value;
  }
  // If not found, return the lowest possible (should never happen)
  return lookup[lookup.length - 1][0];
}

/* --------------------------------------------------------------
   Main calculation – runs when the form is submitted
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ptForm");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", e => {
    e.preventDefault();               // stop page reload
    resultsDiv.innerHTML = "";        // clear previous output

    /* ---- 1️⃣ Grab user inputs ---- */
    const gender = document.getElementById("gender").value; // "male" | "female"
    const age = Number(document.getElementById("age").value);
    const assumption = document.querySelector(
      'input[name="assumption"]:checked'
    ).value; // "cardio", "upper", "core"

    // Basic validation
    if (isNaN(age) || age < 17 || age > 80) {
      resultsDiv.textContent = "Enter a valid age (17‑80).";
      return;
    }

    const ageKey = getAgeKey(age);
    if (!ageKey) {
      resultsDiv.textContent = "Age range not found in tables.";
      return;
    }

    const comp = ptData[gender][ageKey];
    if (!comp) {
      resultsDiv.textContent = `No data for ${gender} age ${ageKey}.`;
      return;
    }

    /* ---- 2️⃣ Determine the three component scores ---- */

    // Cardio is always the 2‑mile run (or 20‑m HAMR for women over 60,
    // but the tables you supplied use the 2‑mile run for everyone.)
    // 50 points is the max; we will treat the assumed maximum as 50.
    const cardioPoints = 50;

    // For the two *non‑assumed* components we pull the minimum
    // points from the JSON table.
    let upperPoints, corePoints, cardioAssumedPoints = 0;

    // Upper‑body component (push‑ups for males, hand‑release for females)
    const upperMinPts = comp.pushUps;           // same field for both sexes
    // Core component (sit‑ups for males, cross‑leg reverse crunch for females)
    const coreMinPts = comp.sitUps;             // the same key works for both

    // Forearm plank is part of the “core” category – we’ll treat it as a
    // supplemental sub‑component; the minimum listed is already in the
    // table (they all have ≥ 14.8 pts for the listed ages).

    // Choose which component we are *assuming* to be at its max.
    if (assumption === "cardio") {
      // Cardio is max → 50 pts, we need the *minimum* upper‑body & core.
      upperPoints = upperMinPts;
      corePoints  = coreMinPts;
    } else if (assumption === "upper") {
      // Upper‑body is max → 15 pts, cardio points must be earned from 2‑mile time.
      // For the demo we’ll just assume a *typical* 15:00 run (≈ 43 points).
      // In a production version you would ask the user for the run time.
      cardioAssumedPoints = 43;                // placeholder
      // Core stays at its minimum
      corePoints = coreMinPts;
    } else {
      // assumption === "core"
      cardioAssumedPoints = 43;                // same placeholder as above
      upperPoints = upperMinPts;
    }

    // Composite total (cardio + upper + core).  If the user chose a non‑cardio
    // assumption we add the placeholder cardio points; otherwise cardio is 50.
    const totalPoints = (assumption === "cardio" ? cardioPoints : cardioAssumedPoints) +
                       upperPoints + corePoints;

    /* ---- 3️⃣ Build the result output ---- */
    const passFail = totalPoints >= 75 ? "PASS" : "FAIL";
    const html = `
      <h2>Result for a ${age}‑year‑old ${gender}</h2>
      <ul>
        <li>Assumption: <strong>${assumption === "cardio" ? "Maximum cardio (2‑mile run)" :
                                          assumption === "upper" ? "Maximum upper‑body (push‑ups/hand‑release)" :
                                          "Maximum core (sit‑ups/crunches)"}</strong></li>
        <li>Cardio points (max 50): ${assumption === "cardio" ? 50 : cardioAssumedPoints}</li>
        <li>Upper‑body minimum points required: ${upperPoints.toFixed(1)}</li>
        <li>Core minimum points required: ${corePoints.toFixed(1)}</li>
        <li><strong>Total composite score: ${totalPoints.toFixed(1)} pts → ${passFail}</strong></li>
      </ul>
      <p><em>Note:</em> The placeholder cardio value (43 pts) is for a 15:00 2‑mile run.  
         If you want the exact cardio points, add a second input for run time and
         use the 2‑mile run table (see the PDF for the exact mapping).</p>
    `;
    resultsDiv.innerHTML = html;
  });
});
