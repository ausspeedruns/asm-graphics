import * as nodecgApiContext from "./nodecg-api-context.js";
import X32 from "./util/x32.js";

import { getReplicant } from "./replicants.js";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData.js";
import type NodeCG from "nodecg/types";
import _ from "underscore";

import {
	GameInputChannels,
	HandheldMicChannel,
	Headsets,
	HostHeadset,
	HostReferenceChannel,
	OBSChannel,
	OBSReferenceChannel,
} from "@asm-graphics/shared/audio-data.js";

const x32ConnectionDetailsRep = getReplicant("x32:connectionDetails");
const x32StatusRep = getReplicant("x32:status");
const x32BusFadersRep = getReplicant("x32:busFaders");
const x32AudioActivityRep = getReplicant("audio-indicators");
const microphoneGateRep = getReplicant("x32:audio-gate");
// const gameAudioActiveRep = getReplicant("game-audio-indicator"); TODO: Automate this
const automationSettingsRep = getReplicant("automations");

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.default.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

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
			`[X32 Audio] UNMUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | [${faderValues[channel]?.join(", ")}] ${
				faderValues[0]?.[channel] === 0 ? "| ACTIONING" : ""
			}`,
		);
		// Unmute
		x32.fade(channel, mixBus, 0, to, 1500);
	}
}

// This will look to see if a channel is either muted or set to -∞ already
function fadeMute(channel: number, mixBus: number, force = false) {
	const value = faderValues[0]?.[channel];

	if (value === undefined) {
		nodecg.log.warn(
			`[X32 Audio] Tried to mute channel ${channel} on mixBus ${mixBus} but fader value is undefined.`,
		);
		return;
	}

	if (force || value > 0) {
		nodecg.log.debug(
			`[X32 Audio] MUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | [${faderValues[channel]?.join(", ")}] ${
				value > 0 ? "| ACTIONING" : ""
			}`,
		);
		// Mute
		x32.fade(channel, mixBus, value, 0, 1500);
	}
}

const outputMixbuses = [0, 1, 3, 5, 7, 9, 11, 13];
function setHostMute(active: boolean) {
	for (const mixBus of outputMixbuses) {
		x32.setFaderLevel(
			HostHeadset.micInput,
			mixBus,
			active ? (faderValues[mixBus]?.[HostReferenceChannel] ?? 0.6) : 0,
		);
	}
}

let previousHostCouchVolume: number[] = [];

function setHostCouchActive(active: boolean) {
	let volume: number[] = [];
	if (active) {
		volume = previousHostCouchVolume;
	} else {
		const hostFader = faderValues[HostHeadset.mixBus];

		if (!hostFader) {
			nodecg.log.warn(
				`[X32 Audio] Tried to set host couch active state to ${active} but could not find fader values for mixBus ${HostHeadset.mixBus}.`,
			);
			return;
		}

		previousHostCouchVolume = hostFader;
		for (let i = 0; i < 16; i++) {
			volume[i] = 0;
		}
	}

	// Commentators
	x32.setFaderLevel(1, HostHeadset.mixBus, volume[1] ?? 0.7);
	x32.setFaderLevel(2, HostHeadset.mixBus, volume[2] ?? 0.7);
	x32.setFaderLevel(3, HostHeadset.mixBus, volume[3] ?? 0.7);
	x32.setFaderLevel(4, HostHeadset.mixBus, volume[4] ?? 0.7);

	// Game
	x32.setFaderLevel(9, HostHeadset.mixBus, volume[9] ?? 0.7);
	x32.setFaderLevel(11, HostHeadset.mixBus, volume[11] ?? 0.7);
	x32.setFaderLevel(13, HostHeadset.mixBus, volume[13] ?? 0.7);
	x32.setFaderLevel(15, HostHeadset.mixBus, volume[15] ?? 0.7);
}

//#region X32 Events

x32.on("status", (status, message) => {
	console.log(`[X32 Audio] Status changed: ${status} - ${message}`);
	x32StatusRep.value = {
		status,
		timestamp: Date.now(),
		message,
	};
});

x32.on("faders", (faders, bus) => {
	const prevMainBus = faderValues[bus]?.[0];
	faderValues[bus] = faders;

	if (typeof prevMainBus === "undefined") return;
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
		const meter = meters[mic.micInput];
		if (typeof meter === "undefined") return;

		updateAudioIndicator(meter, mic);
	});
});

//#region Replicant changes

SPEEDCONTROL_runDataActiveRep.on("change", (newVal, oldVal) => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	if (!newVal || !oldVal) return;

	if (newVal.id !== oldVal.id) {
		// Must be a new run

		let headsetIndex = 0;
		newVal?.teams.forEach((team) => {
			team.players.forEach((player) => {
				const headset = Headsets[headsetIndex];

				if (!headset) {
					nodecg.log.warn(
						`[X32 Audio] Not enough headsets for runners. Tried to assign headset index ${headsetIndex} to runner ${player.name}.`,
					);
					return;
				}

				player.customData["microphone"] = headset.name;
				x32.setChannelName(headset.micInput, player.name);
				headsetIndex++;
			});
		});
	}
});

//#region Listen For Messages

