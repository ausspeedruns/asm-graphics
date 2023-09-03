import osc, { SenderInfo } from "osc";
import { TypedEmitter } from "tiny-typed-emitter";

import * as nodecgApiContext from "../nodecg-api-context";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";

const nodecg = nodecgApiContext.get();

interface X32Class {
	status: (status: ConnectionStatus) => void;
	faders: (faders: number[], mixBus: number) => void;
	mainFaders: (mainFaders: number[]) => void;
	meters: (meters: number[]) => void;
	// 'mutes': (mutes: boolean[]) => void;
}

class X32 extends TypedEmitter<X32Class> {
	private heartbeatTimeout?: NodeJS.Timeout;
	private heartbeatAttempts = 0;
	private MAX_HEARTBEAT_ATTEMPTS = 10;
	private HEARTBEAT_INTERVAL = 1000;
	private HEARTBEAT_TIMEOUT = this.HEARTBEAT_INTERVAL * 6;
	private oscSocket;

	private intervalSubscriptions: NodeJS.Timer;
	private intervalHeartbeat: NodeJS.Timer;

	private fadersFading: {
		[k: string]: {
			value: number;
			increase: boolean;
			seenOnce: boolean;
		};
	} = {};
	private fadersIntervals: { [k: string]: NodeJS.Timeout } = {};

	constructor() {
		super();
		this.oscSocket = new osc.UDPPort({
			localAddress: "0.0.0.0",
			localPort: 11918, // Random port number (ASR 1 19 18)
			remoteAddress: nodecg.bundleConfig.x32?.ip,
			remotePort: 10023,
			metadata: true,
		});

		this.oscSocket.on("raw", this.raw.bind(this));

		this.oscSocket.on("error", this.error.bind(this));

		this.oscSocket.on("open", this.open.bind(this));

		this.oscSocket.on("close", this.close.bind(this));

		this.oscSocket.open();

		this.intervalSubscriptions = setInterval(this.renewSubscriptions.bind(this), 9000);
		this.intervalHeartbeat = setInterval(this.sendHeartbeat.bind(this), this.HEARTBEAT_INTERVAL);
	}

	handleMissedHeartbeat = () => {
		this.emit("status", "warning");
		this.heartbeatAttempts++;

		clearInterval(this.intervalHeartbeat);

		if (this.heartbeatAttempts > this.MAX_HEARTBEAT_ATTEMPTS) {
			this.emit("status", "disconnected");
		}

		this.heartbeatTimeout = setTimeout(this.handleMissedHeartbeat.bind(this), this.HEARTBEAT_TIMEOUT);
	};

	sendHeartbeat = () => {
		this.oscSocket.send({
			address: "/info",
			args: [],
		});
	};

	raw(data: Uint8Array) {
		const buffer = Buffer.from(data);
		const str = buffer.toString("ascii");
		let channelNumber = 1;
		let valueBytes;

		// Number.NEGATIVE_INFINITY is there because the arrays are 1 indexed, not 0

		if (str.startsWith("/info")) {
			// Heartbeat
			this.emit("status", "connected");

			clearTimeout(this.heartbeatTimeout);
			this.heartbeatAttempts = 0;
			this.heartbeatTimeout = setTimeout(this.handleMissedHeartbeat.bind(this), this.HEARTBEAT_TIMEOUT);
			// } else if (str.startsWith('/chMutes')) {
			// MUTES
			// For this particular message, we know that the values start at byte 22 and stop 2 bytes from the end.
			// valueBytes = buffer.subarray(22, -2);
			// const mutes = [false];

			// for (let i = 0; i < valueBytes.length; i += 4) {
			// 	mutes[channelNumber] = !valueBytes.readFloatBE(i);
			// 	channelNumber++;
			// }

			// this.emit('mutes', mutes);
		} else if (str.startsWith("/chFaders")) {
			// For this particular message, we know that the values start at byte 24
			valueBytes = buffer.subarray(24);
			const faders = [];

			for (let i = 0; i < valueBytes.length; i += 4) {
				// faders[channelNumber] = X32.floatToDB(valueBytes.readFloatLE(i));
				faders[channelNumber] = valueBytes.readFloatLE(i);

				channelNumber++;
			}

			this.emit("faders", faders, 0);
		} else if (str.startsWith("/chMeters")) {
			// Detect input volumes
			valueBytes = buffer.subarray(24, -64);
			const meters: number[] = [];

			for (let i = 0; i < valueBytes.length; i += 4) {
				meters[channelNumber] = valueBytes.readFloatLE(i);

				// console.log(`${channelNumber} ${channelIndex[channelNumber]} ${valueBytes.readFloatLE(i)}`);

				channelNumber++;
			}

			this.emit("meters", meters);
		} else if (/\/bus(\d{2})Faders/.test(str)) {
			const bus = parseInt(str.match(/\/bus(\d{2})Faders/)?.[1] ?? "-1");
			if (bus === -1) {
				nodecg.log.error(`[X32] Unknown bus: ${str}`);
				return;
			}

			valueBytes = buffer.subarray(28);
			const faders = [];
			for (let i = 0; i < valueBytes.length; i += 4) {
				faders[channelNumber] = valueBytes.readFloatLE(i);

				// console.log(`${X32.mixBusIndex[bus]} ${channelNumber} ${X32.channelIndex[channelNumber]} ${valueBytes.readFloatLE(i)}`);

				channelNumber++;
			}

			this.emit("faders", faders, bus);
		} else if (/\/busMasters/.test(str)) {
			valueBytes = buffer.subarray(24);

			let bus = 3; // We start at 3 and go to 12
			const faders = [];
			for (let i = 0; i < valueBytes.length; i += 4) {
				faders[bus] = valueBytes.readFloatLE(i);

				// console.log(`${X32.mixBusIndex[bus]} ${bus} ${valueBytes.readFloatLE(i)}`);

				bus++;
			}

			this.emit("mainFaders", faders);
		} else {
			nodecg.log.debug(`[X32] Unknown command: ${str}`);
		}
	}

