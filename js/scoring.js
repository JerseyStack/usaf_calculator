import { PT_DATA } from "./pt-data.js";

export function getAgeBracket(age) {
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

export function getMinimumForScore(gender, age, component, targetScore) {
  const bracket = getAgeBracket(age);
  const table = PT_DATA[gender][bracket][component];

  // Find the *worst* performance that still gives >= targetScore
  return Object.entries(table)
    .filter(([, score]) => score >= targetScore)
    .sort((a, b) => {
      // time-based vs reps-based
      return component === "run" || component === "plank"
        ? b[0].localeCompare(a[0])
        : Number(a[0]) - Number(b[0]);
    })[0];
}
