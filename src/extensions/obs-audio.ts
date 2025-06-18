import * as nodecgApiContext from "./nodecg-api-context";
// import obs from "./util/obs";
import _ from "underscore";

import { gameAudioActiveRep } from "./replicants";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "nodecg/types";

const nodecg = nodecgApiContext.get();

const runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

nodecg.listenFor("update-audioindicator", (teamId) => {
	// gameAudioActiveRep.value = teamId;
	// changeStreamMutes(teamId);
});

runDataActiveRep.on("change", (newVal) => {
	if (!newVal?.teams) {
		gameAudioActiveRep.value = 0;
		return;
	}

	if (newVal.teams.length > 1) {
		gameAudioActiveRep.value = 0;
		// changeStreamMutes(newVal.teams[0].id);
	}
});

// Example output
// {
// 	"inputs": [
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "VOD Audio for Soundtrack by Twitch"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "O_GO: Widescreen"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "0_R1"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "1_C1"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "2_C2"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "3_HOST"
// 		},
// 		{
// 			"inputLevelsMul": [],
// 			"inputName": "GO: Transition"
// 		},
// 		{
// 			"inputLevelsMul": [
// 				[
// 					0.05698484927415848,
// 					0.19591617584228516,
// 					0.19591617584228516
// 				],
// 				[
// 					0.05698484927415848,
// 					0.19591617584228516,
// 					0.19591617584228516
// 				]
// 			],
// 			"inputName": "NormalMic"
// 		}
// 	]
// }

// nodecg.listenFor("update-obs-gate", (value) => {
// 	microphoneGateRep.value = value;
// 	// changeStreamMutes(teamId);
// });

// nodecg.listenFor("update-obs-audio", (data) => {
// 	const foundAudioIndex = obsAudioActivityRep.value.findIndex((indicator) => indicator.id === data.id);

// 	if (foundAudioIndex > -1) {
// 		obsAudioActivityRep.value[foundAudioIndex].inputName = data.inputName;
// 	} else {
// 		obsAudioActivityRep.value.push({ active: false, id: data.id, inputName: data.inputName });
// 	}
// });

// nodecg.listenFor("remove-obs-audio", (id: string) => {
// 	const foundAudioIndex = obsAudioActivityRep.value.findIndex((indicator) => indicator.id === id);

// 	if (foundAudioIndex > -1) {
// 		const mutableArray = _.clone(obsAudioActivityRep.value);
// 		mutableArray.splice(foundAudioIndex, 1);
// 		obsAudioActivityRep.value = mutableArray;
// 	}
// });

// obs.on("InputVolumeMeters", (data) => {
// 	// console.log(data);
// 	const audioInputs = data.inputs.map((input) => input.inputName?.toString() ?? "");
// 	if (!_.isEqual(audioInputs, obsAudioInputs.value)) {
// 		obsAudioInputs.value = audioInputs;
// 	}

// 	const mutableArray = _.clone(obsAudioActivityRep.value);

// 	// data.inputs.forEach(element => {
// 	// 	if (element.inputName == "RED Runner")	console.log(mulToDB((element?.inputLevelsMul as number[][])[0][2]));
// 	// });

// 	for (let i = 0, n = mutableArray.length; i < n; i++) {
// 		mutableArray[i].active =
// 			mulToDB(
// 				(
// 					data.inputs.find((input) => (input.inputName?.toString() ?? "") === mutableArray[i].inputName)
// 						?.inputLevelsMul as number[][]
// 				)[0][2] ?? 0,
// 			) >= microphoneGateRep.value;
// 	}

// 	obsAudioActivityRep.value = mutableArray;
// });

// function mulToDB(mul: number) {
// 	return mul <= 0 ? -Infinity : 20 * Math.log10(mul);
// }

// nodecg.listenFor('changeSourceAudio', (data: { source: string, volume: number }) => {
// 	let logVolume = Math.log10(data.volume) * 20 - 40; // dB do be a logarithmic scale doe

// 	if (isNaN(logVolume)) {
// 		logVolume = 0;
// 	} else if (logVolume < -100) {
// 		logVolume = -100;
// 	}

// 	logVolume = Math.min(logVolume, 26);	// OBS Max volume is 26

// 	obs.setSourceVolume(data.source, logVolume, true);
// });

// nodecg.listenFor('muteSourceAudio', (data: { source: string, mute: boolean }) => {
// 	obs.setSourceMute(data.source, data.mute);
// });

// nodecg.listenFor('updateAudioMutes', () => {
// 	changeStreamMutes(audioIndicatorRep.value);
// });

// function changeStreamMutes(newVal: string) {
// 	const liveStreams = twitchStreamsRep.value.filter(stream => {
// 		return stream.state === 'live';
// 	});

// 	if (!obsConnectionRep.value) {
// 		// Not connected
// 		return;
// 	}

// 	// If a multiplayer stream
// 	if (liveStreams.length > 1) {
// 		// Try catch because I am scared
// 		try {
// 			// Team index's are left to right, [Player on left, Player on right]
// 			// Find the index of which the audio indicator is pointing to
// 			const teamIndex = runDataActiveRep.value?.teams.findIndex(team => {
// 				return team.id === newVal;
// 			});

// 			const leftStream = liveStreams.find(stream => {
// 				return stream.size === 'left';
// 			});

// 			const rightStream = liveStreams.find(stream => {
// 				return stream.size === 'right';
// 			});

// 			// teamIndex === 0 means that the team audio is on the left
// 			const isAudioLeft = teamIndex === 0;
// 			obs.setSourceMute(`ASM Station ${leftStream?.channel.slice(-1)}`, !isAudioLeft); // Inverse because true would mute the stream
// 			obs.setSourceMute(`ASM Station ${rightStream?.channel.slice(-1)}`, isAudioLeft);
// 		} catch (error) {
// 			nodecg.log.error('Failed setting multiple stream audio', error);
// 		}
// 	} else if (liveStreams.length === 1) {
// 		// Normal solo stream
// 		const obsSourceName = `ASM Station ${liveStreams[0].channel.slice(-1)}`;
// 		// obs.setSourceMute(obsSourceName, false);
// 	}
// }
