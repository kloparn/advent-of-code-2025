import fs from "fs/promises";

const fileName = "data";

let data = (await fs.readFile(fileName, "utf8")).split(/\n/).filter(String);

let paths = data.reduce((obj, str) => {
	const [key, paths] = [str.split(":")[0], str.split(": ")[1].split(" ")]
	obj[key] = paths;
	return obj;
}, {});

let outPaths = 0;

const queue = [[paths["you"], {}]];

while(queue.length) {
	let [possiblePaths, alreadyTakenPaths] = JSON.parse(JSON.stringify(queue.shift()));

	if (possiblePaths[0] === "out"){
		outPaths++;
		continue;
	}

	// we make sure that the new possible paths are not in the already taken paths.
	possiblePaths = possiblePaths.reduce((arr, newPath) => {
		if (alreadyTakenPaths[newPath]) return arr
		return [...arr, newPath]
	}, []);

	for (const p of possiblePaths) alreadyTakenPaths[p] = true;

	if (!possiblePaths.length) continue; // we have no paths to take from here.

	queue.push(...possiblePaths.map((path) => [paths[path], alreadyTakenPaths]));
}

console.log("PART 1: ", outPaths)

// First time ever we have to swap example files :(

if (fileName === "example") {
	data = (await fs.readFile("example2", "utf8")).split(/\n/).filter(String);
}

paths = data.reduce((obj, str) => {
        const [key, paths] = [str.split(":")[0], str.split(": ")[1].split(" ")]
        obj[key] = paths;
        return obj;
}, {});
outPaths = 0;

/*
	My first approach was to continue using the BFS, but this...
	oh man, such a wrongful approach, takes too long.
	We do not need to check all paths, we can use a an approach called
	DAG (Direct acyclic graph), i didn't fully know this was a way to work something
	like this out, but turns out, because there are no loops we can just go through it normally.
*/

const cache = {};

function countPaths(node, hasDac, hasFft) {
	// Check if we are on a "dac" or "fft" location
	const nowHasDac = hasDac || node === "dac";
	const nowHasFft = hasFft || node === "fft";
	
	if (node === "out") {
		return (nowHasDac && nowHasFft) ? 1 : 0;
	}
	
	const key = `${node},${nowHasDac},${nowHasFft}`;
	if (cache[key] !== undefined) {
		return cache[key];
	}

	const nextNodes = paths[node] || [];
	
	let totalPaths = 0;
	for (const nextNode of nextNodes) {
		totalPaths += countPaths(nextNode, nowHasDac, nowHasFft);
	}
	
	// Memoize the result
	cache[key] = totalPaths;
	return totalPaths;
}

outPaths = countPaths("svr", false, false);

console.log("PART 2: ", outPaths)
