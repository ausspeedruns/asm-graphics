import * as nodecgApiContext from "./nodecg-api-context";

import type { RunDataActiveRun, RunDataArray } from "@asm-graphics/types/RunData";
import type { ExtensionReturn } from "../../bundles/nodecg-speedcontrol/src/types/ExtensionReturn";
import { runStartTimeRep } from "./replicants";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("Speedcontrol Converter");

const speedcontrol = nodecg.extensions['nodecg-speedcontrol'] as ExtensionReturn;

const SPEEDCONTROL_runDataArrayRep = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");
const SPEEDCONTROL_runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

nodecg.listenFor("speedcontrol:editRunner", (data) => {
	// Find the run object
	const runDataArray = SPEEDCONTROL_runDataArrayRep.value;

	if (!runDataArray) {
		log.error("No runDataArray Replicant found");
		return;
	}

	const runIndex = runDataArray.findIndex((run) => run.id === data.runId);
	if (runIndex === -1) {
		log.error(`No run found with ID ${data.runId}`);
		return;
	}

	// Find the player object
	const run = runDataArray[runIndex];
	const playerIndex = run.teams.flatMap((team) => team.players).findIndex((player) => player.id === data.runner.id);
	if (playerIndex === -1) {
		log.error(`No player found with ID ${data.runner.id}`);
		return;
	}

	// Update the player object
	const player = data.runner;
	const teamIndex = run.teams.findIndex((team) => team.players.some((p) => p.id === data.runner.id));
	if (teamIndex === -1) {
		log.error(`No team found for player ID ${data.runner.id}`);
		return;
	}

	const team = run.teams[teamIndex];
	const playerInTeamIndex = team.players.findIndex((p) => p.id === data.runner.id);
	if (playerInTeamIndex === -1) {
		log.error(`No player found in team for ID ${data.runner.id}`);
		return;
	}

	team.players[playerInTeamIndex] = player;

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
	const runIndex = runDataArray.findIndex((run) => run.id === data.runId);
	if (runIndex === -1) {
		log.error(`No run found with ID ${data.runId}`);
		return;
	}
	const run = runDataArray[runIndex];

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
		// Find the team this player belongs to
		const teamIndex = run.teams.findIndex((team) => team.players.some((p) => p.id === player.id));
		if (teamIndex === -1) {
			log.error(`No team found for player ID ${player.id}`);
			return;
		}
		const team = run.teams[teamIndex];
		// Find the player in the team
		const playerInTeamIndex = team.players.findIndex((p) => p.id === player.id);
		if (playerInTeamIndex === -1) {
			log.error(`No player found in team for ID ${player.id}`);
			return;
		}
		const playerInTeam = team.players[playerInTeamIndex];
		// Check if we already have a team for this player in newTeams
		const newTeamIndex = newTeams.findIndex((t) => t.id === team.id);
		if (newTeamIndex === -1) {
			// Create a new team
			newTeams.push({
				id: team.id,
				players: [playerInTeam],
			});
		} else {
			// Add to existing team
			newTeams[newTeamIndex].players.push(playerInTeam);
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
})