	error = (error: any) => {
		nodecg.log.warn("[X32] Error:", error.stack);
	};

	close = () => {
		nodecg.log.warn("[X32] Port closed.");
	};

	/**
	 * Renews subscriptions with the X32 (they expire every 10s).
	 */
	renewSubscriptions = () => {
		// MAIN BUS MUTES
		// this.oscSocket.send({
		// 	address: '/batchsubscribe',
		// 	args: [
		// 		{ type: 's', value: '/chMutes' },
		// 		{ type: 's', value: '/mix/on' },
		// 		{ type: 'i', value: 0 },
		// 		{ type: 'i', value: 63 },
		// 		{ type: 'i', value: 10 }
		// 	]
		// });

		// MAIN BUS FADERS
		this.oscSocket.send({
			address: "/batchsubscribe",
			args: [
				{ type: "s", value: "/chFaders" },
				{ type: "s", value: "/mix/fader" },
				{ type: "i", value: 0 },
				{ type: "i", value: 63 },
				{ type: "i", value: 10 },
			],
		});

		// INPUT CHANNEL METERS
		this.oscSocket.send({
			address: "/batchsubscribe",
			args: [
				{ type: "s", value: `/chMeters` },
				{ type: "s", value: "/meters/13" },
				{ type: "i", value: 0 },
				{ type: "i", value: 0 },
				{ type: "i", value: 10 },
			],
		});

		// GET MIXBUS FADERS
		["01", "03", "05", "07", "11"].forEach((bus) => {
			this.oscSocket.send({
				address: "/formatsubscribe",
				args: [
					{ type: "s", value: `/bus${bus}Faders` },
					{ type: "s", value: `/ch/**/mix/${bus}/level` },
					{ type: "i", value: 1 },
					{ type: "i", value: 16 },
					{ type: "i", value: 10 },
				],
			});
		});

		this.oscSocket.send({
			address: "/formatsubscribe",
			args: [
				{ type: "s", value: `/busMasters` },
				{ type: "s", value: `/bus/**/mix/fader` },
				{ type: "i", value: 3 },
				{ type: "i", value: 12 },
				{ type: "i", value: 10 },
			],
		});
	};

	open = () => {
		nodecg.log.info("[X32] Port open, can now communicate with a Behringer X32.");
		this.renewSubscriptions();
	};

	static floatToDB(f: number): number {
		if (f >= 0.5) {
			return f * 40 - 30; // max dB value: +10.
		} else if (f >= 0.25) {
			return f * 80 - 50;
		} else if (f >= 0.0625) {
			return f * 160 - 70;
		} else if (f >= 0.0) {
			return f * 480 - 90; // min dB value: -90 or -oo
		} else {
			return Number.NEGATIVE_INFINITY;
		}
	}

	static channelIndex = [
		"MAIN FADER",
		"Runner 1", // 'Ch 01'
		"Runner 2", // 'Ch 02'
		"Runner 3", // 'Ch 03'
		"Runner 4", // 'Ch 04'
		"Host Mic", // 'Ch 05'
		"Special Mic", // 'Ch 06'
		"Ch 07",
		"Ch 08",
		"Game 1 (L)/R", // 'Ch 09'
		"Game 1 L/(R)", // 'Ch 10'
		"Game 2 (L)/R", // 'Ch 11'
		"Game 2 L/(R)", // 'Ch 12'
		"Game 3 (L)/R", // 'Ch 13'
		"Game 3 L/(R)", // 'Ch 14'
		"Game 4 (L)/R", // 'Ch 15'
		"Game 4 L/(R)", // 'Ch 16'
		"Ch 17",
		"Ch 18",
		"Ch 19",
		"Ch 20",
		"Ch 21",
		"Ch 22",
		"Ch 23",
		"Ch 24",
		"Ch 25",
		"Ch 26",
		"Ch 27",
		"Ch 28",
		"Ch 29",
		"Ch 30",
		"Ch 31",
		"Ch 32",
		"Aux 1",
		"Aux 2",
		"Aux 3",
		"Aux 4",
		"Aux 5",
		"Aux 6",
		"Aux 7 / USB L",
		"Aux 8 / USB R",
		"Fx 1L",
		"Fx 1R",
		"Fx 2L",
		"Fx 2R",
		"Fx 3L",
		"Fx 3R",
		"Fx 4L",
		"Fx 4R",
		"MixBus 1",
		"MixBus 2",
		"MixBus 3",
		"MixBus 4",
		"MixBus 5",
		"MixBus 6",
		"MixBus 7",
		"MixBus 8",
		"MixBus 9",
		"MixBus 10",
		"MixBus 11",
		"MixBus 12",
		"Bus 13 / Fx 1",
		"Bus 14 / Fx 2",
		"Bus 15 / Fx 3",
		"Bus 16 / Fx 4",
	];

