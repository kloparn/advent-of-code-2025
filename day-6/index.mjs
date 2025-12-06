import fs from "fs/promises";

const fileName = "data"
const data = (await fs.readFile(fileName, "utf8")).
	split(/\n/)
	.filter(String)
	.map((str) => 
		str
		.split(" ")
		.filter(String)
	);

let [operations, calcNumbers] = data.reduce((actions, currAction) => {
	const firstEntry = Number(currAction[0]);

	if (!isNaN(firstEntry)) actions[1].push(currAction);
	else actions[0].push(currAction);
	
	return actions;
}, [[], []])

operations = operations.flat(1);

/*
 * We now must rotate the calcNumbers on their side, that is 
 * we move this:
 * 123 28 51 64
 * 45 64 387 23
 * 6 98 215 314
 *
 * to this:
 * 123 45 6
 * 28 64 98
 * 51 387 215
 * 64 23 314
 */

const rotatedCalcNumbers = []

for (let i = 0; i < calcNumbers[0].length; i++) {
	const rotatedNumbers = []
	for (let j = 0; j < calcNumbers.length; j++) {
		rotatedNumbers.push(calcNumbers[j][i])
	}

	rotatedCalcNumbers.push(rotatedNumbers);
}

let grandTotal = 0;

// we can now loop the operations and the indexes and do a eval on the calc
for (const [index, operation] of operations.entries()) {
	const formatedLine = rotatedCalcNumbers[index].join(operation);

	grandTotal += eval(formatedLine)
}

console.log("PART 1: ", grandTotal);

// --------------------- PART 2 ----------------------

/*
 * Part 2 makes a twist, we are supposed to read left to right in each column to calculate the numbers.
 * So in our normaal calcNumbers it looks like this:
 * 123 328  51 64
 *  45 64  387 23
 *   6 98  215 314
 *
 * to this:
 * 4 431 623
 * 175 581 32
 * 8 248 369
 * 356 24 1
 *
 * The data file lays properly with spaces, so we need to parse it AGAIN.
 */

const data2 = (await fs.readFile(fileName, "utf8")).split(/\n/).filter(String)

const parsedData = data2.reduce((actions, currAction) => {
        const firstEntry = Number(currAction.split(" ")[0]);

        if (!isNaN(firstEntry)) actions[1].push(currAction);
        else actions[0].push(currAction);

        return actions;
}, [[], []])

operations = parsedData[0].join("").split(" ").filter(String).reverse();
calcNumbers = parsedData[1];
rotatedCalcNumbers.length = 0;
grandTotal = 0;

for (let i = 0; i < calcNumbers[0].length; i++) {
        const rotatedNumbers = []
        for (let j = 0; j < calcNumbers.length; j++) {
                rotatedNumbers.push(calcNumbers[j][i])
        }

        rotatedCalcNumbers.push(rotatedNumbers);
}

calcNumbers = rotatedCalcNumbers

const strings = []
for (let i = 0; i <= calcNumbers.length; i++) {
	if (calcNumbers[i]?.filter((s) => s !== ' ').length === 0 || !calcNumbers[i] ) {
		const formatedStr = strings.join(operations.pop())
		const sum = eval(formatedStr);
		grandTotal += eval(sum)
		strings.length = 0;
		continue;
	}

	const str = calcNumbers[i].filter(String).join("");
	strings.push(str);
}

console.log("PART 2: ", grandTotal);
