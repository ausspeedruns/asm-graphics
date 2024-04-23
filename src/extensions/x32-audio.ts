import * as nodecgApiContext from "./nodecg-api-context";
import X32 from "./util/x32";

import { x32StatusRep, x32BusFadersRep, x32AudioActivityRep, microphoneGateRep, gameAudioActiveRep } from "./replicants";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "@nodecg/types";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import _ from "underscore";

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

// X32 Scenes
// Gameplay
//	- Host and other mics on (dependant on the names)
// Intermission
// Speech

const x32 = new X32();

const HOST_MIC_CHANNEL = 5;
const GAME_CHANNELS = [9, 11, 13, 15]; // Channels are paired as stereo pairs so we only need to mute just one side
const SPECIAL_MIC_CHANNEL = 6;
const OBS_MONITOR_CHANNEL = 7;
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
	if (!_.isEqual(x32BusFadersRep.value, faderValues)) {
		x32BusFadersRep.value = faderValues;
	}
}, 200);

x32.on("meters", (meters) => {
	MICROPHONE_CHANNELS.forEach((mic) => {
		updateAudioIndicator(meters[mic.channel], mic);
	});
});

function updateAudioIndicator(float: number, mic: (typeof MICROPHONE_CHANNELS)[number]) {
	// console.log(`${mic} ${X32.floatToDB(float)} ${X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75)} ${X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75) >= microphoneGate2Rep.value}`);
	const active = X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75) >= microphoneGateRep.value;
	x32AudioActivityRep.value[mic.name] = active;
}

// On transition to game view
nodecg.listenFor("transition:toGame", (_data) => {
	// Unmute mics for speakers and stream
	const micIndexes = getMicrophoneIndexesOfPeopleTalking();
	console.log("mic indexes", JSON.stringify(micIndexes));

	loopAllX32(
		(channel, mixBus) => {
			// Only set mics that have someone using them to be unmuted
			if (micIndexes.includes(channel) || channel === GAME_CHANNELS[0]) {
				fadeUnmute(channel, mixBus);
			} else if (channel === OBS_MONITOR_CHANNEL) {
				fadeMute(channel, mixBus, true);
			} else {
				fadeMute(channel, mixBus);
			}
		},
		32,
		1,
	);
});

// On transition to intermission
nodecg.listenFor("transition:toIntermission", () => {
	// Mute all inputs but host mic on main LR
	loopAllX32(
		(channel, mixBus) => {
			// Don't even attempt to mute the channels since sometimes it gets lost
			if ((channel === HOST_MIC_CHANNEL && mixBus <= 1) || (channel === OBS_MONITOR_CHANNEL && mixBus === 1)) {
				fadeUnmute(channel, mixBus);
			} else {
				fadeMute(channel, mixBus);
			}
		},
		32,
		1,
	);

	// Reset audio levels on runner audio
	// loopAllX32(
	// 	(channel, mixBus) => {
	// 		if (mixBus <= 1) return;
	// 		x32.setFaderLevel(channel, mixBus, 0.75);
	// 	},
	// 	32,
	// 	5
	// );
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

	const currentRun = nodecg.readReplicant<RunDataActiveRun | undefined>("runDataActiveRun", "nodecg-speedcontrol");
	const commentatorsRep = nodecg.readReplicant<Commentator[]>("commentators");

	currentRun?.teams.forEach((team) => {
		team.players.forEach((player) => {
			indexes.push(findMicrophoneChannel(player.customData.microphone));
		});
	});

	commentatorsRep?.forEach((commentator) => {
		indexes.push(findMicrophoneChannel(commentator.microphone));
	});

	return indexes;
}

function findMicrophoneChannel(name?: string) {
	const channel = MICROPHONE_CHANNELS.find((mic) => mic.name === name)?.channel ?? -1;
	console.log(`Given ${name}, found ${channel}`);
	return channel;
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
		x32.fade(channel, mixBus, 0, 0.7, 1500);
	}
}

// This will look to see if a channel is either muted or set to -∞ already
function fadeMute(channel: number, mixBus: number, force = false) {
	if (force || faderValues[0]?.[channel] > 0) {
		nodecg.log.debug(
			`[X32 Audio] MUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | ${faderValues[channel]} ${faderValues[0]?.[channel] > 0 ? "| ACTIONING" : ""
			}`,
		);
		// Mute
		x32.fade(channel, mixBus, faderValues[0]?.[channel], 0, 1500);
	}
}

nodecg.listenFor("x32:setFader", (data) => {
	x32.setFaderLevel(data.channel, data.mixBus, data.float);
});

SPEEDCONTROL_runDataActiveRep.on("change", (newVal, oldVal) => {
	if (!newVal || !oldVal) return;

	if (newVal.id !== oldVal.id) {
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
nodecg.listenFor("x32:changeGameAudio", (channelIndex) => {
	// Find playerID game index
	if (channelIndex < 0) {
		nodecg.log.error(
			`[X32 Audio] Tried changing game audio to Channel with the index of ${channelIndex} but that is out of range.`,
		);
		return;
	}

	const gameChannelIndex = GAME_CHANNELS[channelIndex];

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
		gameAudioActiveRep.value = channelIndex;
	}, 1500);
});
