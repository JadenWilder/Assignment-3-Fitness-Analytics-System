const fs = require("fs/promises");
const path = require("path");
const { readWorkoutData } = require("../workoutReader");

const tmpDir = path.join(__dirname, "tmp_test");

beforeAll(async () => {
  await fs.mkdir(tmpDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test("reads valid CSV and returns totalWorkouts + totalMinutes", async () => {
  const file = path.join(tmpDir, "workouts.csv");
  const csvData = `type,minutes
run,30
lift,45
bike,25
`;
  await fs.writeFile(file, csvData, "utf-8");

  const result = await readWorkoutData(file);
  expect(result).toEqual({ totalWorkouts: 3, totalMinutes: 100 });
});

test("throws a helpful error when CSV file is missing", async () => {
  await expect(readWorkoutData(path.join(tmpDir, "missing.csv"))).rejects.toThrow(
    /Workout data error/i
  );
});
