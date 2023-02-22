import { OBSAudioIndicator } from '@asm-graphics/types/Audio';
import { CouchPerson } from '@asm-graphics/types/OverlayProps';
import { RunDataActiveRun } from '@asm-graphics/types/RunData';
import * as nodecgApiContext from './nodecg-api-context';
import X32 from './util/x32';
import type { ConnectionStatus } from '@asm-graphics/types/Connections';

const nodecg = nodecgApiContext.get();

const x32StatusRep = nodecg.Replicant<ConnectionStatus>('x32:status');
const audioIndicatorRep = nodecg.Replicant<OBSAudioIndicator[]>('audio-indicators', { defaultValue: [], persistent: false });
const audioGateRep = nodecg.Replicant<number>('audio-gate', { defaultValue: -10 });
const runDataActiveRep = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');

// X32 Scenes
// Gameplay
//	- Host and other mics on (dependant on the names)
// Intermission
// Speech

const x32 = new X32();

let faderValues: number[] = [];
let mutedChannels: boolean[] = [];

x32.on('status', (status) => {
	x32StatusRep.value = status;
})

x32.on('faders', (faders) => {
	faderValues = faders;
});

x32.on('meters', (meters) => {
	meters.forEach((meter, ch) => {
		updateAudioIndicator(meter, ch);
	});
});

x32.on('mutes', mutes => {
	mutedChannels = mutes;
});

function updateAudioIndicator(float: number, channel: number) {
	if (!MICROPHONE_CHANNELS[channel]) return;

	const active = X32.floatToDB(float) + faderValues[channel] >= audioGateRep.value;

	const index = audioIndicatorRep.value.findIndex(audio => audio.id === MICROPHONE_CHANNELS[channel]?.name);
	if (index === -1) {
		audioIndicatorRep.value.push({ id: MICROPHONE_CHANNELS[channel].name, inputName: MICROPHONE_CHANNELS[channel].name, active: active })
	} else {
		audioIndicatorRep.value[index] = { ...audioIndicatorRep.value[index], active: active }
	}
}

const MICROPHONE_CHANNELS = [{ name: "Mario Red", channel: 1 }, { name: "Sonic Blue", channel: 2 }, { name: "Pikachu Yellow", channel: 3 }, { name: "Link Green", channel: 4 }] as const;
const GAME_CHANNELS = [9, 11, 13, 15]; // Channels are paired as stereo pairs so we only need to mute just one side
const HOST_MIC_CHANNEL = 5;
const SPECIAL_MIC_CHANNEL = 6;

// On transition to game view
nodecg.listenFor('transition:toGame', (data: {to: string, from: string}) => {
	// Unmute mics for speakers and stream
	const micIndexes = getMicrophoneIndexesOfPeopleTalking();

	const gameChannels = [GAME_CHANNELS[0]];

	if (data.to.indexOf("2p") > 0) {
		gameChannels.push(GAME_CHANNELS[1]);
	} else if (data.to.indexOf("3p") > 0) {
		gameChannels.push(GAME_CHANNELS[1], GAME_CHANNELS[2]);
	} else if (data.to.indexOf("4p") > 0) {
		gameChannels.push(GAME_CHANNELS[1], GAME_CHANNELS[2], GAME_CHANNELS[3]);
	}

	loopAllX32((channel, mixBus) => {
		// Only set mics that have someone using them to be unmuted
		if (micIndexes.includes(channel) || gameChannels.includes(channel)) {
			// x32.unmuteChannel(channel, mixBus);
			// x32.fade(channel, mixBus, 0, 0.8, 1500);
			fadeUnmute(channel, mixBus);
		} else {
			// x32.muteChannel(channel, mixBus);
			// x32.fade(channel, mixBus, 0.8, 0, 1500);
			fadeMute(channel, mixBus);
		}
	}, 32, 1);
});

