import type { RunData, RunDataActiveRun, RunDataArray } from "@asm-graphics/types/RunData.js";
import * as nodecgApiContext from "./nodecg-api-context.js";

const nodecg = nodecgApiContext.get();
const logger = new nodecg.Logger("Bonus Runs");

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");
const SPEEDCONTROL_currentRun = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

nodecg.listenFor("asm26:bonusRuns-inject", () => {
	if (!SPEEDCONTROL_runDataArray.value) {
		logger.error("Cannot inject bonus runs: runDataArray is undefined");
		return;
	}

	const mutableRunDataArray = [...SPEEDCONTROL_runDataArray.value];

	const currentRunIndex = mutableRunDataArray.findIndex((run) => run.id === SPEEDCONTROL_currentRun.value?.id);
	if (currentRunIndex === -1) {
		logger.error("Cannot inject bonus runs: current run not found in runDataArray");
		return;
	}

	const existingRunIds = new Set(mutableRunDataArray.map((run) => run.id));
	const runsToInject = BONUS_RUNS.filter((run) => !existingRunIds.has(run.id));
	if (runsToInject.length === 0) {
		logger.warn("Bonus runs are already present in runDataArray");
		return;
	}

	mutableRunDataArray.splice(currentRunIndex + 1, 0, ...runsToInject);
	SPEEDCONTROL_runDataArray.value = mutableRunDataArray;

	logger.info(`Injected ${runsToInject.length} bonus runs after index ${currentRunIndex}`);
});

function createBonusRun(data: {
	game: string;
	category: string;
	estimate: string;
	player: string;
	techPlatform: string;
	system: string;
}): RunData {
	const teamId = crypto.randomUUID();

	return {
		id: crypto.randomUUID(),
		game: data.game,
		category: data.category,
		system: data.system,
		estimate: data.estimate,
		teams: [
			{
				id: teamId,
				players: [
					{
						id: crypto.randomUUID(),
						name: data.player,
						social: {},
						customData: {},
						teamID: teamId,
					},
				],
			},
		],
		customData: {
			techPlatform: data.techPlatform,
		},
	};
}

const BONUS_RUNS = [
	createBonusRun({
		game: "Point Blank - 1 Coin Clear VERY HARD",
		category: "Arcade Shooter",
		estimate: "0:10:00",
		player: "Havra",
		techPlatform: "PlayStation 1",
		system: "PlayStation 1",
	}),
	createBonusRun({
		game: "Final Fantasy",
		category: "Any% JP",
		estimate: "0:05:00",
		player: "syo",
		techPlatform: "Nintendo Entertainment System",
		system: "Nintendo Entertainment System",
	}),
	createBonusRun({
		game: "Spyro 2: Ripto's Rage!",
		category: "Any%",
		estimate: "0:15:00",
		player: "Dactyly",
		techPlatform: "PlayStation 1",
		system: "PlayStation 1",
	}),
	createBonusRun({
		game: "Fantasy Zone",
		category: "Time Attack",
		estimate: "0:10:00",
		player: "Pichy_Stockmann",
		techPlatform: "Arcade",
		system: "Nintendo Switch",
	}),
	createBonusRun({
		game: "The Simpsons Road Rage",
		category: "Mission Mode",
		estimate: "0:10:00",
		player: "Pipack",
		techPlatform: "Nintendo GameCube",
		system: "Nintendo GameCube",
	}),
	createBonusRun({
		game: "Bomberman Quest",
		category: "Any%",
		estimate: "0:10:00",
		player: "tutelarfiber7",
		techPlatform: "Nintendo Entertainment System",
		system: "Nintendo Entertainment System",
	}),
	createBonusRun({
		game: "Super International Cricket",
		category: "Test Match",
		estimate: "0:15:00",
		player: "JTMagicman",
		system: "Nintendo Entertainment System",
		techPlatform: "Nintendo Entertainment System",
	}),
	createBonusRun({
		game: "The Legend Of Zelda: Ocarina of Time",
		category: "Catch A Fish",
		estimate: "0:10:00",
		player: "Thom",
		system: "Nintendo 64",
		techPlatform: "Nintendo 64",
	}),
	createBonusRun({
		game: "Spyro: Enter The Dragonfly",
		category: "Any%",
		estimate: "0:05:00",
		player: "Trent",
		system: "PlayStation 1",
		techPlatform: "PlayStation 1",
	}),
	createBonusRun({
		game: "Leap Year",
		category: "any%",
		estimate: "0:05:00",
		player: "Eisog",
		system: "PC",
		techPlatform: "PC",
	}),
	createBonusRun({
		game: "Tony Hawk's Underground 2",
		category: "Story (Easy)",
		estimate: "0:15:00",
		player: "BalakehB",
		system: "PC",
		techPlatform: "PC",
	}),
	createBonusRun({
		game: "Shovel Knight",
		category: "Pet Memmec",
		estimate: "0:05:00",
		player: "Aun_EL",
		system: "PC",
		techPlatform: "PC",
	}),
	createBonusRun({
		game: "Grand Theft Auto IV",
		category: "Ricky Gervais%",
		estimate: "0:05:00",
		player: "Damosk",
		system: "PS3",
		techPlatform: "PC",
	}),
] as const satisfies RunDataArray;
