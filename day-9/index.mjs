import fs from "fs";

const fileName = "data"

const data = (await fs.promises.readFile(fileName, "utf8")).split(/\n/).filter(String).map((str) => str.replaceAll(" ").split(",")).map((it) => it.map(Number));

/*
	To calculate the area between two points we can use this formula.

	Take into account that p1 is the one with the smallst x.

	const height = (p1[1] - 1) - p2[1];
	const width = (P)[0] - 1] - p2[0];

	Then we get the area by just multiplying them and abs it.
	const area = Math.abs(height * width);
*/

const p1start = performance.now()

const pointsAndAreas = [];

for (let i = 0; i < data.length - 1; i++) {
	for (let j = i + 1; j < data.length; j++) {
		// We now want to pick the smallest value to be X
		let p1, p2;

		if (data[i][0] < data[j][0]) {
			p1 = data[i]
			p2 = data[j]
		} else {
			p1 = data[j]
			p2 = data[i]
		}

		// now we implement the algorithm to get the points.

		const height = (p1[1] - 1) - p2[1];
					const width = (p1[0] - 1) - p2[0];

					const area = Math.abs(height * width);

		pointsAndAreas.push([[p1, p2], area])
	}
}

// we sort the squares on their size and then take the first biggest.
pointsAndAreas.sort((a,b) => b[1] - a[1])

console.log("PART 1: ", pointsAndAreas[0][1], performance.now() - p1start);

const p2start = performance.now();

/*
	Part 2 seems to be a bit more complicated, now instead we want to trace the shapes.

	steps.
		1. Create the outer border
			- All points will have two points next to it
			- These points we add as a "wall", points have to be inside these to work.
		2. Loop through the points we have and draw a line to the walls
			- We have to make sure we are inside the walls
			- If we go past a wall, then it's invalid.
		3. We have to use the rules of "colors";
			- Two RED tiles (input data points) are opposite corners
			- ALL tiles inside the rectangle are red or green
*/

// we loop through the points and score them if they are paralell to eachother.
const pointsThatAreConnected = {};

for(let i = 0; i < data.length - 1; i++) {
	for (let j = i + 1; j < data.length; j++) {
		const p1 = data[i]
		const p2 = data[j]

		// Check if they are not paralell
		if (p1[0] - p2[0] !== 0 && p1[1] - p2[1] !== 0) {
			continue;
		}

		if (!pointsThatAreConnected[p1.join(",")]) {
			pointsThatAreConnected[p1.join(",")] = [p2];
		} else {
			pointsThatAreConnected[p1.join(",")].push(p2);
		}

	}
}

// Now we have the connecting points, let's fill our boundry area.
// Connect consecutive points in the path (and close the loop)
const boundryArea = {};

for (let i = 0; i < data.length; i++) {
	const p1 = data[i];
	const p2 = data[(i + 1) % data.length]; // next point, wrapping to first

	// Mark both endpoints
	boundryArea[p1.join(",")] = true;
	boundryArea[p2.join(",")] = true;

	// Fill in the line between p1 and p2
	const minX = Math.min(p1[0], p2[0]);
	const maxX = Math.max(p1[0], p2[0]);
	const minY = Math.min(p1[1], p2[1]);
	const maxY = Math.max(p1[1], p2[1]);

	// Horizontal line
	if (p1[1] === p2[1]) {
		for (let x = minX; x <= maxX; x++) {
			boundryArea[[x, p1[1]].join(",")] = true;
		}
	}
	// Vertical line
	else if (p1[0] === p2[0]) {
		for (let y = minY; y <= maxY; y++) {
			boundryArea[[p1[0], y].join(",")] = true;
		}
	}
}

// Store boundary segments for fast intersection checking
const horizontalSegments = []; // {y, x1, x2}
const verticalSegments = [];   // {x, y1, y2}

for (let i = 0; i < data.length; i++) {
	const p1 = data[i];
	const p2 = data[(i + 1) % data.length];

	if (p1[1] === p2[1]) {
		// Horizontal segment
		horizontalSegments.push({
			y: p1[1],
			x1: Math.min(p1[0], p2[0]),
			x2: Math.max(p1[0], p2[0])
		});
	} else if (p1[0] === p2[0]) {
		// Vertical segment
		verticalSegments.push({
			x: p1[0],
			y1: Math.min(p1[1], p2[1]),
			y2: Math.max(p1[1], p2[1])
		});
	}
}


// Check if a rectangle is valid by ensuring no boundary segments cut through its interior
function isRectangleValid(p1, p2) {
	const minX = Math.min(p1[0], p2[0]);
	const maxX = Math.max(p1[0], p2[0]);
	const minY = Math.min(p1[1], p2[1]);
	const maxY = Math.max(p1[1], p2[1]);

	// Check horizontal segments - does any cut through the rectangle's interior?
	for (const seg of horizontalSegments) {
		// Segment is inside Y range (not on top/bottom edge)
		if (seg.y > minY && seg.y < maxY) {
			// Segment overlaps X range
			if (seg.x1 < maxX && seg.x2 > minX) {
				// This segment cuts through the rectangle
				return false;
			}
		}
	}

	// Check vertical segments - does any cut through the rectangle's interior?
	for (const seg of verticalSegments) {
		// Segment is inside X range (not on left/right edge)
		if (seg.x > minX && seg.x < maxX) {
			// Segment overlaps Y range
			if (seg.y1 < maxY && seg.y2 > minY) {
				// This segment cuts through the rectangle
				return false;
			}
		}
	}

	return true;
}

let biggestValidSquare = null;
let biggestValidArea = 0;

// Check all pairs of RED tiles (input data points) as potential opposite corners
for (let i = 0; i < data.length - 1; i++) {
	for (let j = i + 1; j < data.length; j++) {
		const p1 = data[i];
		const p2 = data[j];

		// Calculate the area of the potential rectangle (inclusive)
		const width = Math.abs(p1[0] - p2[0]) + 1;
		const height = Math.abs(p1[1] - p2[1]) + 1;
		const area = width * height;

		// Skip if this can't beat our current best
		if (area <= biggestValidArea) {
			continue;
		}

		// Check if no boundary segments cut through this rectangle
		if (isRectangleValid(p1, p2)) {
			biggestValidArea = area;
			biggestValidSquare = [p1, p2];
		}
	}
}

console.log("PART 2:", biggestValidArea, performance.now() - p2start);
