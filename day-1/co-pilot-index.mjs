import fs from "fs/promises";

const data = (await fs.readFile("data", "utf8")).split("\n").filter(Boolean);

// Parse all instructions once - extract direction sign and step count
const instructions = new Int16Array(data.length);
for (let i = 0; i < data.length; i++) {
  const line = data[i];
  const steps = parseInt(line.slice(1), 10);
  instructions[i] = line[0] === "L" ? -steps : steps;
}

// Part 1: Count how many times we land on position 0 after each instruction
let dial = 50;
let zeroCount = 0;

for (let i = 0; i < instructions.length; i++) {
  dial = (((dial + instructions[i]) % 100) + 100) % 100;
  zeroCount += dial === 0;
}

console.log("PART1:", zeroCount);

// Part 2: Count every intermediate step that lands on 0
dial = 50;
zeroCount = 0;

for (let i = 0; i < instructions.length; i++) {
  const steps = instructions[i];
  const absSteps = steps < 0 ? -steps : steps;
  const dir = steps < 0 ? -1 : 1;

  for (let j = 0; j < absSteps; j++) {
    dial += dir;
    if (dial < 0) dial = 99;
    else if (dial > 99) dial = 0;
    zeroCount += dial === 0;
  }
}

console.log("PART2:", zeroCount);
