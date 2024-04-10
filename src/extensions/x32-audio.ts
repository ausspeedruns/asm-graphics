import * as nodecgApiContext from "./nodecg-api-context";
import X32 from "./util/x32";

import { x32StatusRep, x32BusFadersRep, x32AudioActivityRep, microphoneGateRep, gameAudioActiveRep } from "./replicants";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "@nodecg/types";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import _ from "underscore";

import { GameInputChannels, HandheldMicChannel, Headsets, HostHeadset, OBSChannel } from "./audio-data";

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

const x32 = new X32();

let faderValues: number[][] = [];

// Update x32BusFadersRep on an interval
setInterval(() => {
	if (!_.isEqual(x32BusFadersRep.value, faderValues)) {
		x32BusFadersRep.value = faderValues;
	}
}, 200);

function updateAudioIndicator(float: number, mic: (typeof Headsets)[number]) {
	// console.log(`${mic} ${X32.floatToDB(float)} ${X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75)} ${X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.channel] ?? 0.75) >= microphoneGate2Rep.value}`);
	const active = X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.micInput] ?? 0.75) >= microphoneGateRep.value;
	x32AudioActivityRep.value[mic.name] = active;
}

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

//#region X32 Events

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

x32.on("meters", (meters) => {
	Headsets.forEach((mic) => {
		updateAudioIndicator(meters[mic.micInput], mic);
	});
});

//#region Replicant changes

SPEEDCONTROL_runDataActiveRep.on("change", (newVal, oldVal) => {
	if (!newVal || !oldVal) return;

	if (newVal.id !== oldVal.id) {
		// Must be a new run

		let headsetIndex = 0;
		newVal?.teams.forEach((team) => {
			team.players.forEach((player) => {
				if (headsetIndex >= Headsets.length) return;
				player.customData.microphone = Headsets[headsetIndex].name;
				headsetIndex++;
			});
		});
	}
});

//#region Listen For Messages

// On transition to game view
nodecg.listenFor("transition:toGame", (_data) => {
	// Lerp stream and speakers mix to previewMix values

	const previewMixFaders = faderValues[13];

	previewMixFaders.forEach((previewFader, channel) => {
		x32.fade(channel, 0, 0, previewFader, 2000); // Stream
		x32.fade(channel, 1, 0, previewFader, 2000); // Speakers
	});
});

// On transition to intermission
nodecg.listenFor("transition:toIntermission", () => {
	// Mute all inputs but host mic on main LR
	loopAllX32(
		(channel, mixBus) => {
			// Don't even attempt to mute the channels since sometimes it gets lost
			// TODO: Cleanup
			if (channel === HostHeadset.micInput && mixBus <= 1 || (channel === OBSChannel && mixBus === 1)) {
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
		if (channel === HandheldMicChannel && mixBus <= 1) {
			x32.unmuteChannel(channel, mixBus);
		} else {
			x32.muteChannel(channel, mixBus);
		}
	});
});

nodecg.listenFor("x32:setFader", (data) => {
	x32.setFaderLevel(data.channel, data.mixBus, data.float);
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

	const gameChannelIndex = GameInputChannels[channelIndex];

	// Get current active game audio
	// Highest is considered active
	let highestFaderVal = Number.NEGATIVE_INFINITY;
	let activeIndex = -1;
	for (let i = GameInputChannels[0]; i < (GameInputChannels.at(-1) ?? GameInputChannels[0]); i++) {
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
