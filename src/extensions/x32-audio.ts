import * as nodecgApiContext from "./nodecg-api-context";
import X32 from "./util/x32";

import {
	x32StatusRep,
	x32BusFadersRep,
	x32AudioActivityRep,
	microphoneGateRep,
	gameAudioActiveRep,
	hostLevelStreamRep,
	hostLevelSpeakersRep,
	automationSettingsRep,
} from "./replicants";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "nodecg/types";
import _ from "underscore";

import { GameInputChannels, HandheldMicChannel, Headsets, HostHeadset, OBSChannel } from "./audio-data";
import type { Commentator } from "@asm-graphics/types/OverlayProps";

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

const x32 = new X32();

const faderValues: number[][] = [];

// Update x32BusFadersRep on an interval
setInterval(() => {
	if (!_.isEqual(x32BusFadersRep.value, faderValues)) {
		x32BusFadersRep.value = faderValues;
	}
}, 200);

function updateAudioIndicator(float: number, mic: (typeof Headsets)[number]) {
	const microphoneGateDB = X32.floatToDB(microphoneGateRep.value);
	// console.log(`${mic.name} ${X32.floatToDB(float)} + ${X32.floatToDB(faderValues[0]?.[mic.micInput] ?? 0.75)} (${X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.micInput] ?? 0.75)}) >= ${microphoneGateDB} = ${X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.micInput] ?? 0.75) >= microphoneGateDB}`);
	const active = X32.floatToDB(float) + X32.floatToDB(faderValues[0]?.[mic.micInput] ?? 0.75) >= microphoneGateDB;
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
function fadeUnmute(channel: number, mixBus: number, to = 0.7) {
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

function setHostMute(active: boolean) {
	const value = active ? hostLevelStreamRep.value : 0; // TODO: Test if this is really means the runners don't get a choice for audio levels

	x32.setFaderLevel(HostHeadset.micInput, 0, value);
	x32.setFaderLevel(HostHeadset.micInput, 1, active ? hostLevelSpeakersRep.value : 0);
	x32.setFaderLevel(HostHeadset.micInput, 3, value);
	x32.setFaderLevel(HostHeadset.micInput, 5, value);
	x32.setFaderLevel(HostHeadset.micInput, 7, value);
	x32.setFaderLevel(HostHeadset.micInput, 9, value);
	x32.setFaderLevel(HostHeadset.micInput, 13, value);
}

let previousHostCouchVolume: number[] = [];

function setHostCouchActive(active: boolean) {
	let volume: number[] = [];
	if (active) {
		volume = previousHostCouchVolume;
	} else {
		previousHostCouchVolume = faderValues[HostHeadset.mixBus];
		for (let i = 0; i < 16; i++) {
			volume[i] = 0;
		}
	}

	// Commentators
	x32.setFaderLevel(1, HostHeadset.mixBus, volume[1]);
	x32.setFaderLevel(2, HostHeadset.mixBus, volume[2]);
	x32.setFaderLevel(3, HostHeadset.mixBus, volume[3]);
	x32.setFaderLevel(4, HostHeadset.mixBus, volume[4]);

	// Game
	x32.setFaderLevel(9, HostHeadset.mixBus, volume[9]);
	x32.setFaderLevel(11, HostHeadset.mixBus, volume[11]);
	x32.setFaderLevel(13, HostHeadset.mixBus, volume[13]);
	x32.setFaderLevel(15, HostHeadset.mixBus, volume[15]);
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
				x32.setChannelName(Headsets[headsetIndex].micInput, player.name);
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

	setTimeout(() => {
		previewMixFaders.forEach((previewFader, channel) => {
			if (channel === HostHeadset.micInput) return;
			x32.fade(channel, 0, 0, previewFader, 2000); // Stream
			x32.fade(channel, 1, 0, previewFader, 2000); // Speakers
		});
	}, 1500);
});

// On transition to intermission
nodecg.listenFor("transition:toIntermission", () => {
	if (!automationSettingsRep.value.audioMixing) return;

	// Mute all inputs but host mic on main LR
	loopAllX32(
		(channel, mixBus) => {
			// Don't even attempt to mute the channels since sometimes it gets lost
			// TODO: Cleanup
			if (channel === HostHeadset.micInput && mixBus <= 1) return;

			if (channel === OBSChannel && mixBus === 1) {
				fadeUnmute(channel, mixBus, 0.6);
			} else {
				fadeMute(channel, mixBus);
			}
		},
		32,
		1,
	);

	// Reset names
	for (const mic of Headsets) {
		x32.setChannelName(mic.micInput, mic.name);
	}
});

// On transition to IRL scene
nodecg.listenFor("transition:toIRL", () => {
	if (!automationSettingsRep.value.audioMixing) return;

	// Mute all other mics and game audio
	loopAllX32((channel, mixBus) => {
		// Don't even attempt to mute the channels since sometimes it gets lost
		if (channel === HandheldMicChannel && mixBus <= 1) {
			fadeUnmute(channel, mixBus);
		} else {
			fadeMute(channel, mixBus);
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

nodecg.listenFor("x32:mute-host", () => {
	setHostMute(false);
});

nodecg.listenFor("x32:unmute-host", () => {
	setHostMute(true);
});

nodecg.listenFor("x32:host-mute-couch", () => {
	setHostCouchActive(false);
});

nodecg.listenFor("x32:host-unmute-couch", () => {
	setHostCouchActive(true);
});

nodecg.listenFor("update-commentator", (commentator) => {
	if (!commentator.microphone) return;

	// Convert Headset name to index
	const headsetIndex = Headsets.findIndex((headset) => headset.name === commentator.microphone);
	if (headsetIndex === -1) {
		nodecg.log.warn(
			`[X32 Audio] Could not find headset with name ${commentator.microphone} for commentator ${commentator.name}.`,
		);
		return;
	}

	x32.setChannelName(Headsets[headsetIndex].micInput, commentator.name);
});

const allRealHeadsets = Headsets.filter((headset) => headset.name !== "NONE");
const allRunnerOrCouchHeadsets = allRealHeadsets.filter((headset) => headset.name !== "Host" && headset.name !== "NONE");

let activeTalkbackChannels: number[] = [];

function getHeadsetsByTarget(targets: string[]): number[] {
	const mixbusTargets: number[] = [];

	// Targets is a list of string ids that represent either commentator ids or runner ids
	const currentRunData = SPEEDCONTROL_runDataActiveRep.value;
	const currentCommentators = nodecg.readReplicant<Commentator[]>("commentators");

	targets.forEach((target) => {
		// Check if we are a commentator
		if (currentCommentators) {
			const commentator = currentCommentators.find((c) => c.id === target);
			if (commentator?.microphone) {
				const headset = Headsets.find((h) => h.name === commentator.microphone);
				if (headset) {
					mixbusTargets.push(headset.mixBus);
					return;
				}
			}
		}

		// Check runner mixbuses
		if (currentRunData) {
			currentRunData.teams.forEach((team) => {
				team.players.forEach((player) => {
					if (player.id === target && player.customData?.microphone) {
						const headset = Headsets.find((h) => h.name === player.customData.microphone);
						if (headset) {
							mixbusTargets.push(headset.mixBus);
							return;
						}
					}
				});

				if (mixbusTargets.length > 0) return;
			});
		}
	});

	return mixbusTargets;
}

nodecg.listenFor("x32:talkback-start", (targets) => {
	if (!x32.connected) return;

	const mixbusTargets = getHeadsetsByTarget(targets);

	if (mixbusTargets.length === 0) {
		nodecg.sendMessage("x32:talkback-stop");
		activeTalkbackChannels = [];
		return;
	}

	// Build desired state map (mixBus -> enabled)
	const desired: Record<number, boolean> = {};

	// Start with current channels as false, then mark targets as true
	activeTalkbackChannels.forEach((mixBus) => (desired[mixBus] = false));
	mixbusTargets.forEach((mixBus) => (desired[mixBus] = true));

	// Apply all changes in a single loop
	Object.entries(desired).forEach(([mixBusStr, enabled]) => {
		const mixBus = Number(mixBusStr);

		const currentlyEnabled = activeTalkbackChannels.includes(mixBus);
		if (currentlyEnabled !== enabled) {
			x32.setTalkbackMixbus("B", mixBus, enabled);
		}
	});

	activeTalkbackChannels = mixbusTargets;

	// Activate talkback
	x32.enableTalkback("B", true);
});

nodecg.listenFor("x32:talkback-stop", () => {
	if (!x32.connected) return;

	// Deactivate talkback
	x32.enableTalkback("B", false);
});
