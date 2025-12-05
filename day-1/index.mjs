import fs from "fs/promises";

const data = (await fs.readFile("data", "utf8")).split(/\n/).filter(String);
// const data = (await fs.readFile("example", "utf8")).split(/\n/).filter(String);

let dial = 50;
let zeroPositions = 0;

for (const step of data) {
	const [ operation, steps ] = [step[0], step.split(/[LR]/)[1]]
	if (operation === "L") {
		dial -= Number(steps);
		let overStep = Math.floor(dial / 100);

		if (overStep < 0) {
			overStep *= -1;
		}
		if (dial < 0) dial = dial + (overStep * 100);
	} else {
		dial += Number(steps);
		let overStep = Math.floor(dial / 100);

		if (dial > 99) dial = dial - (overStep * 100);
	}

	if(dial === 0) zeroPositions++;
}

console.log("PART1:", zeroPositions)

// We reset the counters

dial = 50;
zeroPositions = 0;

// We now iterate over all the steps to avoid doing the stupid parse.
for (const step of data) {
	const [ operation, steps ] = [step[0], step.split(/[LR]/)[1]];

	if (operation === "L") {
		for (let i = steps; i > 0; i--) {
			dial--;
			if (dial === 0) zeroPositions++;
			if (dial < 0) dial = 99;
		}
	} else {
		for (let i = steps; i > 0; i--) {
			dial++;
			if (dial > 99) dial = 0;
			if (dial === 0) zeroPositions++;
		}
	}
}

console.log("PART2:", zeroPositions);
