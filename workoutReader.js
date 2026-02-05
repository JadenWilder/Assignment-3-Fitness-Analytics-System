const fs = require("fs");
const csv = require("csv-parser");

/**
 * Reads CSV workout data asynchronously and returns:
 * - totalWorkouts: number of rows
 * - totalMinutes: sum of a detected minutes/duration column
 * Handles missing/corrupted files with clear errors.
 */
function readWorkoutData(filePath) {
  return new Promise((resolve, reject) => {
    let totalWorkouts = 0;
    let totalMinutes = 0;
    let minutesKey = null;

    const candidateKeys = [
      "minutes", "Minutes",
      "duration", "Duration",
      "mins", "Mins",
      "totalMinutes", "total_minutes",
      "workoutMinutes", "workout_minutes",
      "time", "Time"
    ];

    fs.createReadStream(filePath)
      .on("error", (err) => reject(new Error(`Workout data error: ${err.message}`)))
      .pipe(csv())
      .on("data", (row) => {
        totalWorkouts += 1;

        if (!minutesKey) {
          // Try to find a good minutes column on the first row we see
          const keys = Object.keys(row);
          minutesKey =
            candidateKeys.find((k) => keys.includes(k)) ||
            keys.find((k) => k.toLowerCase().includes("minute")) ||
            keys.find((k) => k.toLowerCase().includes("duration")) ||
            null;
        }

        if (minutesKey && row[minutesKey] != null) {
          const minutes = Number(String(row[minutesKey]).trim());
          if (!Number.isNaN(minutes)) totalMinutes += minutes;
        }
      })
      .on("end", () => resolve({ totalWorkouts, totalMinutes }))
      .on("error", (err) => reject(new Error(`Workout data error: ${err.message}`)));
  });
}

module.exports = { readWorkoutData };
