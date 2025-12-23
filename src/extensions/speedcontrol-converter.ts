import * as nodecgApiContext from "./nodecg-api-context.js";

import type { RunData, RunDataActiveRun, RunDataArray } from "@asm-graphics/types/RunData.js";
import { runStartTimeRep } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("Speedcontrol Converter");

const SPEEDCONTROL_runDataArrayRep = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");
const SPEEDCONTROL_runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

function getRunAndIndex(runId: string): [number, RunData | undefined] {
	const runDataArray = SPEEDCONTROL_runDataArrayRep.value;
	if (!runDataArray) {
		log.error("No runDataArray Replicant found");
		return [-1, undefined];
	}

	const runIndex = runDataArray.findIndex((run) => run.id === runId);
	if (runIndex === -1) {
		log.error(`No run found with ID ${runId}`);
		return [-1, undefined];
	}

	return [runIndex, runDataArray[runIndex]];
}

function getRunnerTeamIndexAndPlayerIndex(run: RunData, runnerId: string): [number, number] {
	const teamIndex = run.teams.findIndex((team) => team.players.some((p) => p.id === runnerId));
	if (teamIndex === -1) {
		log.error(`No team found for player ID ${runnerId}`);
		return [-1, -1];
	}

	const playerIndex = run.teams[teamIndex]?.players.findIndex((p) => p.id === runnerId) ?? -1;
	if (playerIndex === -1) {
		log.error(`No player found in team for ID ${runnerId}`);
		return [-1, -1];
	}
	return [teamIndex, playerIndex];
}

nodecg.listenFor("speedcontrol:editRunner", (data) => {
	const runDataArray = SPEEDCONTROL_runDataArrayRep.value;
	if (!runDataArray) {
		log.error("No runDataArray Replicant found");
		return;
	}

	// Find the run object
	const [runIndex, run] = getRunAndIndex(data.runId);

	if (runIndex === -1 || !run) {
		return;
	}

	const [teamIndex, playerIndex] = getRunnerTeamIndexAndPlayerIndex(run, data.runner.id);
	if (teamIndex === -1 || playerIndex === -1) {
		return;
	}

	// Update the player object
	const player = data.runner;
	const team = run.teams[teamIndex];

	if (!team) {
		log.error(`No team found at index ${teamIndex} for run ID ${data.runId}`);
		return;
	}

	team.players[playerIndex] = player;

	runDataArray[runIndex] = run;
	SPEEDCONTROL_runDataArrayRep.value = runDataArray;

	// If the edited run is the active run, re-set the active run Replicant to trigger updates
	if (SPEEDCONTROL_runDataActiveRunRep.value?.id === run.id) {
		SPEEDCONTROL_runDataActiveRunRep.value = JSON.parse(JSON.stringify(run));
	}
});

nodecg.listenFor("speedcontrol:reorderRunners", (data) => {
	// Find the run object
	const runDataArray = SPEEDCONTROL_runDataArrayRep.value;
	if (!runDataArray) {
		log.error("No runDataArray Replicant found");
		return;
	}

	const [runIndex, run] = getRunAndIndex(data.runId);
	if (runIndex === -1 || !run) {
		return;
	}

	// Validate that all players in newOrder exist in the run
	const allPlayerIds = run.teams.flatMap((team) => team.players.map((player) => player.id));
	for (const player of data.newOrder) {
		if (!allPlayerIds.includes(player.id)) {
			log.error(`Player ID ${player.id} in newOrder does not exist in run ID ${data.runId}`);
			return;
		}
	}

	// Reorder players according to newOrder
	const newTeams: typeof run.teams = [];
	for (const player of data.newOrder) {
		const [teamIndex, playerIndex] = getRunnerTeamIndexAndPlayerIndex(run, player.id);
		if (teamIndex === -1 || playerIndex === -1) {
			return;
		}

		const team = run.teams[teamIndex];

		if (!team) {
			log.error(`No team found at index ${teamIndex} for run ID ${data.runId}`);
			return;
		}

		// Check if we already have a team for this player in newTeams
		const newTeamIndex = newTeams.findIndex((t) => t.id === team.id);
		if (newTeamIndex === -1) {
			// Create a new team
			newTeams.push({
				id: team.id,
				players: [player],
			});
		} else {
			const newTeam = newTeams[newTeamIndex];
			if (!newTeam) {
				log.error(`No team found at index ${newTeamIndex} in newTeams for run ID ${data.runId}`);
				return;
			}
			// Add to existing team
			newTeam.players.push(player);
		}
	}

	run.teams = newTeams;

	runDataArray[runIndex] = run;
	SPEEDCONTROL_runDataArrayRep.value = runDataArray;

	// If the edited run is the active run, re-set the active run Replicant to trigger updates
	if (SPEEDCONTROL_runDataActiveRunRep.value?.id === run.id) {
		SPEEDCONTROL_runDataActiveRunRep.value = JSON.parse(JSON.stringify(run));
	}
});

nodecg.listenFor("timerStart", "nodecg-speedcontrol", () => {
	log.info(`Run started, setting runStartTime to ${Date.now()}`);
	runStartTimeRep.value = Date.now();
});

nodecg.listenFor("changeToNextRun", "nodecg-speedcontrol", () => {
	log.info("Changing to next run, resetting runStartTime to null");
	runStartTimeRep.value = null;
});
