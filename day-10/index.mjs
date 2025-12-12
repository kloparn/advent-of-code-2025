import fs from "fs/promises";

const fileName = "data";

const data = (await fs.readFile(fileName, "utf8"))
	.split(/\n/)
	.filter(String)
	.map((str) => str.match(/(\[.*?\])\s*(\([^{}]+\))+\s*(\{.*?\})/).splice(1,3));

/*
	PART 1 steps.

	1. Parse the pattern we want, and reset to turn of all switches.
	2. Do a breadth first search to find it, and if we reach it in few steps, save it as minimum.
	3. Save the least steps to the sumOfLeastSteps
*/

let sumOfLeastSteps = 0;

const p1Start = performance.now()

/*
for (const step of data) {
	let [lightSwitches, buttons] = step;
	const alreadyChecked = {}

	lightSwitches = lightSwitches.split("").splice(1, lightSwitches.length - 2).join("");

	const finishedState = JSON.parse(JSON.stringify(lightSwitches));
	const resetState = lightSwitches.split("").map((state) => ".")
	let minimumButtonPresses = Infinity;


	const switchActions = buttons.split(" ").map((it) => it.replaceAll(/[\(\)]/g, "").split(",").map(Number));
	const queue = JSON.parse(JSON.stringify([...switchActions.map((action) => [action, resetState, 0])]));
	while (queue.length) {
		const [action, switchesState, pressesDone] = JSON.parse(JSON.stringify(queue.shift()));

		// If we have already reached this switch state, then we can ignore it.
		if (alreadyChecked[switchesState.join("") + action.join("")] !== undefined) {
			continue;
		}
		if (pressesDone > 0) alreadyChecked[switchesState.join("") + action.join("")] = true;

		if (minimumButtonPresses <= pressesDone) continue;

		if (switchesState.join("") === finishedState) {
			minimumButtonPresses = Math.min(pressesDone, minimumButtonPresses);
			continue;
		}

		const filteredActions = switchActions.filter((a) => a.join("") !== action.join(""));

		// we now want to update the state of this action.
		for (const switchIndex of action) {
			if (switchesState[switchIndex] === ".") switchesState[switchIndex] = "#"
			else switchesState[switchIndex] = ".";
		}
	
		for (const newAction of filteredActions) {
			queue.push([newAction, switchesState, pressesDone + 1])
		}
	}

	sumOfLeastSteps += minimumButtonPresses;
}

console.log("PART 1: ", sumOfLeastSteps, Math.round((performance.now() - p1Start) / 1000) + " seconds");
*/
const p2Start = performance.now()
sumOfLeastSteps = 0;

// Solve using Integer Linear Programming approach with Gaussian elimination
// For a system Ax = b where A is the button-to-counter matrix:
// 1. Use Gaussian elimination to find the row echelon form
// 2. Express dependent variables in terms of free variables
// 3. Search over free variables to minimize total presses

