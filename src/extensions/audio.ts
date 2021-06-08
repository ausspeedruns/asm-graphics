import * as nodecgApiContext from './nodecg-api-context';
import obs from './util/obs';

import { RunDataActiveRun } from '../types/RunData';
import { Stream } from '../types/Streams';
import { RunnerNames } from '../types/ExtraRunData';

const nodecg = nodecgApiContext.get();

const audioIndicatorRep = nodecg.Replicant<string>('audio-indicator', { defaultValue: '' });
const runDataActiveRep = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const twitchStreamsRep = nodecg.Replicant<Stream[]>('twitchStreams');
const obsConnectionRep = nodecg.Replicant<boolean>('obsConnection');
const runnerNamesRep = nodecg.Replicant<RunnerNames[]>('runner-names');

nodecg.listenFor('update-audioindicator', (teamId: string) => {
	audioIndicatorRep.value = teamId;
	changeStreamMutes(teamId);
});

runnerNamesRep.on('change', newVal => {
	if (newVal.length > 0) {
		audioIndicatorRep.value = newVal[0].id;
		changeStreamMutes(newVal[0].id);
	} else {
		audioIndicatorRep.value = '';
	}
});

nodecg.listenFor('changeSourceAudio', (data: { source: string, volume: number }) => {
	let logVolume = Math.log10(data.volume) * 50 - 100; // dB do be a logarithmic scale doe

	if (isNaN(logVolume) || logVolume > 0) {
		logVolume = 0;
	} else if (logVolume < -100) {
		logVolume = -100;
	}

	obs.setSourceVolume(data.source, logVolume, true);
});

nodecg.listenFor('muteSourceAudio', (data: { source: string, mute: boolean }) => {
	obs.setSourceMute(data.source, data.mute);
});

nodecg.listenFor('updateAudioMutes', () => {
	changeStreamMutes(audioIndicatorRep.value);
});

function changeStreamMutes(newVal: string) {
	const liveStreams = twitchStreamsRep.value.filter(stream => {
		return stream.state === 'live';
	});

	if (!obsConnectionRep.value) {
		// Not connected
		return;
	}

	// If a multiplayer stream
	if (liveStreams.length > 1) {
		// Try const because I am scared
		try {
			// Team index's are left to right, [Player on left, Player on right]
			// Find the index of which the audio indicator is pointing to
			const teamIndex = runDataActiveRep.value?.teams.findIndex(team => {
				return team.id === newVal;
			});

			const leftStream = liveStreams.find(stream => {
				return stream.size === 'left';
			});

			const rightStream = liveStreams.find(stream => {
				return stream.size === 'right';
			});

			// teamIndex === 0 means that the team audio is on the left
			const isAudioLeft = teamIndex === 0;
			obs.setSourceMute(`ASM Station ${leftStream?.channel.slice(-1)}`, !isAudioLeft); // Inverse because true would mute the stream
			obs.setSourceMute(`ASM Station ${rightStream?.channel.slice(-1)}`, isAudioLeft);
		} catch (error) {
			nodecg.log.error('Failed setting multiple stream audio', error);
		}
	} else if (liveStreams.length === 1) {
		// Normal solo stream
		const obsSourceName = `ASM Station ${liveStreams[0].channel.slice(-1)}`;
		obs.setSourceMute(obsSourceName, false);
	}
}