// On transition to intermission
nodecg.listenFor('transition:toIntermission', () => {
	// Mute all inputs but host mic on main LR
	loopAllX32((channel, mixBus) => {
		// Don't even attempt to mute the channels since sometimes it gets lost
		if (channel === HOST_MIC_CHANNEL && mixBus <= 1) {
			// x32.unmuteChannel(channel, mixBus);
			// x32.fade(channel, mixBus, 0, 0.8);
			fadeUnmute(channel, mixBus);
		} else {
			// x32.muteChannel(channel, mixBus);
			// x32.fade(channel, mixBus, 0.8, 0, 1500);
			fadeMute(channel, mixBus);
		}
	}, 32, 1);
});

// On transition to IRL scene
nodecg.listenFor('transition:toIRL', () => {
	// Mute all other mics and game audio
	loopAllX32((channel, mixBus) => {
		// Don't even attempt to mute the channels since sometimes it gets lost
		if (channel === SPECIAL_MIC_CHANNEL && mixBus <= 1) {
			// x32.unmuteChannel(channel, mixBus);
			x32.unmuteChannel(channel, mixBus);
		} else {
			// x32.muteChannel(channel, mixBus);
			x32.muteChannel(channel, mixBus);
		}
	});
});

function loopAllX32(callback: (value1: number, value2: number) => void, max1 = 32, max2 = 16) {
	let current1 = 1;
	let current2 = 0;

	while (current1 <= max1) {
		let value = [current1, current2] as const;
		callback(...value);

		if (++current2 > max2) {
			current1++;
			current2 = 0;
		}
	}
}

function getMicrophoneIndexesOfPeopleTalking() {
	const indexes: number[] = [HOST_MIC_CHANNEL];

	const currentRun = nodecg.readReplicant('runDataActiveRun', 'nodecg-speedcontrol') as (RunDataActiveRun | undefined);
	const commentatorsRep = nodecg.readReplicant('couch-names') as CouchPerson[];

	currentRun?.teams.forEach(team => {
		team.players.forEach(player => {
			indexes.push(findMicrophoneChannel(player.customData.microphone));
		});
	});

	commentatorsRep.forEach(commentator => {
		indexes.push(findMicrophoneChannel(commentator.microphone))
	});

	return indexes;
}

function findMicrophoneChannel(name?: string) {
	return MICROPHONE_CHANNELS.find(mic => mic.name === name)?.channel ?? -1;
}

// This will look to see if a channel is either unmuted or set to something above -∞
function fadeUnmute(channel: number, mixBus: number) {
	// console.log(JSON.stringify(mutedChannels), JSON.stringify(faderValues))
	if (faderValues[channel] === 0) {
		console.log(`UNMUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | ${faderValues[channel]} ${faderValues[channel] === 0 ? "| ACTIONING" : ''}`);
		// Unmute
		x32.fade(channel, mixBus, 0, 0.75, 1500);
	}
}

// This will look to see if a channel is either muted or set to -∞ already 
function fadeMute(channel: number, mixBus: number) {
	if (faderValues[channel] > 0) {
		console.log(`MUTING ${X32.channelIndex[channel]} | ${X32.mixBusIndex[mixBus]} | ${faderValues[channel]} ${faderValues[channel] > 0 ? "| ACTIONING" : ''}`);
		// Mute
		x32.fade(channel, mixBus, faderValues[channel], 0, 1500);
	}
}

nodecg.listenFor('x32:setFader', (data: { mixBus: number, float: number, channel: number }) => {
	x32.setFaderLevel(data.channel, data.mixBus, data.float);
});

runDataActiveRep.on('change', (newVal, oldVal) => {
	if (newVal?.id !== oldVal?.id) {
		// Must be a new run

		let headsetIndex = 0;
		newVal?.teams.forEach(team => {
			team.players.forEach(player => {
				if (headsetIndex >= MICROPHONE_CHANNELS.length) return;
				player.customData.microphone = MICROPHONE_CHANNELS[headsetIndex].name;
				headsetIndex++;
			});
		})
	}
});
