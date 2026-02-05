const fs = require("fs/promises");

/**
 * Reads JSON health data asynchronously and returns a count of entries.
 * This dataset stores entries under the top-level "metrics" key.
 * @param {string} filePath
 * @returns {Promise<{ totalHealthEntries: number }>}
 */
async function readHealthData(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid health JSON structure.");
    }

    if (!Array.isArray(data.metrics)) {
      throw new Error('Invalid health JSON structure: expected "metrics" to be an array.');
    }

    return { totalHealthEntries: data.metrics.length };
  } catch (err) {
    throw new Error(`Health data error: ${err.message}`);
  }
}

module.exports = { readHealthData };
