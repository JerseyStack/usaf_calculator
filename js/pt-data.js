// pt-data.js – this file only defines a global constant called ptData
// (Source: PT Charts New - 50-20-15-15_with 2Mile_FINAL_23 Sep 25.pdf)

export const ptData = {
  male: {
    // ---------  < 25  (the “Males <25 years of age” table) ----------
    "0-24": {
      // Minimum points the *other* two components must deliver
      // (the points column shown in the PDF – e.g. 14.9, 14.7, …)
      // We store the *point* value; the script will later translate it
      // to the required repetitions using the same table.
      pushUps: 14.9,          // ≥ 66 reps = 14.9 pts
      handRelease: 14.7,      // ≥ 39 reps = 14.7 pts
      sitUps: 14.8,           // ≥ 57 reps = 14.8 pts
      coreCrunch: 14.7,       // ≥ 48 reps = 14.7 pts
      forearmPlank: 14.8      // ≥ 3:30 = 14.8 pts
    },

    // ---------  55‑59  (the “Males 55‑59 years of age” table) ----------
    "55-59": {
      pushUps: 14.9,          // ≥ 33 reps = 14.9 pts
      handRelease: 14.7,      // ≥ 33 reps = 14.7 pts
      sitUps: 14.8,           // ≥ 44 reps = 14.8 pts
      coreCrunch: 14.8,       // ≥ 41 reps = 14.8 pts
      forearmPlank: 14.8      // ≥ 3:00 = 14.8 pts
    },

    // ---------  Over 60 (same structure – see table “Males over 60”) ----------
    "60-80": {
      pushUps: 14.9,
      handRelease: 14.7,
      sitUps: 14.8,
      coreCrunch: 14.8,
      forearmPlank: 14.8
    },

    // You can add any other male age ranges that appear in the PDF
    // (e.g., 25‑29, 30‑34, …) following the same pattern.
  },

  female: {
    // ---------  < 25  (Females <25 years of age) ----------
    "0-24": {
      pushUps: 14.9,          // ≥ 21 reps = 15 pts (the minimum shown is 15 pts)
      handRelease: 14.7,      // ≥ 24 reps = 15 pts
      sitUps: 14.8,           // ≥ 31 reps = 15 pts
      coreCrunch: 14.7,       // ≥ 32 reps = 15 pts
      forearmPlank: 14.8      // ≥ 2:50 = 15 pts
    },

    // ---------  45‑49 (Females 45‑49 years of age) ----------
    "45-49": {
      pushUps: 14.9,          // ≥ 37 reps = 15 pts
      handRelease: 14.7,      // ≥ 28 reps = 15 pts
      sitUps: 14.8,           // ≥ 35 reps = 15 pts
      coreCrunch: 14.8,       // ≥ 40 reps = 15 pts
      forearmPlank: 14.8      // ≥ 3:05 = 15 pts
    },

    // ---------  55‑59 (Females 55‑59 years of age) ----------
    "55-59": {
      pushUps: 14.9,          // ≥ 21 reps = 15 pts
      handRelease: 14.7,      // ≥ 24 reps = 15 pts
      sitUps: 14.8,           // ≥ 31 reps = 15 pts
      coreCrunch: 14.7,       // ≥ 32 reps = 15 pts
      forearmPlank: 14.8      // ≥ 2:50 = 15 pts
    },

    // ---------  Over 60 ----------
    "60-80": {
      pushUps: 14.9,
      handRelease: 14.7,
      sitUps: 14.8,
      coreCrunch: 14.7,
      forearmPlank: 14.8
    }
  }
};
