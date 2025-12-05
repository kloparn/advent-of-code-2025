import fs from "fs/promises"

const [freshIdIntervals, items] = (await fs.readFile("data", "utf8"))
	.split(/\n/)
	.filter(String)
	.reduce((matrix, it) => {
		if (it.includes("-")) matrix[0].push(it)
		else matrix[1].push(Number(it))
		return matrix
	}, [[],[]]);

const startTimePart1 = performance.now()

// we sort the freshIdIntervals to make the looking process much faster
freshIdIntervals.sort((a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0]))

const smallestFreshNumber = Number(freshIdIntervals[0].split("-")[0]);
const topFreshNumber = Number(JSON.parse(JSON.stringify(freshIdIntervals)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))[0].split("-")[1]);

const freshItems = [];


outer: for (const item of items) {
	for (const freshIdRange of freshIdIntervals) {
		const [botRange, topRange] = [Number(freshIdRange.split("-")[0]), Number(freshIdRange.split("-")[1])];

		const freshBottomRange = item - botRange;
		const freshTopRange    = item - topRange;		
		
		if (freshBottomRange >= 0 && freshTopRange <= 0) {
			freshItems.push(item);
			continue outer;
		}
	}
}

const endTimePart1 = performance.now()

console.log("PART 1: ", freshItems.length, " | ", endTimePart1-startTimePart1,"mm")

// ------------ PART 2 --------------

const startTimePart2 = performance.now()
let amountOfValidFreshItems = 0;

// PART 2 fully ignores the item part, now we have to figure out how many possible items we can have, this should be easy.
// We can just loop through the array and connect overlapping values.

const freshIdRanges = [];
	
let botRange = -Infinity;
let topRange = Infinity;
let index = 0;

while(true) {
	if(!freshIdIntervals[index+1]) {
		const minimum = Number(freshIdIntervals[index].split("-")[0])

		if (Number(topRange) <= minimum) {
			freshIdRanges.push([botRange, topRange])
			freshIdRanges.push(freshIdIntervals[index])
		} else {
			topRange = Math.max(topRange, freshIdIntervals[index].split("-")[1])
			freshIdRanges.push([botRange, topRange])
		}

		break;
	}
	
	if (botRange === -Infinity) [botRange, topRange] = freshIdIntervals[index].split("-");
	else topRange = Math.max(topRange, freshIdIntervals[index].split("-")[1])

	const nextMinimumRange = freshIdIntervals[index+1].split("-")[0]

	if (Number(topRange) < Number(nextMinimumRange)) {
		freshIdRanges.push([botRange, topRange])
		botRange = -Infinity;
		topRange = Infinity;
	}

	index++;
}

// Now we can loop through the entries and add the numbers together.
freshIdRanges.forEach((range) => {
	const uniqueFreshItems = Number(range[1]) - (Number(range[0]) - 1)

	amountOfValidFreshItems += uniqueFreshItems;	
})

const endTimePart2 = performance.now()

console.log("PART 2: ", amountOfValidFreshItems, " | ", endTimePart2 - startTimePart2, "mm")

