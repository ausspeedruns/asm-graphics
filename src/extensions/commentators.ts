import * as nodecgApiContext from "./nodecg-api-context";
import { v4 as uuid } from "uuid";
import _ from "underscore";

import { commentatorsRep, headsetsUsed, hostRep, showHostRep } from "./replicants";

import type { RunData, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "nodecg/types";
import { Commentator } from "@asm-graphics/types/OverlayProps";

const nodecg = nodecgApiContext.get();
const Log = new nodecg.Logger("Commentators");

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

nodecg.listenFor("update-host", (host) => {
	Log.info(`Updating host ${host.name}`);
	host.tag = "Host";
	hostRep.value = host;
});

nodecg.listenFor("update-commentator", (commentator) => {
	Log.info(`Updating commentator ${commentator.id} ${commentator.name}`);

	if (commentator.id) {
		if (commentator.isRunner) {
			updateRunnerInformation(commentator);
		} else {
			const commentatorIndex = commentatorsRep.value.findIndex(comm => comm.id === commentator.id);
			if (commentatorIndex === -1) {
				// Couldn't find commentator but has an id
				commentatorsRep.value.push(commentator);
				Log.warn(`Commentator had an ID but could not find the ID in the replicant. ${commentator.id}`);
			} else {
				// Edit existing commentator
				updateExistingCommentator(commentator, commentatorIndex);
			}
		}
	} else {
		// New commentator
		commentatorsRep.value.push(
			{ ...commentator, id: uuid() }
		);
	}
});

nodecg.listenFor("delete-commentator", id => {
	Log.info(`Deleting ${id}`);

	if (!commentatorsRep.value.find(commentator => commentator.id === id)) {
		Log.error(`Tried to delete commentator but could not find them in replicant. ${id}`);
		return;
	}

	commentatorsRep.value = commentatorsRep.value.filter(commentator => commentator.id !== id);
});

nodecg.listenFor("showHost", (showHost: boolean) => {
	Log.info(`Setting showHost to ${showHost}`);
	showHostRep.value = showHost;
});

function updateExistingCommentator(commentator: Commentator, index: number) {
	const commentatorsMutable = [...commentatorsRep.value];
	commentatorsMutable[index] = commentator;
	commentatorsRep.value = commentatorsMutable;
}

function updateRunnerInformation(runner: Commentator) {
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
		return;
	}

	if (!SPEEDCONTROL_runDataActiveRep.value?.teams[teamIndex].players[playerIndex]) {
		Log.error(`Found runner and team index but runner was undefined. Runner: ${runner.id} ${runner.name} | Team Index: ${teamIndex} | Player Index: ${playerIndex}`);
		return;
	}

	const originalRunner = _.clone(SPEEDCONTROL_runDataActiveRep.value.teams[teamIndex].players[playerIndex]);

	SPEEDCONTROL_runDataActiveRep.value.teams[teamIndex].players[playerIndex] = {
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
		}
	};
}

// Clear on new run
SPEEDCONTROL_runDataActiveRep.on("change", (newVal, oldVal) => {
	if (!oldVal) return;
	if (newVal?.id === oldVal.id) return;

	UpdateHeadsetUsage(oldVal);

	commentatorsRep.value = [];
});

function UpdateHeadsetUsage(runData: RunData) {
	const allCommentators: Commentator[] = [
		...(runData?.teams ?? []).flatMap((team) =>
			team.players.map((player) => {
				return {
					id: player.id,
					name: player.name,
					pronouns: player.pronouns,
					twitch: player.social.twitch,
					teamId: player.teamID,
					isRunner: true,
					microphone: player.customData.microphone,
				};
			}),
		),
		...commentatorsRep.value,
	];

	allCommentators.forEach(commentator => {
		if (!commentator.microphone) return;

		if (commentator.microphone in headsetsUsed.value) {
			headsetsUsed.value[commentator.microphone] = headsetsUsed.value[commentator.microphone] + 1;
		} else {
			headsetsUsed.value[commentator.microphone] = 0;
		}
	});
}