// On transition to game view
nodecg.listenFor("transition:toGame", (_data) => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	if (!automationSettingsRep.value.audioMixing) return;

	// Lerp stream and speakers mix to previewMix values
	const previewMixFaders = faderValues[13];

	// mute OBS (music) on speakers AND STREAM
	loopAllX32(
		(channel, mixBus) => {
			if (channel === OBSChannel && mixBus <= 1) {
				fadeMute(channel, mixBus);
			}
		},
		32,
		1,
	);

	setTimeout(() => {
		previewMixFaders?.forEach((previewFader, channel) => {
			if (channel === HostHeadset.micInput) return;
			x32.fade(channel, 0, 0, previewFader, 2000); // Stream
			x32.fade(channel, 1, 0, previewFader, 2000); // Speakers
		});
	}, 1500);
});

// On transition to intermission
nodecg.listenFor("transition:toIntermission", () => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	if (!automationSettingsRep.value.audioMixing) return;

	// Mute all inputs but host mic on main LR
	loopAllX32(
		(channel, mixBus) => {
			// Don't even attempt to mute the channels since sometimes it gets lost
			// TODO: Cleanup
			if (channel === HostHeadset.micInput && mixBus <= 1) return;

			// Unmute OBS (music) on speakers AND STREAM
			if (channel === OBSChannel && mixBus <= 1) {
				fadeUnmute(channel, mixBus, faderValues[mixBus]?.[OBSReferenceChannel] ?? 0.4);
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
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	if (!automationSettingsRep.value?.audioMixing) return;

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
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	x32.setFaderLevel(data.channel, data.mixBus, data.float);
});

// Indexed to game number
nodecg.listenFor("x32:changeGameAudio", (channelIndex) => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	// Find playerID game index
	if (channelIndex < 0) {
		nodecg.log.error(
			`[X32 Audio] Tried changing game audio to Channel with the index of ${channelIndex} but that is out of range.`,
		);
		return;
	}

	const gameChannelIndex = GameInputChannels[channelIndex];

	if (typeof gameChannelIndex === "undefined") {
		nodecg.log.error(
			`[X32 Audio] Tried changing game audio to Channel with the index of ${channelIndex} but that is out of range.`,
		);
		return;
	}

	// Get current active game audio
	// Highest is considered active
	let highestFaderVal = Number.NEGATIVE_INFINITY;
	let activeIndex = -1;
	for (let i = GameInputChannels[0]; i < (GameInputChannels.at(-1) ?? GameInputChannels[0]); i++) {
		const value = faderValues[0]?.[i];
		if ((value ?? Number.NEGATIVE_INFINITY) > highestFaderVal) {
			highestFaderVal = value ?? 0;
			activeIndex = i;
		}
	}

	const highestSpeakerFaderVal = faderValues[1]?.[activeIndex] ?? 0;

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
		// gameAudioActiveRep.value = channelIndex;
	}, 1500);
});

nodecg.listenFor("x32:mute-host", () => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}
	setHostMute(false);
});

nodecg.listenFor("x32:unmute-host", () => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}
	setHostMute(true);
});

nodecg.listenFor("x32:host-mute-couch", () => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}
	setHostCouchActive(false);
});

nodecg.listenFor("x32:host-unmute-couch", () => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}
	setHostCouchActive(true);
});

nodecg.listenFor("update-commentator", (commentator) => {
	if (x32StatusRep.value.status === "disconnected") {
		nodecg.log.warn("[X32 Audio] Tried to transition to game audio but X32 is not connected.");
		return;
	}

	if (!commentator.microphone) return;

	// Convert Headset name to index
	const headsetIndex = Headsets.findIndex((headset) => headset.name === commentator.microphone);
	if (headsetIndex === -1) {
		nodecg.log.warn(
			`[X32 Audio] Could not find headset with name ${commentator.microphone} for commentator ${commentator.name}.`,
		);
		return;
	}

	const micInput = Headsets[headsetIndex]?.micInput;

	if (!micInput) {
		nodecg.log.warn(
			`[X32 Audio] Headset with name ${commentator.microphone} for commentator ${commentator.name} does not have a valid mic input.`,
		);
		return;
	}

	x32.setChannelName(micInput, commentator.name);
});

const allRealHeadsets = Headsets.filter((headset) => headset.name !== "NONE");
const allRunnerOrCouchHeadsets = allRealHeadsets.filter(
	(headset) => headset.name !== "Host" && headset.name !== "NONE",
);

let activeTalkbackChannels: number[] = [];

function getHeadsetsByTarget(targets: string[]): number[] {
	const mixbusTargets: number[] = [];

	// Targets is a list of string ids that represent either commentator ids or runner ids
	const currentRunData = SPEEDCONTROL_runDataActiveRep.value;
	const currentCommentators = nodecg.readReplicant<RunDataPlayer[]>("commentators");

	targets.forEach((target) => {
		// Check if we are a commentator
		if (currentCommentators) {
			const commentator = currentCommentators.find((c) => c.id === target);
			if (commentator?.customData["microphone"]) {
				const headset = Headsets.find((h) => h.name === commentator.customData["microphone"]);
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
					if (player.id === target && player.customData["microphone"]) {
						const headset = Headsets.find((h) => h.name === player.customData["microphone"]);
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

nodecg.listenFor("x32:setConnected", (connected) => {
	if (connected) {
		x32.connect(x32ConnectionDetailsRep.value.ip);
	} else {
		x32.disconnect();
	}
});

if (nodecg.bundleConfig.x32?.autoConnect) {
	x32.connect(x32ConnectionDetailsRep.value.ip);
}
