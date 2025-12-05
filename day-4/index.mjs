import fs from "fs/promises";

let data = (await fs.readFile("data", "utf-8")).split(/\n/).filter((it) => it !== "");

/* Rules for the forklift to be able to pickup the rolls of paper
 * 
 * 1. If a roll of paper "@" has 4 or less adjecent rolls of paper, then we can more it "X"
 *
 * */

let dataCopy = JSON.parse(JSON.stringify(data));
// For actual counting
let numberOfForkedRolls = 0;

function hasFourOrLessRollsAdjecent(row, index) {
	let rollsAround = 0;

	// up left
	if (data[row - 1]?.[index - 1] === "@") rollsAround++;
	// up up
	if (data[row - 1]?.[index] === "@") rollsAround++;
	// up right
	if (data[row - 1]?.[index + 1] === "@") rollsAround++;
	// left
	if (data[row]?.[index - 1] === "@") rollsAround++;
	//  right
	if (data[row]?.[index + 1] === "@") rollsAround++
	// down left
	if (data[row + 1]?.[index - 1] === "@") rollsAround++;
	// down down
	if (data[row + 1]?.[index] === "@") rollsAround++;
	// down right
	if (data[row + 1]?.[index + 1] === "@") rollsAround++;

	return rollsAround < 4
}

// We are going to do a deep loop. O(n²)
for (let i = 0; i < data.length; i++) {
	for (let j = 0; j < data[i].length; j++) {
		if (dataCopy[i][j] === "@") {
			if (hasFourOrLessRollsAdjecent(i, j)) {
				dataCopy[i] = dataCopy[i].substring(0, j) + "X" + dataCopy[i].substring(j + 1);
				numberOfForkedRolls++
			}
		}
	}
}

console.log("PART 1: ", numberOfForkedRolls)

// ------------------ PART 2 --------------
/* Rules for the second part
 * 1. Now we can repeat the first partern UNTIL we cannot anymore
 *
 * So that would entail that we can do a while ( true ) until we hit a repeating state.
 */

let oldState = JSON.parse(JSON.stringify(data));

let iterations = 0;

while (true) {
	data = JSON.parse(JSON.stringify(dataCopy));

	// we add the break case
	if (JSON.stringify(data) === JSON.stringify(oldState)) break;
	
	iterations++;
	oldState = JSON.parse(JSON.stringify(dataCopy));

	for (let i = 0; i < data.length; i++) {
        	for (let j = 0; j < data[i].length; j++) {
                	if (dataCopy[i][j] === "@") {
                        	if (hasFourOrLessRollsAdjecent(i, j)) {
                                	dataCopy[i] = dataCopy[i].substring(0, j) + "X" + dataCopy[i].substring(j + 1);
                                	numberOfForkedRolls++
                        	}
                	}
        	}
	}

}


console.log("PART 2: ", numberOfForkedRolls)

