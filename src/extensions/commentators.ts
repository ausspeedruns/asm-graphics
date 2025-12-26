import * as nodecgApiContext from "./nodecg-api-context.js";
import _ from "underscore";

import { getReplicant } from "./replicants.js";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData.js";
import type NodeCG from "nodecg/types";

const nodecg = nodecgApiContext.get();
const Log = new nodecg.Logger("Commentators");

const automationSettingsRep = getReplicant("automations");
const commentatorsRep = getReplicant("commentators");
const showHostRep = getReplicant("showHost");

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.default.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

nodecg.listenFor("update-commentator", (commentator) => {
	Log.info(`Updating commentator ${commentator.id} ${commentator.name}`);

	if (commentator.id) {
		const commentatorIndex = commentatorsRep.value.findIndex((comm) => comm.id === commentator.id);
		if (commentatorIndex === -1) {
			// Couldn't find commentator but has an id

			// Maybe they are a runner?
			const updatedRunner = updateRunnerInformation(commentator);
			if (updatedRunner) {
				Log.info(`Updated runner information for commentator ${commentator.id} ${commentator.name}`);
				return;
			}

			// Just add them as new commentator
			commentatorsRep.value.push(commentator);
			Log.warn(`Commentator had an ID but could not find the ID in the replicant. ${commentator.id}`);
		} else {
			// Edit existing commentator
			updateExistingCommentator(commentator, commentatorIndex);
		}
	} else {
		// New commentator
		commentatorsRep.value.push({ ...commentator, id: crypto.randomUUID() });
	}
});

nodecg.listenFor("delete-commentator", (id) => {
	Log.info(`Deleting ${id}`);

	if (!commentatorsRep.value.find((commentator) => commentator.id === id)) {
		Log.error(`Tried to delete commentator but could not find them in replicant. ${id}`);
		return;
	}

	commentatorsRep.value = commentatorsRep.value.filter((commentator) => commentator.id !== id);
});

nodecg.listenFor("showHost", (showHost: boolean) => {
	Log.info(`Setting showHost to ${showHost}`);
	showHostRep.value = showHost;
});

function updateExistingCommentator(commentator: RunDataPlayer, index: number) {
	const commentatorsMutable = [...commentatorsRep.value];
	commentatorsMutable[index] = commentator;
	commentatorsRep.value = commentatorsMutable;
}

function updateRunnerInformation(runner: RunDataPlayer): boolean {
	let teamIndex = -1;
	let playerIndex = -1;
	let foundPlayer = false;
	for (let i = 0; i < (SPEEDCONTROL_runDataActiveRep.value?.teams ?? []).length && !foundPlayer; i++) {
		const team = SPEEDCONTROL_runDataActiveRep.value?.teams[i];
		if (!team) continue;

		for (let j = 0; j < (team?.players ?? []).length; j++) {
			const player = team?.players[j];
			if (!player) continue;

			if (player.id === runner.id) {
				teamIndex = i;
				playerIndex = j;
				foundPlayer = true;
				break;
			}
		}
	}

	if (!foundPlayer) {
		Log.error(`Could not find runner to update. Runner: ${runner.id} ${runner.name}`);
		return false;
	}

	const team = SPEEDCONTROL_runDataActiveRep.value?.teams[teamIndex];

	if (!team) {
		Log.error(
			`Found runner and team index but team was undefined. Runner: ${runner.id} ${runner.name} | Team Index: ${teamIndex}`,
		);
		return false;
	}

	if (!team.players[playerIndex]) {
		Log.error(
			`Found runner and team index but runner was undefined. Runner: ${runner.id} ${runner.name} | Team Index: ${teamIndex} | Player Index: ${playerIndex}`,
		);
		return false;
	}

	const originalRunner = _.clone(team.players[playerIndex]);

	if (!originalRunner) {
		Log.error(
			`Could not clone original runner. Runner: ${runner.id} ${runner.name} | Team Index: ${teamIndex} | Player Index: ${playerIndex}`,
		);
		return false;
	}

	team.players[playerIndex] = {
		...originalRunner,
		customData: {
			...originalRunner.customData,
			microphone: runner.customData["microphone"] ?? "",
		},
		name: runner.name,
		pronouns: runner.pronouns,
		social: {
			...originalRunner.social,
			twitch: runner.social.twitch,
		},
	};

	return true;
}

// Clear on new run
nodecg.listenFor("transition:toIntermission", () => {
	if (!automationSettingsRep.value.clearCommentators) return;

	const mutableCommentators = [...commentatorsRep.value];

	commentatorsRep.value = mutableCommentators.filter((commentator) => commentator.id === "host");
});
