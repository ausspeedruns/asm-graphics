import type { RunData, RunDataArray } from "@asm-graphics/types/RunData.js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import gameYears from "./game-years-data.js";

const nodecg = nodecgApiContext.get();
const logger = new nodecg.Logger("Game years");

const runsRep = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");

// Levenshtein distance - measures edit distance between two strings
export function getLevenshteinDistance(a: string, b: string): number {
	const distanceMatrix: number[][] = [];

	// Initialise the matrix
	for (let i = 0; i <= a.length; i++) {
		distanceMatrix[i] = [i];
	}

	const firstRow = distanceMatrix[0];
	if (firstRow) {
		for (let j = 0; j <= b.length; j++) {
			firstRow[j] = j;
		}
	}

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const charA = a[i - 1];
			const charB = b[j - 1];

			const indicator = charA === charB ? 0 : 1;

			// Accessing with nullish coalescing to satisfy noUncheckedIndexedAccess
			const prevRow = distanceMatrix[i - 1] ?? [];
			const currentRow = distanceMatrix[i] ?? [];

			const deletion = (prevRow[j] ?? 0) + 1;
			const insertion = (currentRow[j - 1] ?? 0) + 1;
			const substitution = (prevRow[j - 1] ?? 0) + indicator;

			currentRow[j] = Math.min(deletion, insertion, substitution);
		}
	}

	const lastRow = distanceMatrix[a.length] ?? [];
	return lastRow[b.length] ?? 0;
}

// Normalized similarity score (0-1, where 1 is exact match)
function similarity(a: string, b: string): number {
	const maxLen = Math.max(a.length, b.length);
	if (maxLen === 0) return 1;
	return 1 - getLevenshteinDistance(a, b) / maxLen;
}

interface GameMatch {
	name: string;
	year: number;
	score: number;
}

// Find similar game names from the database
function findSimilarGames(gameName: string, threshold = 0.6, maxResults = 5): GameMatch[] {
	const normalizedInput = gameName.toLowerCase();
	const matches: GameMatch[] = [];

	for (const [name, year] of Object.entries(gameYears)) {
		const normalizedName = name.toLowerCase();

		// Calculate similarity
		const score = similarity(normalizedInput, normalizedName);

		// Also check if input contains the game name or vice versa (helps with subtitle variations)
		const containsBonus =
			normalizedInput.includes(normalizedName) || normalizedName.includes(normalizedInput) ? 0.1 : 0;

		const finalScore = Math.min(score + containsBonus, 1);

		if (finalScore >= threshold) {
			matches.push({ name, year, score: finalScore });
		}
	}

	// Sort by score descending and return top results
	return matches.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

function getGameData() {
	if (!runsRep.value || runsRep.value.length === 0) {
		logger.error("No runs found in the schedule!");
		return;
	}

	logger.info(`Getting Game Years`);

	for (const run of runsRep.value) {
		if (!run.game || run.system == "IRL") {
			logger.info(`Skipping run: ${run.id} - ${run.game}`);
			continue;
		}

		processRun(run);
	}
}

function processRun(run: RunData) {
	if (!run.game) {
		return;
	}

	const year = gameYears[run.game];

	if (!year) {
		// No exact match - find similar games
		const similarGames = findSimilarGames(run.game);

		if (similarGames.length > 0) {
			const suggestions = similarGames
				.map((g) => `"${g.name}" (${g.year}) [${(g.score * 100).toFixed(0)}%]`)
				.join(", ");
			logger.warn(`No exact match for "${run.game}". Did you mean: ${suggestions}`);
		} else {
			logger.warn(`No year data found for game: ${run.game} (no similar matches found)`);
		}
		return;
	}

	run.release = year.toString();

	logger.info(`Run ID: ${run.id}, Game: ${run.game}, Year: ${year}`);

	nodecg.sendMessageToBundle("modifyRun", "nodecg-speedcontrol", run);
}

nodecg.listenFor("scheduleImport:getGameYears", () => {
	getGameData();
});