function solveMinPresses(buttons, targets) {
	const numButtons = buttons.length;
	const numCounters = targets.length;
	
	// Build the augmented matrix [A | b] where A[i][j] = 1 if button j affects counter i
	// We'll work with rational numbers to avoid floating point issues
	const matrix = [];
	for (let i = 0; i < numCounters; i++) {
		const row = new Array(numButtons + 1).fill(0);
		row[numButtons] = targets[i]; // augmented column
		matrix.push(row);
	}
	for (let j = 0; j < numButtons; j++) {
		for (const counter of buttons[j]) {
			matrix[counter][j] = 1;
		}
	}
	
	// Gaussian elimination to row echelon form
	const pivotCols = []; // which column is the pivot for each row
	let pivotRow = 0;
	
	for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
		// Find pivot
		let maxRow = pivotRow;
		for (let row = pivotRow + 1; row < numCounters; row++) {
			if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
				maxRow = row;
			}
		}
		
		if (matrix[maxRow][col] === 0) continue; // No pivot in this column
		
		// Swap rows
		[matrix[pivotRow], matrix[maxRow]] = [matrix[maxRow], matrix[pivotRow]];
		
		// Scale pivot row
		const scale = matrix[pivotRow][col];
		for (let j = col; j <= numButtons; j++) {
			matrix[pivotRow][j] /= scale;
		}
		
		// Eliminate below and above
		for (let row = 0; row < numCounters; row++) {
			if (row !== pivotRow && matrix[row][col] !== 0) {
				const factor = matrix[row][col];
				for (let j = col; j <= numButtons; j++) {
					matrix[row][j] -= factor * matrix[pivotRow][j];
				}
			}
		}
		
		pivotCols.push({ row: pivotRow, col });
		pivotRow++;
	}
	
	// Identify free variables (columns that are not pivots)
	const pivotColSet = new Set(pivotCols.map(p => p.col));
	const freeVars = [];
	for (let j = 0; j < numButtons; j++) {
		if (!pivotColSet.has(j)) freeVars.push(j);
	}
	
	// Check for inconsistent equations (0 = non-zero)
	for (let row = pivotRow; row < numCounters; row++) {
		if (Math.abs(matrix[row][numButtons]) > 1e-9) {
			// Inconsistent system - no solution
			return Infinity;
		}
	}
	
	// For each pivot variable, express it in terms of free variables
	// pivotVar = constant - sum(coeff * freeVar)
	const pivotExprs = []; // { pivotCol, constant, coeffs: { freeCol: coeff } }
	for (const { row, col } of pivotCols) {
		const expr = { pivotCol: col, constant: matrix[row][numButtons], coeffs: {} };
		for (const freeCol of freeVars) {
			if (Math.abs(matrix[row][freeCol]) > 1e-9) {
				expr.coeffs[freeCol] = -matrix[row][freeCol];
			}
		}
		pivotExprs.push(expr);
	}
	
	// Calculate max values for each button
	const maxPresses = buttons.map(btn => Math.min(...btn.map(c => targets[c])));
	
	// For each free variable, compute valid bounds based on pivot constraints
	// For a pivot: val = constant + sum(coeff * freeVar)
	// We need 0 <= val <= maxPresses[pivotCol]
	
	// Simpler bounds: just use 0 to maxPresses for each free variable
	// The tight bounds are too complex when multiple free variables interact
	const freeVarBounds = freeVars.map((freeCol) => {
		return { min: 0, max: maxPresses[freeCol] };
	});
	
	// If there are too many free variables with large ranges, this will be slow
	// Calculate total search space
	let searchSpace = 1;
	for (const b of freeVarBounds) {
		searchSpace *= (b.max - b.min + 1);
		if (searchSpace > 1e8) break;
	}
	
	// If search space is too large, we need a different approach
	// For now, let's try to limit the search
	if (searchSpace > 1e7) {
		// Too large - try limiting each free var to a smaller range around 0
		for (const b of freeVarBounds) {
			b.max = Math.min(b.max, 50);
		}
	}
	
	// Search over free variable values
	let bestSum = Infinity;
	
	function searchFreeVars(freeIdx, freeValues) {
		if (freeIdx === freeVars.length) {
			// Calculate all button presses
			const presses = new Array(numButtons).fill(0);
			
			// Set free variable values
			for (let i = 0; i < freeVars.length; i++) {
				presses[freeVars[i]] = freeValues[i];
			}
			
			// Calculate pivot variable values
			for (const expr of pivotExprs) {
				let val = expr.constant;
				for (const [freeCol, coeff] of Object.entries(expr.coeffs)) {
					val += coeff * presses[parseInt(freeCol)];
				}
				// Check if valid integer
				if (Math.abs(val - Math.round(val)) > 1e-9) return;
				val = Math.round(val);
				if (val < 0 || val > maxPresses[expr.pivotCol]) return;
				presses[expr.pivotCol] = val;
			}
			
			// Calculate total
			const total = presses.reduce((a, b) => a + b, 0);
			if (total < bestSum) {
				bestSum = total;
			}
			return;
		}
		
		const bounds = freeVarBounds[freeIdx];
		
		// Prune: estimate minimum possible total
		const currentSum = freeValues.reduce((a, b) => a + b, 0);
		if (currentSum >= bestSum) return;
		
		for (let v = bounds.min; v <= bounds.max; v++) {
			freeValues[freeIdx] = v;
			searchFreeVars(freeIdx + 1, freeValues);
		}
		freeValues[freeIdx] = 0;
	}
	
	if (freeVars.length === 0) {
		// System is fully determined, just compute the solution
		const presses = new Array(numButtons).fill(0);
		for (const expr of pivotExprs) {
			const val = Math.round(expr.constant);
			if (val < 0 || Math.abs(expr.constant - val) > 1e-9) return Infinity;
			presses[expr.pivotCol] = val;
		}
		return presses.reduce((a, b) => a + b, 0);
	}
	
	searchFreeVars(0, new Array(freeVars.length).fill(0));
	return bestSum;
}

for (const step of data) {
	let [_, buttons, wantedJolts] = step;

	// Parse wanted joltage requirements
	wantedJolts = wantedJolts.split("").splice(1, wantedJolts.length - 2).join("").split(",").map(Number);

	// Parse button actions
	const switchActions = buttons.split(" ").map((it) => it.replaceAll(/[\(\)]/g, "").split(",").map(Number));

	const minimumButtonPresses = solveMinPresses(switchActions, wantedJolts);

	sumOfLeastSteps += minimumButtonPresses;
}
console.log("PART 2: ", sumOfLeastSteps, Math.round((performance.now() - p2Start) / 1000) + " seconds");
