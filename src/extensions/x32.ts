// @ts-ignore
import osc from 'osc';
import fs from 'fs'

import * as nodecgApiContext from './nodecg-api-context';
import { X32Status } from '@asm-graphics/types/X32';
import { OBSAudioIndicator } from '@asm-graphics/types/Audio';

type MixerGameAudioChannels = [
	RunnerAudioObject,
	RunnerAudioObject,
	RunnerAudioObject,
	RunnerAudioObject
]

type RunnerAudioObject = {
	sd: ChannelObject
	hd: ChannelObject
}

type ChannelObject = {
	muted: boolean
	fadedBelowThreshold: boolean
}

type MixerConfig = {
	/**
	 * The IP address or hostname of a Behringer X32 digital mixer.
	 */
	address: string;
	gameAudioChannels: {
		sd?: number | null;
		hd?: number | null;
		[k: string]: any;
	}[];
	[k: string]: any;
};

const nodecg = nodecgApiContext.get();
const X32_UDP_PORT = 10023;
const FADE_THRESHOLD = 0.1;

const defaultMixer: RunnerAudioObject = { hd: { fadedBelowThreshold: false, muted: false }, sd: { fadedBelowThreshold: false, muted: false } }

const gameAudioChannelsRep = nodecg.Replicant<MixerGameAudioChannels>('mixer:gameAudioChannels', { persistent: false, defaultValue: [defaultMixer, defaultMixer, defaultMixer, defaultMixer] });
const x32StatusRep = nodecg.Replicant<X32Status>('x32:status');
const audioIndicatorRep = nodecg.Replicant<OBSAudioIndicator[]>('audio-indicators', { defaultValue: [], persistent: false });
const audioGateRep = nodecg.Replicant<number>('audio-gate', { defaultValue: -10 });

let heartbeatTimeout: string | number | NodeJS.Timeout | undefined;
let heartbeatAttempts = 0;
const MAX_HEARTBEAT_ATTEMPTS = 10;
const HEARTBEAT_INTERVAL = 1000;
const HEARTBEAT_TIMEOUT = HEARTBEAT_INTERVAL * 6;

const channelToReplicantMap: { [key: number]: ChannelObject } = {};
const mixerConfig: MixerConfig = {
	address: nodecg.bundleConfig.x32?.ip,
	gameAudioChannels: [{ hd: 1 }]
};
mixerConfig.gameAudioChannels.forEach((item, index) => {
	if (!gameAudioChannelsRep.value[index]) return;

	if (typeof item.sd === 'number') {
		channelToReplicantMap[item.sd] = gameAudioChannelsRep.value[index].sd;
	}

	if (typeof item.hd === 'number') {
		channelToReplicantMap[item.hd] = gameAudioChannelsRep.value[index].hd;
	}
});

gameAudioChannelsRep.on('change', val => {
	console.log(JSON.stringify(val))
});

const oscSocket = new osc.UDPPort({
	localAddress: '0.0.0.0',
	localPort: 11918, // Random port number (ASR 1 19 18)
	remoteAddress: mixerConfig.address,
	remotePort: X32_UDP_PORT,
	metadata: true
});

const faderValues: number[] = [];

oscSocket.on('raw', (buf: Buffer) => {
	const str = buf.toString('ascii');
	let channelNumber = 0;
	let valueBytes;
	let replicantObject;

	// console.log(str);

	if (str.startsWith('/info')) {
		// Heartbeat
		x32StatusRep.value = 'connected';
		clearTimeout(heartbeatTimeout);
		heartbeatAttempts = 0;
		heartbeatTimeout = setTimeout(handleMissedHeartbeat, HEARTBEAT_TIMEOUT);
	} else if (str.startsWith('/chMutes')) {
		// MUTES
		// For this particular message, we know that the values start at byte 22 and stop 2 bytes from the end.
		valueBytes = buf.subarray(22, -2);

		for (let i = 0; i < valueBytes.length; i += 4) {
			const muted = !valueBytes.readFloatBE(i);
			channelNumber++;
		}
	} else if (str.startsWith('/chFaders')) {

		// For this particular message, we know that the values start at byte 24
		valueBytes = buf.subarray(24);

		for (let i = 0; i < valueBytes.length; i += 4) {
			faderValues[channelNumber] = floatToDB(valueBytes.readFloatLE(i));

			channelNumber++;
		}
	} else if (str.startsWith('/chMeters')) {
		// Detect input volumes
		valueBytes = buf.subarray(24, -64);
		for (let i = 0; i < valueBytes.length; i += 4) {
			if (MICROPHONE_CHANNELS[channelNumber]) {
				updateAudioIndicator(valueBytes.readFloatLE(i), channelNumber)
			}

			// console.log(`${channelNumber} ${channelIndex[channelNumber]} ${valueBytes.readFloatLE(i)}`);

			channelNumber++;
		}
	}
	else {
		nodecg.log.info(`[X32] Unknown command: ${str}`);
	}
});

function updateAudioIndicator(float: number, channel: number) {
	const active = floatToDB(float) + faderValues[channel] >= audioGateRep.value;

	// if (active) {
	// 	console.log(`${MICROPHONE_CHANNELS[channel].name} is active!`)
	// }

	const index = audioIndicatorRep.value.findIndex(audio => audio.id === MICROPHONE_CHANNELS[channel]?.name);
	if (index === -1) {
		audioIndicatorRep.value.push({ id: MICROPHONE_CHANNELS[channel].name, inputName: MICROPHONE_CHANNELS[channel].name, active: active })
	} else {
		audioIndicatorRep.value[index] = { ...audioIndicatorRep.value[index], active: active }
	}
}