	static mixBusIndex = [
		"Main LR",
		"Speakers (L)/R",
		"Speakers L/(R)",
		"Runner 1 (L)/R",
		"Runner 1 L/(R)",
		"Runner 2 (L)/R",
		"Runner 2 L/(R)",
		"Runner 3 (L)/R",
		"Runner 3 L/(R)",
		"Runner 4 (L)/R",
		"Runner 4 L/(R)",
		"Host (L)/R",
		"Host L/(R)",
		"Fx 1",
		"Fx 2",
		"Fx 3",
		"Fx 4",
	];

	muteChannel = (channel: number, mixBus?: number) => {
		this.oscSocket.send({
			address: X32.generateChannelAddress("on", channel, mixBus),
			args: [{ type: "i", value: 0 }],
		});
	};

	unmuteChannel = (channel: number, mixBus?: number) => {
		this.oscSocket.send({
			address: X32.generateChannelAddress("on", channel, mixBus),
			args: [{ type: "i", value: 1 }],
		});
	};

	setFaderLevel = (channel: number, mixBus: number, faderFloat: number) => {
		const faderLevel = Math.min(Math.max(faderFloat, 0), 1);

		this.oscSocket.send({
			address: X32.generateChannelAddress(
				X32.isMainMixBus(mixBus) || X32.isMainFader(channel) ? "fader" : "level",
				channel,
				mixBus,
			),
			args: [{ type: "f", value: faderLevel }],
		});
	};

	// https://github.com/esamarathon/esa-layouts-shared/blob/master/extension/x32/src/index.ts#L133
	// This function performs a fade on a specified value over a given duration.
	fade(channelNum: number, mixBusNum: number, startValue: number, endValue: number, milliseconds: number): void {
		const channel = X32.oscNum(channelNum);
		const mixBus = X32.oscNum(mixBusNum);
		const name = `${channel}/${mixBus}`;
		// If a fade is already in progress for the specified name, cancel it to ensure safety.
		if (this.fadersFading[name]) {
			clearInterval(this.fadersIntervals[name]);
			delete this.fadersFading[name];
		}

		nodecg.log.debug(`[X32] Attempting to fade ${name} ` + `(${startValue} => ${endValue}) for ${milliseconds}ms`);

		let currentValue = startValue;
		const increase = startValue < endValue; // Determine whether the value should be increased or decreased.
		const stepCount = milliseconds / 100; // Calculate the number of steps the fade will take over the given duration.
		const stepSize = (endValue - startValue) / stepCount; // Calculate the size of each step.

		this.fadersFading[name] = { value: endValue, increase, seenOnce: false };

		// Start the interval for the fade, updating the value every 100ms.
		this.fadersIntervals[name] = setInterval(() => {
			// If the current value has reached the end value, clear the interval and remove the fade information.
			if ((increase && currentValue >= endValue) || (!increase && currentValue <= endValue)) {
				clearInterval(this.fadersIntervals[name]);
				delete this.fadersFading[name];
			}

			const message = X32.generateChannelAddress(X32.isMainMixBus(mixBus) ? "fader" : "level", channel, mixBus);
			// console.log(message)
			this.oscSocket.send({ address: message, args: [{ type: "f", value: currentValue }] });

			// Increment the current value by the step size.
			currentValue += stepSize;
			// If the current value has exceeded the end value, set it back to the end value.
			if ((increase && currentValue > endValue) || (!increase && currentValue < endValue)) {
				currentValue = endValue;
			}
		}, 100);
	}

	static generateChannelAddress(endpoint: string, channelNum: number | string, mixBusNum?: number | string) {
		const channel = X32.oscNum(channelNum);
		const mixBus = X32.oscNum(mixBusNum);

		if (X32.isMainMixBus(mixBusNum)) {
			return `/ch/${channel}/mix/${endpoint}`;
		} else if (X32.isMainFader(channel)) {
			return `/bus/${mixBus}/mix/${endpoint}`;
		} else {
			return `/ch/${channel}/mix/${mixBus}/${endpoint}`;
		}
	}

	static isMainMixBus(mixBus?: number | string) {
		return typeof mixBus === "undefined" || mixBus === 0 || mixBus === "00";
	}

	static isMainFader(channel?: number | string) {
		return typeof channel === "undefined" || channel === 0 || channel === "00";
	}

	static oscNum(num: number | string | undefined) {
		if (typeof num === "string") return num;
		return String(num).padStart(2, "0");
	}
}

export default X32;
