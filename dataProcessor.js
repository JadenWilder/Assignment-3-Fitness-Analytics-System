require("dotenv").config();

const { readHealthData } = require("./healthReader");
const { readWorkoutData } = require("./workoutReader");

async function processFiles() {
  const userName = process.env.USER_NAME || "User";
  const weeklyGoal = Number(process.env.WEEKLY_GOAL || 0);

  console.log(`Processing data for: ${userName}`);

  try {
    console.log("📁 Reading workout data...");
    const workouts = await readWorkoutData("./data/workouts.csv");
    console.log(`Total workouts: ${workouts.totalWorkouts}`);
    console.log(`Total minutes: ${workouts.totalMinutes}`);

    console.log("📁 Reading health data...");
    const health = await readHealthData("./data/health-metrics.json");
    console.log(`Total health entries: ${health.totalHealthEntries}`);

    console.log("\n=== SUMMARY ===");
    console.log(`Workouts found: ${workouts.totalWorkouts}`);
    console.log(`Total workout minutes: ${workouts.totalMinutes}`);
    console.log(`Health entries found: ${health.totalHealthEntries}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (weeklyGoal > 0) {
      if (workouts.totalMinutes >= weeklyGoal) {
        console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
      } else {
        console.log(
          `💪 Keep going ${userName}! You need ${weeklyGoal - workouts.totalMinutes} more minutes to hit your goal.`
        );
      }
    }
  } catch (err) {
    console.error("❌ Error processing files:");
    console.error(err.message);
  }
}

processFiles();
