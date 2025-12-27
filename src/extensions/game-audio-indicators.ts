import type { RunData, RunDataActiveRun } from "@asm-graphics/types/RunData.js";
import * as nodecgApiContext from "./nodecg-api-context.js";

import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("Audio");

const gameAudioActiveRep = getReplicant("game-audio-indicator");
const gameAudioNamesRep = getReplicant("game-audio-names");
const x32StatusRep = getReplicant("x32:status");

const runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

nodecg.listenFor("changeGameAudio", (data) => {
	log.info(`Updating Game Audio ${data.manual ? "manually" : "automatically"} to index ${data.index}.`);

	if (data.manual) {
		log.trace(`Manually setting gameAudioActiveRep to ${data.index}`);
		gameAudioActiveRep.value = data.index;
		return;
	}

	if (x32StatusRep.value == "connected") {
		nodecg.sendMessage("x32:changeGameAudio", data.index);
	}
});

nodecg.listenFor("changeGameAudioName", (data) => {
	log.info(
		`Updating Game Audio Name from "${gameAudioNamesRep.value[data.index]}" to ${data.name}. (Index: ${data.index})`,
	);
	gameAudioNamesRep.value[data.index] = data.name;
});

const GAME_AUDIO_CHANNELS = [
	{
		name: "Game 1",
		channels: [9, 10],
	},
	{
		name: "Game 2",
		channels: [11, 12],
	},
	{
		name: "Game 3",
		channels: [13, 14],
	},
	{
		name: "Game 4",
		channels: [15, 16],
	},
] as const;

interface ZippedRunnerAudio {
	audioInfo: (typeof GAME_AUDIO_CHANNELS)[number];
	runner?: {
		id: string;
		name: string;
	};
}

function getRunnersAndGameAudio(teams?: RunData["teams"]): ZippedRunnerAudio[] {
	const data: ZippedRunnerAudio[] = [];

	if (!teams || teams.length == 0) {
		return data;
	}

	// Multiple teams gets same console
	if (teams.length > 1) {
		for (let i = 0; i < GAME_AUDIO_CHANNELS.length; i++) {
			const gameAudio = GAME_AUDIO_CHANNELS[i];

			if (!gameAudio) {
				continue; // huh
			}
			
			const runnerAudio: ZippedRunnerAudio = {
				audioInfo: gameAudio,
			};

			if (i < teams.length) {
				const team = teams[i];

				if (!team) {
					continue; // huh
				}

				runnerAudio.runner = {
					name: team.players.map((player) => player.name).join(", "),
					id: team.id,
				};
			}

			data.push(runnerAudio);
		}

		return data;
	}

	/** Single team co-op gets different game audio channels in the event of different consoles */
	const team = teams[0];

	if (!team) {
		return data; // huh
	}

	// Somehow have a team with no players
	if (team.players.length == 0) {
		return [
			{
				audioInfo: GAME_AUDIO_CHANNELS[0],
				runner: {
					name: team.name ?? team.id,
					id: team.id,
				},
			},
		];
	}

	// Co-op 2+ players
	if (team.players.length > 1) {
		for (let i = 0; i < GAME_AUDIO_CHANNELS.length; i++) {
			const gameAudio = GAME_AUDIO_CHANNELS[i];

			if (!gameAudio) {
				continue; // huh
			}
			
			const runnerAudio: ZippedRunnerAudio = {
				audioInfo: gameAudio,
			};

			if (i < team.players.length) {
				const player = team.players[i];

				if (!player) {
					continue; // huh
				}

				runnerAudio.runner = { name: player.name, id: player.id };
			}

			data.push(runnerAudio);
		}

		return data;
	}

	// 1 Player
	const player = team.players[0];

	if (!player) {
		return data; // huh
	}

	return [
		{
			audioInfo: GAME_AUDIO_CHANNELS[0],
			runner: { name: player.name, id: player.id },
		},
		{
			audioInfo: GAME_AUDIO_CHANNELS[1],
		},
		{
			audioInfo: GAME_AUDIO_CHANNELS[2],
		},
		{
			audioInfo: GAME_AUDIO_CHANNELS[3],
		},
	];
}

runDataActiveRunRep.on("change", (newVal, oldVal) => {
	if (newVal?.id === oldVal?.id) {
		return;
	}

	if (!newVal) {
		// Just wipe the names
		gameAudioNamesRep.value = [];
		return;
	}

	const runnerNamesAndGameAudio = getRunnersAndGameAudio(newVal.teams);

	gameAudioNamesRep.value = runnerNamesAndGameAudio.map((gameAudio) => gameAudio.runner?.name ?? "");
});
