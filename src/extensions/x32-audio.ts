import * as nodecgApiContext from "./nodecg-api-context";
import X32 from "./util/x32";

import type { CouchPerson } from "@asm-graphics/types/OverlayProps";
import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import type NodeCG from "@nodecg/types";

const nodecg = nodecgApiContext.get();

const x32StatusRep = nodecg.Replicant(
	"x32:status",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<ConnectionStatus>;
const audioIndicatorsRep = nodecg.Replicant(
	"audio-indicators",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<AudioIndicator>;
const audioGateRep = nodecg.Replicant("audio-gate") as unknown as NodeCG.ServerReplicantWithSchemaDefault<number>;
const runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;
const graphicAudioIndicatorRep = nodecg.Replicant(
	"audio-indicator",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<string>;
const x32BusFadersRep = nodecg.Replicant("x32:busFaders", {
	defaultValue: [],
}) as unknown as NodeCG.ServerReplicantWithSchemaDefault<number[][]>;

const SPECIAL_AUDIO = nodecg.Replicant<boolean>("SPECIAL_AUDIO");

// X32 Scenes
// Gameplay
//	- Host and other mics on (dependant on the names)
// Intermission
// Speech

const x32 = new X32();

const HOST_MIC_CHANNEL = 5;
const GAME_CHANNELS = [9, 11, 13, 15]; // Channels are paired as stereo pairs so we only need to mute just one side
const SPECIAL_MIC_CHANNEL = 6;
const MICROPHONE_CHANNELS = [
	{ name: "Mario Red", channel: 1 },
	{ name: "Sonic Blue", channel: 2 },
	{ name: "Pikachu Yellow", channel: 3 },
	{ name: "Link Green", channel: 4 },
	{ name: "Host", channel: HOST_MIC_CHANNEL },
] as const;

const faderValues: number[][] = [];

x32.on("status", (status) => {
	x32StatusRep.value = status;
});

x32.on("faders", (faders, bus) => {
	const prevMainBus = faderValues[bus]?.[0];
	faderValues[bus] = faders;
	faderValues[bus][0] = prevMainBus;
});

x32.on("mainFaders", (faders) => {
	faders.forEach((fader, i) => {
		if (typeof fader === "undefined") return;

		if (!faderValues[i]) faderValues[i] = [];
		faderValues[i][0] = fader;
	});
});

// Update x32BusFadersRep on an interval
setInterval(() => {
	x32BusFadersRep.value = faderValues;
}, 200);

x32.on("meters", (meters) => {
	MICROPHONE_CHANNELS.forEach((mic) => {
		updateAudioIndicator(meters[mic.channel], mic);
	});
});

function updateAudioIndicator(float: number, mic: (typeof MICROPHONE_CHANNELS)[number]) {
	const active = X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75) >= audioGateRep.value;
	// console.log(`${mic.name}: ${float} ${audioGateRep.value} ${X32.floatToDB(float) + X32.floatToDB((faderValues[0]?.[mic.channel] ?? 0.75))} ${active}`);
	// console.log(typeof audioIndicatorsRep.value, audioIndicatorsRep.value)
	audioIndicatorsRep.value[mic.name] = active;
}

// On transition to game view
nodecg.listenFor("transition:toGame", (data: { to: string; from: string }) => {
	// Unmute mics for speakers and stream
	const micIndexes = getMicrophoneIndexesOfPeopleTalking();

	if (SPECIAL_AUDIO.value) {
		setTimeout(() => {
			loopAllX32(
				(channel, mixBus) => {
					// Only set mics that have someone using them to be unmuted
					if (micIndexes.includes(channel) || channel === GAME_CHANNELS[0]) {
						fadeUnmute(channel, mixBus);
					} else {
						fadeMute(channel, mixBus);
					}
				},
				32,
				1,
			);
		}, 35000);
	} else {
		loopAllX32(
			(channel, mixBus) => {
				// Only set mics that have someone using them to be unmuted
				if (micIndexes.includes(channel) || channel === GAME_CHANNELS[0]) {
					fadeUnmute(channel, mixBus);
				} else {
					fadeMute(channel, mixBus);
				}
			},
			32,
			1,
		);
	}

	graphicAudioIndicatorRep.value = runDataActiveRep.value?.teams[0].players[0].id ?? "";
});

// On transition to intermission
nodecg.listenFor("transition:toIntermission", () => {
	// Mute all inputs but host mic on main LR
	loopAllX32(
		(channel, mixBus) => {
			// Don't even attempt to mute the channels since sometimes it gets lost
			if (channel === HOST_MIC_CHANNEL && mixBus <= 1) {
				fadeUnmute(channel, mixBus);
			} else {
				fadeMute(channel, mixBus);
			}
		},
		32,
		1,
	);

	// Reset audio levels on runner audio
	loopAllX32(
		(channel, mixBus) => {
			if (mixBus <= 1) return;
			x32.setFaderLevel(channel, mixBus, 0.75);
		},
		32,
		5
	);
});

// On transition to IRL scene
nodecg.listenFor("transition:toIRL", () => {
	// Mute all other mics and game audio
	loopAllX32((channel, mixBus) => {
		// Don't even attempt to mute the channels since sometimes it gets lost
		if (channel === SPECIAL_MIC_CHANNEL && mixBus <= 1) {
			x32.unmuteChannel(channel, mixBus);
		} else {
			x32.muteChannel(channel, mixBus);
		}
	});
});

function loopAllX32(callback: (channel: number, mixBus: number) => void, max1 = 32, max2 = 16) {
	let channel = 1;
	let mixBus = 0;

	while (channel <= max1) {
		const value = [channel, mixBus] as const;
		callback(...value);

		if (++mixBus > max2) {
			channel++;
			mixBus = 0;
		}
	}
}

function getMicrophoneIndexesOfPeopleTalking() {
	const indexes: number[] = [HOST_MIC_CHANNEL];

	const currentRun = nodecg.readReplicant("runDataActiveRun", "nodecg-speedcontrol") as RunDataActiveRun | undefined;
	const commentatorsRep = nodecg.readReplicant("couch-names") as CouchPerson[];

	currentRun?.teams.forEach((team) => {
		team.players.forEach((player) => {
			indexes.push(findMicrophoneChannel(player.customData.microphone));
		});
	});

	commentatorsRep.forEach((commentator) => {
		indexes.push(findMicrophoneChannel(commentator.microphone));
	});

	return indexes;
}

function findMicrophoneChannel(name?: string) {
	return MICROPHONE_CHANNELS.find((mic) => mic.name === name)?.channel ?? -1;
}

// This will look to see if a channel is either unmuted or set to something above -∞
function fadeUnmute(channel: number, mixBus: number) {
	// console.log(JSON.stringify(mutedChannels), JSON.stringify(faderValues))
	if (faderValues[0]?.[channel] === 0) {
		nodecg.log.debug(
			`[X32 Audio] UNMUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | ${faderValues[channel]} ${faderValues[0]?.[channel] === 0 ? "| ACTIONING" : ""
			}`,
		);
		// Unmute
		x32.fade(channel, mixBus, 0, 0.6, 1500);
	}
}

// This will look to see if a channel is either muted or set to -∞ already
function fadeMute(channel: number, mixBus: number) {
	if (faderValues[0]?.[channel] > 0) {
		nodecg.log.debug(
			`[X32 Audio] MUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | ${faderValues[channel]} ${faderValues[0]?.[channel] > 0 ? "| ACTIONING" : ""
			}`,
		);
		// Mute
		x32.fade(channel, mixBus, faderValues[0]?.[channel], 0, 1500);
	}
}

nodecg.listenFor("x32:setFader", (data: { mixBus: number; float: number; channel: number }) => {
	x32.setFaderLevel(data.channel, data.mixBus, data.float);
});

runDataActiveRep.on("change", (newVal, oldVal) => {
	if (newVal?.id !== oldVal?.id) {
		// Must be a new run

		let headsetIndex = 0;
		newVal?.teams.forEach((team) => {
			team.players.forEach((player) => {
				if (headsetIndex >= MICROPHONE_CHANNELS.length) return;
				player.customData.microphone = MICROPHONE_CHANNELS[headsetIndex].name;
				headsetIndex++;
			});
		});
	}
});

// Indexed to game number
nodecg.listenFor("x32:changeGameAudio", (playerID: string) => {
	// Find playerID game index
	const teamIndex =
		runDataActiveRep.value?.teams.findIndex((team) => team.players.some((player) => player.id === playerID)) ?? -1;
	const playerIndex =
		runDataActiveRep.value?.teams[teamIndex].players.findIndex((player) => player.id === playerID) ?? -1;
	const gameChannelIndex = GAME_CHANNELS[teamIndex + playerIndex]; // THIS WILL BREAK IF ON COOP AND USING THE SAME CONSOLE

	if (teamIndex + playerIndex < 0) {
		nodecg.log.error(
			`[X32 Audio] Tried changing game audio to player: ${playerID}. But could not find the player.`,
		);
		return;
	}

	// Get current active game audio
	// Highest is considered active
	let highestFaderVal = Number.NEGATIVE_INFINITY;
	let activeIndex = -1;
	for (let i = GAME_CHANNELS[0]; i < (GAME_CHANNELS.at(-1) ?? GAME_CHANNELS[0]); i++) {
		const value = faderValues[0]?.[i];
		if (value > highestFaderVal) {
			highestFaderVal = value;
			activeIndex = i;
		}
	}

	const highestSpeakerFaderVal = faderValues[1][activeIndex];

	nodecg.log.debug(
		`[X32 Audio] Changing audio from ${activeIndex}/${X32.channelIndex[activeIndex]} to ${gameChannelIndex}/${X32.channelIndex[gameChannelIndex]}`,
	);

	x32.fade(activeIndex, 0, highestFaderVal, 0, 1500);
	x32.fade(activeIndex, 1, highestSpeakerFaderVal, 0, 1500);

	// Wait for fade of previous game
	setTimeout(() => {
		// Assume that the audio level the previous game was at will also be ok
		x32.fade(gameChannelIndex, 0, 0, highestFaderVal, 1500);
		x32.fade(gameChannelIndex, 1, 0, highestSpeakerFaderVal, 1500);
		graphicAudioIndicatorRep.value = playerID;
	}, 1500);
});
