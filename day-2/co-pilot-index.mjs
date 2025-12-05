import fs from "fs/promises";

const data = (await fs.readFile("data", "utf8")).trim().split(",");

// Part 1: Find numbers where first half equals second half
let sum1 = 0;

for (const range of data) {
  const dashIdx = range.indexOf("-");
  const start = parseInt(range.slice(0, dashIdx), 10);
  const end = parseInt(range.slice(dashIdx + 1), 10);

  for (let i = start; i <= end; i++) {
    const str = String(i);
    const len = str.length;

    // Skip odd-length numbers (can't split evenly)
    if (len & 1) continue;

    const half = len >> 1;
    let match = true;
    for (let j = 0; j < half; j++) {
      if (str[j] !== str[half + j]) {
        match = false;
        break;
      }
    }
    if (match) sum1 += i;
  }
}

console.log("PART 1:", sum1);

// Part 2: Find numbers with any repeating pattern
let sum2 = 0;

// Check if string has a repeating pattern of given chunk size
function hasRepeatingPattern(str, chunkSize) {
  const firstChunk = str.slice(0, chunkSize);
  for (let i = chunkSize; i < str.length; i += chunkSize) {
    for (let j = 0; j < chunkSize; j++) {
      if (str[i + j] !== firstChunk[j]) return false;
    }
  }
  return true;
}

for (const range of data) {
  const dashIdx = range.indexOf("-");
  const start = parseInt(range.slice(0, dashIdx), 10);
  const end = parseInt(range.slice(dashIdx + 1), 10);

  for (let i = start; i <= end; i++) {
    const str = String(i);
    const len = str.length;

    if (len < 2) continue;

    // Check all possible chunk sizes from 1 to len/2
    const maxChunk = len >> 1;
    for (let chunkSize = 1; chunkSize <= maxChunk; chunkSize++) {
      if (len % chunkSize !== 0) continue;

      if (hasRepeatingPattern(str, chunkSize)) {
        sum2 += i;
        break;
      }
    }
  }
}

console.log("PART 2:", sum2);
