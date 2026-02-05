const fs = require("fs/promises");
const path = require("path");
const { readHealthData } = require("../healthReader");

const tmpDir = path.join(__dirname, "tmp_test");

beforeAll(async () => {
  await fs.mkdir(tmpDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('reads valid health JSON with "metrics" array and counts entries', async () => {
  const file = path.join(tmpDir, "health-metrics.json");
  const sample = {
    user: { name: "Test User" },
    metrics: [{ a: 1 }, { a: 2 }, { a: 3 }],
  };

  await fs.writeFile(file, JSON.stringify(sample), "utf-8");

  const result = await readHealthData(file);
  expect(result).toEqual({ totalHealthEntries: 3 });
});

test("throws a helpful error when JSON file is missing", async () => {
  await expect(readHealthData(path.join(tmpDir, "missing.json"))).rejects.toThrow(
    /Health data error/i
  );
});
