import fs from "fs/promises";

const data = (await fs.readFile("example", "utf8")).split(/\n/).filter(String);
// const data = (await fs.readFile("data", "utf8")).split(/\n/).filter(String);


// Think i want todo a sliding withdow isch approch. 
/*
	So that means that if the data is like this.
	
	114231116

	Then we setup an array that has two point allocated to them.
	
	[leftMostValue, secondLeftMostValue]

	This was we can go from left to right, and if we find a number that is bigger than what we have
	then we can shift the first value and push in the new value.


	Part 2 thoughts:

	The second parts have us making a twelwe long number, so this is more complicated.
	But in reality it might not be, let's assume we have this number:
	
	91111191111191111999
	
	In the old solution we would start with the twelve first, so
	911111911111 and leave the rest 91111999

	Now we should be able to just check right again, and if we find a value that is bigger than anything (with respect to how many numbers are left to the right)
	We just set the checkpoint from there instead, so for instace
*/

const highestPairsOfCombos = [];

for (const row of data) {
	const numArr = row.split("");	
	// we shift out the two first values so we can have a nice value already.
	const highestCombo = [numArr.shift(), numArr.shift()];

	// We now go left to right and check if we can find a bigger number.
	// If we find one bigger we will shift out the first number and push in the new char.
	
	for (const char of numArr) {
		// We have the case where we have a bigger combo from taking another number down the line.
		if (Number(highestCombo[1] + char) > Number(highestCombo[0] + highestCombo[1])) {
			highestCombo.shift();
			highestCombo.push(char);
			continue;
		}
		
		
		// We check if we have the new back number, is it bigger?
		if (Number(highestCombo[0] + char) > Number(highestCombo[0] + highestCombo[1])) {	
			highestCombo[1] = char;
			continue;
		}
	}

	highestPairsOfCombos.push(Number(highestCombo[0] + highestCombo[1]))
}

console.log("PART 1: ", highestPairsOfCombos.reduce((sum, curr) => sum + curr, 0));

// We restart the logic.
highestPairsOfCombos.length = 0;

for (const row of data) {
	// Second part requires exactly twelve numbers, so lets take that instead directly.
	const numArr = row.split("").map(Number);

	// but we go from left to right instead of right to left.
	const twelvebatteries = numArr.slice(0, 12)

	for (let i = 0; i < twelvebatteries.length; i++) {
		const biggerNumberExistIndex = numArr.slice(i, numArr.length - 12 - i).findIndex((num) => num > twelvebatteries[i]);
		const haveEnoughSpaceToMove = numArr.slice(biggerNumberExistIndex).length > (12 - i);

		
		console.log({ haveEnoughSpaceToMove, biggerNumberValue: numArr[biggerNumberExistIndex], i, batteryValue: twelvebatteries[i]})
	}

	console.log({ numArr, twelvebatteries })

}

console.log("PART 2: ", highestPairsOfCombos.reduce((sum, curr) => sum + curr, 0));

