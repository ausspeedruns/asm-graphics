import * as nodecgApiContext from "./nodecg-api-context.js";
import _ from "underscore";

import { getReplicant } from "./replicants.js";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData.js";
import type NodeCG from "nodecg/types";

import { HOST_TAG } from "@asm-graphics/shared/constants.js";

const nodecg = nodecgApiContext.get();
const Log = new nodecg.Logger("Commentators");

const automationSettingsRep = getReplicant("automations");
const commentatorsRep = getReplicant("commentators");
const showHostRep = getReplicant("showHost");

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.default.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

function generateBasicCommentator(
	name: string,
	options?: { tag?: string; twitch?: string; microphone?: string },
): RunDataPlayer {
	return {
		name,
		id: crypto.randomUUID(),
		teamID: "commentators",
		social: {
			twitch: options?.twitch ?? "",
		},
		customData: {
			tag: options?.tag ?? "",
			microphone: options?.microphone ?? "",
		},
	};
}

nodecg.listenFor("update-commentator", (commentator) => {
	Log.info(`Updating commentator ${commentator.id} ${commentator.name}`);

	if (commentator.id) {
		const commentatorIndex = commentatorsRep.value.findIndex((comm) => comm.id === commentator.id);
		if (commentatorIndex === -1) {
			// Couldn't find commentator but has an id

			// Maybe they are a runner?
			const updatedRunner = updateRunnerInformation({
				id: commentator.id,
				name: commentator.name,
				pronouns: commentator.pronouns,
				twitch: commentator.twitch,
				microphone: commentator.microphone,
			});
			if (updatedRunner) {
				Log.info(`Updated runner information for commentator ${commentator.id} ${commentator.name}`);
				return;
			}

			// Just add them as new commentator
			commentatorsRep.value.push(
				generateBasicCommentator(commentator.name, {
					tag: commentator.tag,
					twitch: commentator.twitch,
					microphone: commentator.microphone,
				}),
			);
			Log.warn(`Commentator had an ID but could not find the ID in the replicant. ${commentator.id}`);
		} else {
			// Edit existing commentator
			const existingCommentator = commentatorsRep.value[commentatorIndex];

			if (!existingCommentator) {
				Log.error(
					`Could not find existing commentator to update despite having index. ${commentator.id} ${commentator.name}`,
				);
				return;
			}

			Log.info(JSON.stringify(existingCommentator));

			commentatorsRep.value[commentatorIndex] = {
				...existingCommentator,
				name: commentator.name,
				pronouns: commentator.pronouns,
				social: {
					...existingCommentator.social,
					twitch: commentator.twitch ?? existingCommentator.social.twitch,
				},
				customData: {
					...existingCommentator.customData,
					tag: commentator.tag ?? existingCommentator.customData["tag"] ?? "",
					microphone: commentator.microphone ?? existingCommentator.customData["microphone"] ?? "",
				},
			};
		}
	} else {
		// New commentator
		commentatorsRep.value.push({
			...generateBasicCommentator(commentator.name, {
				tag: commentator.tag,
				twitch: commentator.twitch,
				microphone: commentator.microphone,
			}),
			id: crypto.randomUUID(),
		});
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

function updateRunnerInformation(runner: {
	id: string;
	name: string;
	pronouns?: string;
	twitch?: string;
	microphone?: string;
}): boolean {
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
			microphone: runner.microphone ?? "",
		},
		name: runner.name,
		pronouns: runner.pronouns,
		social: {
			...originalRunner.social,
			twitch: runner.twitch,
		},
	};

	return true;
}

// Clear on new run
nodecg.listenFor("transition:toIntermission", () => {
	if (!automationSettingsRep.value.clearCommentators) return;

	const mutableCommentators = [...commentatorsRep.value];

	commentatorsRep.value = mutableCommentators.filter((commentator) => commentator.customData["tag"] === HOST_TAG);
});

nodecg.listenFor("commentators:reorder", (newOrder: string[]) => {
	Log.info("Reordering commentators");

	const currentCommentators = [...commentatorsRep.value];
	const reorderedCommentators: RunDataPlayer[] = [];

	newOrder.forEach((id) => {
		const foundCommentator = currentCommentators.find((comm) => comm.id === id);
		if (foundCommentator) {
			reorderedCommentators.push(foundCommentator);
		} else {
			Log.warn(`Could not find commentator with ID ${id} during reorder`);
		}
	});

	commentatorsRep.value = reorderedCommentators;
});

nodecg.listenFor("commentators:runnerToCommentator", (data) => {
	Log.info(`Moving runner ${data.runnerId} to commentator at index ${data.positionIndex}`);

	const runDataActive = SPEEDCONTROL_runDataActiveRep.value;
	if (!runDataActive) {
		Log.error("No active run found in Speedcontrol");
		return;
	}

	let foundRunner: RunDataPlayer | undefined = undefined;
	for (const team of runDataActive.teams) {
		const playerIndex = team.players.findIndex((player) => player.id === data.runnerId);
		if (playerIndex !== -1) {
			foundRunner = team.players[playerIndex];
			team.players.splice(playerIndex, 1);
			break;
		}
	}

	if (!foundRunner) {
		Log.error(`Could not find runner with ID ${data.runnerId} to move to commentator`);
		return;
	}

	// Add to commentators Replicant at specified index
	const mutableCommentators = [...commentatorsRep.value];
	mutableCommentators.splice(data.positionIndex, 0, foundRunner);
	commentatorsRep.value = mutableCommentators;

	Log.info(`Moved runner ${foundRunner.name} (${foundRunner.id}) to commentators at index ${data.positionIndex}`);
});
