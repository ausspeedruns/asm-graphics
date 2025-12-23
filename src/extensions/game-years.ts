import type { RunData, RunDataArray } from "@asm-graphics/types/RunData.js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import _ from "underscore";
import { run } from "node:test";

const nodecg = nodecgApiContext.get();
const logger = new nodecg.Logger("Game years");

interface TwitchAPIData {
	state: "off" | "authenticating" | "on";
	sync: boolean;
	accessToken?: string;
	refreshToken?: string;
	channelName?: string;
	channelID?: string;
	broadcasterType?: string;
	featuredChannels: string[];
}

const twitchApiRep = nodecg.Replicant<TwitchAPIData>("twitchAPIData", "nodecg-speedcontrol");
const runsRep = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");
const twitchClientId = nodecg.bundleConfig.twitch?.clientId ?? "";

function generateMultiQuery() {
	if (!runsRep.value || !runsRep.value.length) {
		return [];
	}

	const runQueries: { runId: string; query: string }[] = [];

	runsRep.value.forEach((run) => {
		if (!run.game || run.system == "IRL") {
			return;
		}

		runQueries.push({
			runId: run.id,
			query: `query games "<${run.id}> ${run.game}" { fields first_release_date; search "${run.game}"; };`,
		});
	});

	return runQueries;
}

const runIdRegex = /<([a-zA-Z0-9]+)>/;

interface GameDataResponse {
	name: string;
	result: GameDataResult[];
}

interface GameDataResult {
	id: number;
	first_release_date: number;
}

function isGameData(element: unknown): element is GameDataResponse[] {
	return (
		typeof element === "object" &&
		element !== null &&
		Array.isArray(element) &&
		element.every(
			(item) =>
				typeof item === "object" &&
				item !== null &&
				"name" in item &&
				"result" in item &&
				Array.isArray(item.result),
		)
	);
}

function isGameResult(element: unknown): element is GameDataResult {
	return typeof element === "object" && element !== null && "id" in element && "first_release_date" in element;
}

async function getGameData() {
	if (!twitchClientId) {
		logger.error("Twitch Client ID is not set in the config!");
		return;
	}

	if (!twitchApiRep.value?.accessToken) {
		logger.error("Twitch API is not authenticated!");
		return;
	}

	if (!runsRep.value || runsRep.value.length === 0) {
		logger.error("No runs found in the schedule!");
		return;
	}

	logger.info(`Getting Game Years: Estimated Time: ${(250 * runsRep.value.length) / 1000}s`);

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	for (const run of runsRep.value) {
		if (!run.game || run.system == "IRL") {
			logger.info(`Skipping run: ${run.id} - ${run.game}`);
			continue;
		}

		await processRun(run);
		await delay(250); // Delay for 250 milliseconds (4 requests per second)
	}
}

async function processRun(run: RunData) {
	if (!run.game) {
		return;
	}

	logger.info(`Getting game data for run: ${run.id} - ${run.game}`);

	const data = await fetchGameData(run.game);

	const json = await data.json();

	if (!json || !Array.isArray(json) || json.length === 0) {
		logger.error(`No game data found for run: ${run.id} - ${run.game}`);
		return;
	}

	if (!isGameResult(json[0])) {
		logger.error(`Failed to get game data for run: ${run.id} - ${run.game}`, json);
		return;
	}

	const year = new Date(json[0].first_release_date * 1000);
	run.release = year.getFullYear().toString();

	logger.info(`Run ID: ${run.id}, Game: ${run.game}, Year: ${year.getFullYear()}`);

	nodecg.sendMessageToBundle("modifyRun", "nodecg-speedcontrol", run);
}

async function fetchGameData(game: string) {
	return fetch("https://api.igdb.com/v4/games", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Client-ID": twitchClientId,
			Authorization: `Bearer ${twitchApiRep.value?.accessToken}`,
		},
		body: `fields first_release_date; search "${game}";`,
	});
}

nodecg.listenFor("scheduleImport:getGameYears", () => {
	void getGameData();
});
