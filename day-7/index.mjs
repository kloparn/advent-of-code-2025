import fs from "fs/promises";

const fileName = "example";

const data = (await fs.readFile(fileName, "utf8")).split(/\n/).filter(String).map((row) => row.split(""));

const startPosition = data[0].findIndex((char) => char === "S")

function isBeamUnder([y, x]){
	return data[y+1]?.[x] === "^";
}

function outOfBounce([y, x]){
	return data[y] === undefined || data[y]?.[x] === undefined;
}

let splits = 0;
const queue = [[0, startPosition, 1]];
const visited = {};
let timelines = 0;

while(queue.length) {
	const queueAction = queue.pop()
	const positionString = `${queueAction[0]}|${queueAction[1]}`

	if (!queueAction) continue;
	if (outOfBounce(queueAction)) {
		continue;
	};

	if(visited[positionString]) {
		timelines += visited[positionString];
		console.log(`${positionString}: ${visited[positionString]}`)
		continue;
	};

	visited[positionString] = queueAction[2];
	data[queueAction[0]][queueAction[1]] = "|"

	if (isBeamUnder(queueAction)) { 
		splits++;
		queue.push(
			[queueAction[0] + 1, queueAction[1] + 1, queueAction[2] + 1], // down right
			[queueAction[0] + 1, queueAction[1] - 1, queueAction[2]] // down left
		)
		continue;
	}

	// Base rule we always do if we move down
	queue.push([queueAction[0] + 1, queueAction[1], queueAction[2]]);
}

console.log(JSON.stringify(data.map((it) => it.join("")), null, 2));

console.log("PART 1: ", splits);

const dpQueue = [[0, startPosition, [0, startPosition]]];
const originTimelines = {}

console.log("PART 2: ", timelines);
