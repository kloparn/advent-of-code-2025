import fs from "fs/promises";

const data = (await fs.readFile("data", "utf8")).split(/,/).map((it) => it.replace(/\n/,""))
// const data = (await fs.readFile("example", "utf8")).split(/,/).map((it) => it.replace(/\n/,""))

const invalidIds = [];

for (const ids of data) {
	const [ start, end ] = ids.split("-")

	// we want to loop through the number to see if they are the same when cut in half.
	for (let i = Number(start); i <= Number(end); i++) {
		// we check if the strings length is divisable by 2
		if (!String(i).length / 2 % 2) continue;

		// Now that we know the case is safe, we can split the string
		const s = String(i).substr(0, String(i).length / 2);
		const e = String(i).substr(String(i).length / 2);

		// if they equal the same then we have an invalid and we push it to the list.
		if (s === e) invalidIds.push(i);
	}
}

console.log("PART 1: ", invalidIds.reduce((sum, curr) => curr + sum, 0));

// we reset for part 2
invalidIds.length = 0;

for (const ids of data) {
		const [ start, end ] = ids.split("-")

		// we want to loop through throught he numbers to see if we can find any repeating number
		for (let i = Number(start); i <= Number(end); i++) {

		if (String(i).length < 2) continue;
		const charDict = String(i).split("").reduce((obj, char) => ({...obj, [char]: obj[char] ? obj[char] + 1 : 1}), {});

		if (Object.keys(charDict).length === 1) {
			invalidIds.push(i);
			continue;
		}


		const roofDivision = Math.floor(String(i).length / 2);
		for (let j = 2; j <= roofDivision; j++) {
			if ((String(i).length / j) % 1 !== 0) continue;

			const iCopy = String(i).split("");

			const iChunked = [];
			while (true) {
				if (iCopy.length === 0) break;
				iChunked.push(iCopy.splice(0, j));
			}

			if (iChunked.every((chunk) => JSON.stringify(chunk) === JSON.stringify(iChunked[0]))) {
				invalidIds.push(i);
				break;
			}
		}
        }
}

console.log("PART 2: ", invalidIds.reduce((sum, curr) => curr + sum, 0));
