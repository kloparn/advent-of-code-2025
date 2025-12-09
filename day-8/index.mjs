import fs from "fs/promises";

const fileName = "data";
const numOfPairs = 1000;

const data = (await fs.readFile(fileName, "utf8"))
	.split(/\n/)
	.filter(String)
	.map((str) => str.match(/(\d+)/g).map(Number))

const closestPairs = [];

for (let i = 0; i < data.length - 1; i++) {
	for (let j = i + 1; j < data.length; j++) {
		const [p1, p2] =  [data[i], data[j]];

		// Now we want todo some simple math to measure the distance between two distances.

		const distance = Math.sqrt(
			Math.pow(p1[0] - p2[0], 2) +
			Math.pow(p1[1] - p2[1], 2) +
			Math.pow(p1[2] - p2[2], 2)
		)

		closestPairs.push([p1, p2, distance])
	}
}

closestPairs.sort((a, b) => a[2] - b[2]);

let circuits = [];
const circuitsIndexMap = {};

/*
	As we now have pairs that are close, we can connect them

	Let's create a circuits array and a map that points junction boxes to the correct circuit.
*/

for (let i = 0; i < numOfPairs; i++) {
	const [p1, p2] = [closestPairs[i][0], closestPairs[i][1]];

	// we check both p1 and p2 if they have a circuit

	const p1CircuitIndex = circuitsIndexMap[p1.join(",")]
	const p2CircuitIndex = circuitsIndexMap[p2.join(",")]

	if (p1CircuitIndex === undefined  && p2CircuitIndex === undefined) {
		// nothing is connected, so lets connect them.
		const index = circuits.push([p1, p2]) - 1;
		circuitsIndexMap[p1.join(",")] = index;
		circuitsIndexMap[p2.join(",")] = index;
	} else if (p1CircuitIndex !== undefined && p2CircuitIndex === undefined) {
		// p1 has a circuit, let's connect p2 to it and link it.
		circuits[p1CircuitIndex].push(p2);
		circuitsIndexMap[p2.join(",")] = p1CircuitIndex;
	} else if (p2CircuitIndex !== undefined && p1CircuitIndex === undefined) {
		// p2 has a circuit, let's connect p1 to it and link it.
		circuits[p2CircuitIndex].push(p1);
		circuitsIndexMap[p1.join(",")] = p2CircuitIndex;
	} else if (p1CircuitIndex !== p2CircuitIndex) {
		// Both have circuits but they're different, this means they should be joint
		const circuit2 = circuits[p2CircuitIndex];

		for (const point of circuit2) {
			circuits[p1CircuitIndex].push(point);
			circuitsIndexMap[point.join(",")] = p1CircuitIndex;
		}
		// Clear the old circuit
		circuits[p2CircuitIndex] = [];
	}
}

// now we've mapped the circuits, let's calculate the biggest circuits.
const cpy = JSON.parse(JSON.stringify(circuits));

cpy.sort((a,b) => b.length - a.length)
// we also clear empty circuits.
const threeLargestCircuits = cpy.slice(0, 3);



console.log("PART 1: ", threeLargestCircuits.reduce((sum, curr) => sum * curr.length, 1));


// ----------------- PART 2, connect the circuits until there is only 3 remaning --------

/*
	We want to continue now with the normal loop until we are down to a single big circuit.

	But we have to keep track of the last two that are merged into the main loop.
*/

for (let i = numOfPairs; i <  closestPairs.length; i++) {
	const [p1, p2] = [closestPairs[i][0], closestPairs[i][1]];

        // we check both p1 and p2 if they have a circuit

        const p1CircuitIndex = circuitsIndexMap[p1.join(",")]
        const p2CircuitIndex = circuitsIndexMap[p2.join(",")]

        if (p1CircuitIndex === undefined  && p2CircuitIndex === undefined) {
                // nothing is connected, so lets connect them.
                const index = circuits.push([p1, p2]) - 1;
                circuitsIndexMap[p1.join(",")] = index;
                circuitsIndexMap[p2.join(",")] = index;
        } else if (p1CircuitIndex !== undefined && p2CircuitIndex === undefined) {
                // p1 has a circuit, let's connect p2 to it and link it.
                circuits[p1CircuitIndex].push(p2);
                circuitsIndexMap[p2.join(",")] = p1CircuitIndex;
        } else if (p2CircuitIndex !== undefined && p1CircuitIndex === undefined) {
                // p2 has a circuit, let's connect p1 to it and link it.
                circuits[p2CircuitIndex].push(p1);
                circuitsIndexMap[p1.join(",")] = p2CircuitIndex;
        } else if (p1CircuitIndex !== p2CircuitIndex) {
                // Merge circuits
                const circuit2 = circuits[p2CircuitIndex];

                for (const point of circuit2) {
                        circuits[p1CircuitIndex].push(point);
                        circuitsIndexMap[point.join(",")] = p1CircuitIndex;
                }

                circuits[p2CircuitIndex] = [];
        }

	// After each check, if there are no circuits left
	// AND 
	// All data points have been used, then we have a closed circuit.
	// We will then take the previous circuits that closed the loop

	const mergedCircuits = circuits.filter((it) => it.length);
	const totalPointsInCircuits = mergedCircuits.reduce((sum, c) => sum + c.length, 0);

	if (mergedCircuits.length === 1 && totalPointsInCircuits === data.length) {
                console.log("PART 2: ", p1[0] * p2[0]);
                break;
	}

}