let logged = false;

oscSocket.on('error', (error: any) => {
	nodecg.log.warn('[osc] Error:', error.stack);
});

oscSocket.on('open', () => {
	nodecg.log.info('[osc] Port open, can now communicate with a Behringer X32.');
});

oscSocket.on('close', () => {
	nodecg.log.warn('[osc] Port closed.');
});

// Index of the object represents the input channel
const MICROPHONE_CHANNELS = [{ name: "Mario Red" }, { name: "Sonic Blue" }, { name: "Pikachu Yellow" }, { name: "Link Green" },]; // 0 Indexed
// Open the socket.
oscSocket.open();

renewSubscriptions();
const intervalSubscriptions = setInterval(renewSubscriptions, 10000);
const intervalHeartbeat = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);


/**
 * Renews subscriptions with the X32 (they expire every 10s).
 */
function renewSubscriptions() {
	oscSocket.send({
		address: '/batchsubscribe',
		args: [
			{ type: 's', value: '/chMutes' },
			{ type: 's', value: '/mix/on' },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 63 },
			{ type: 'i', value: 10 }
		]
	});

	oscSocket.send({
		address: '/batchsubscribe',
		args: [
			{ type: 's', value: '/chFaders' },
			{ type: 's', value: '/mix/fader' },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 63 },
			{ type: 'i', value: 10 }
		]
	});

	// oscSocket.send({
	// 	address: '/meters',
	// 	args: [
	// 		{ type: 's', value: '/meters/6' },
	// 		{ type: 'i', value: 0 },
	// 	]
	// });

	// Like there can only be one return per /meters/6
	// Might have to use an input meter and multiply it based on the fader position

	// MICROPHONE_CHANNELS.forEach(channel => {

	// oscSocket.send({
	// 	address: '/batchsubscribe',
	// 	args: [
	// 		{ type: 's', value: `/chPostFade${channel}` },
	// 		{ type: 's', value: '/meters/6' },
	// 		{ type: 'i', value: channel },
	// 		{ type: 'i', value: 0 },
	// 		{ type: 'i', value: 10 }
	// 	]
	// });

	// });

	oscSocket.send({
		address: '/batchsubscribe',
		args: [
			{ type: 's', value: `/chMeters` },
			{ type: 's', value: '/meters/13' },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 10 }
		]
	});
}

function sendHeartbeat() {
	oscSocket.send({
		address: '/info',
		args: [],
	});
}

function handleMissedHeartbeat() {
	x32StatusRep.value = "warning";
	heartbeatAttempts++;

	if (heartbeatAttempts > MAX_HEARTBEAT_ATTEMPTS) {
		clearInterval(intervalHeartbeat);
		clearInterval(intervalSubscriptions);
		x32StatusRep.value = "disconnected";
	} else {
		heartbeatTimeout = setTimeout(handleMissedHeartbeat, HEARTBEAT_TIMEOUT);
	}
}

const channelIndex = [
	'Ch 01',
	'Ch 02',
	'Ch 03',
	'Ch 04',
	'Ch 05',
	'Ch 06',
	'Ch 07',
	'Ch 08',
	'Ch 09',
	'Ch 10',
	'Ch 11',
	'Ch 12',
	'Ch 13',
	'Ch 14',
	'Ch 15',
	'Ch 16',
	'Ch 17',
	'Ch 18',
	'Ch 19',
	'Ch 20',
	'Ch 21',
	'Ch 22',
	'Ch 23',
	'Ch 24',
	'Ch 25',
	'Ch 26',
	'Ch 27',
	'Ch 28',
	'Ch 29',
	'Ch 30',
	'Ch 31',
	'Ch 32',
	'Aux 1',
	'Aux 2',
	'Aux 3',
	'Aux 4',
	'Aux 5',
	'Aux 6',
	'Aux 7 / USB L',
	'Aux 8 / USB R',
	'Fx 1L',
	'Fx 1R',
	'Fx 2L',
	'Fx 2R',
	'Fx 3L',
	'Fx 3R',
	'Fx 4L',
	'Fx 4R',
	'MixBus 1',
	'MixBus 2',
	'MixBus 3',
	'MixBus 4',
	'MixBus 5',
	'MixBus 6',
	'MixBus 7',
	'MixBus 8',
	'MixBus 9',
	'MixBus 10',
	'MixBus 11',
	'MixBus 12',
	'Bus 13 / Fx 1',
	'Bus 14 / Fx 2',
	'Bus 15 / Fx 3',
	'Bus 16 / Fx 4',
];

function faderToDbfs(value: number) {
	// 1 = +10, 0.749... = 0, 0 = -Infinity
	return 80 * Math.log10(value / 0.75); // I do not believe this is a perfect equation but it is roughly correct
}

function floatToDB(f: number): number {
	if (f >= 0.5) {
		return f * 40 - 30 // max dB value: +10.
	} else if (f >= 0.25) {
		return f * 80 - 50
	} else if (f >= 0.0625) {
		return f * 160 - 70
	} else if (f >= 0.0) {
		return f * 480 - 90 // min dB value: -90 or -oo
	} else {
		return Number.NEGATIVE_INFINITY
	}
}
