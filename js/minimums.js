/**
 * PT Minimum Calculator – pure client side.
 * -------------------------------------------------
 * 1️⃣ Reads the static JSON table located at /data/pt_minimums.json
 * 2️⃣ Looks up the proper age‑band row for the supplied gender/age
 * 3️⃣ Calculates the total PT score (same logic as the original repo)
 * 4️⃣ Compares to the "minimum" field and displays PASS/FAIL.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pt-form');
  const resultDiv = document.getElementById('result');

  // -------------------------------------------------
  // Helper: turn "mm:ss" into total seconds
  // -------------------------------------------------
  const parseRun = timeStr => {
    const [m, s] = timeStr.split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
  };

  // -------------------------------------------------
  // Load the static minimum‑table JSON once, then cache it.
  // -------------------------------------------------
  let ptTable = null;
  fetch('data/pt_minimums.json')
    .then(r => r.ok ? r.json() : Promise.reject('Table not found'))
    .then(json => { ptTable = json; })
    .catch(err => {
      resultDiv.innerHTML = `<p style="color:red;">Error loading data: ${err}</p>`;
    });

  // -------------------------------------------------
  // Main submit handler
  // -------------------------------------------------
  form.addEventListener('submit', e => {
    e.preventDefault();                 // stop page reload
    if (!ptTable) return;               // data not loaded yet

    // ---- read user input -------------------------------------------------
    const gender   = document.getElementById('gender').value.toUpperCase();
    const age      = parseInt(document.getElementById('age').value, 10);
    const pushups  = parseInt(document.getElementById('pushups').value, 10);
    const situps   = parseInt(document.getElementById('situps').value, 10);
    const runTime  = parseRun(document.getElementById('run_time').value);

    // ---- locate the proper age‑band row -----------------------------------
    const row = ptTable.find(r =>
        r.gender === gender && age >= r.age_min && age <= r.age_max
    );

    if (!row) {
      resultDiv.innerHTML = `<p style="color:red;">No PT table entry for age ${age}</p>`;
      return;
    }

    // ---- functions to convert raw numbers → points (same as original lib) ----
    const pointsFromReps = (tableArr, reps) => {
      // tableArr is an array of objects: [{reps: 0, pts: 0}, …]
      // Find the two surrounding rows and linearly interpolate.
      for (let i = 0; i < tableArr.length - 1; i++) {
        const a = tableArr[i];
        const b = tableArr[i + 1];
        if (reps >= a.reps && reps <= b.reps) {
          const ratio = (reps - a.reps) / (b.reps - a.reps);
          return a.pts + ratio * (b.pts - a.pts);
        }
      }
      // Below the lowest entry → give the lowest point value
      return tableArr[0].pts;
    };

    const pointsFromRun = (tableArr, secs) => {
      // Same linear interpolation, but table is sorted from fastest → slowest
      for (let i = 0; i < tableArr.length - 1; i++) {
        const a = tableArr[i];
        const b = tableArr[i + 1];
        if (secs >= a.time && secs <= b.time) {
          const ratio = (secs - a.time) / (b.time - a.time);
          return a.pts + ratio * (b.pts - a.pts);
        }
      }
      return tableArr[tableArr.length - 1].pts; // worst case
    };

    // ---- compute component points -----------------------------------------
    const puPts = pointsFromReps(row.pushup, pushups);
    const suPts = pointsFromReps(row.situp, situps);
    const runPts = pointsFromRun(row.run, runTime);

    const total = puPts + suPts + runPts;
    const passes = total >= row.minimum;

    // ---- render the result -------------------------------------------------
    const status   = passes ? 'PASS' : 'FAIL';
    const colour   = passes ? 'green' : 'red';
    const html = `
      <div style="border:1px solid ${colour}; padding:10px; margin-top:10px;">
        <strong style="color:${colour}">Result: ${status}</strong><br>
        Total Score: ${total.toFixed(1)}<br>
        Minimum Required: ${row.minimum}<br>
        Grade: ${total >= row.excellent ? 'Excellent' : (passes ? 'Pass' : 'Fail')}<br>
        (Push‑ups ${puPts.toFixed(1)} pts, Sit‑ups ${suPts.toFixed(1)} pts, Run ${runPts.toFixed(1)} pts)
      </div>`;
    resultDiv.innerHTML = html;
  });
});
