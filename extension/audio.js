"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const obs_1 = tslib_1.__importDefault(require("./util/obs"));
const nodecg = nodecgApiContext.get();
const audioIndicatorRep = nodecg.Replicant('audio-indicator');
const runDataActiveRep = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const twitchStreamsRep = nodecg.Replicant('twitchStreams');
const obsConnectionRep = nodecg.Replicant('obsConnection');
nodecg.listenFor('update-audioindicator', (teamId) => {
    audioIndicatorRep.value = teamId;
    changeStreamMutes(teamId);
});
runDataActiveRep.on('change', newVal => {
    if (!(newVal === null || newVal === void 0 ? void 0 : newVal.teams)) {
        audioIndicatorRep.value = '';
        return;
    }
    if (newVal.teams.length > 1) {
        audioIndicatorRep.value = newVal.teams[0].id;
        changeStreamMutes(newVal.teams[0].id);
    }
});
nodecg.listenFor('changeSourceAudio', (data) => {
    let logVolume = Math.log10(data.volume) * 20 - 40; // dB do be a logarithmic scale doe
    if (isNaN(logVolume)) {
        logVolume = 0;
    }
    else if (logVolume < -100) {
        logVolume = -100;
    }
    logVolume = Math.min(logVolume, 26); // OBS Max volume is 26
    obs_1.default.setSourceVolume(data.source, logVolume, true);
});
nodecg.listenFor('muteSourceAudio', (data) => {
    obs_1.default.setSourceMute(data.source, data.mute);
});
nodecg.listenFor('updateAudioMutes', () => {
    changeStreamMutes(audioIndicatorRep.value);
});
function changeStreamMutes(newVal) {
    var _a;
    const liveStreams = twitchStreamsRep.value.filter(stream => {
        return stream.state === 'live';
    });
    if (!obsConnectionRep.value) {
        // Not connected
        return;
    }
    // If a multiplayer stream
    if (liveStreams.length > 1) {
        // Try catch because I am scared
        try {
            // Team index's are left to right, [Player on left, Player on right]
            // Find the index of which the audio indicator is pointing to
            const teamIndex = (_a = runDataActiveRep.value) === null || _a === void 0 ? void 0 : _a.teams.findIndex(team => {
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
            obs_1.default.setSourceMute(`ASM Station ${leftStream === null || leftStream === void 0 ? void 0 : leftStream.channel.slice(-1)}`, !isAudioLeft); // Inverse because true would mute the stream
            obs_1.default.setSourceMute(`ASM Station ${rightStream === null || rightStream === void 0 ? void 0 : rightStream.channel.slice(-1)}`, isAudioLeft);
        }
        catch (error) {
            nodecg.log.error('Failed setting multiple stream audio', error);
        }
    }
    else if (liveStreams.length === 1) {
        // Normal solo stream
        const obsSourceName = `ASM Station ${liveStreams[0].channel.slice(-1)}`;
        obs_1.default.setSourceMute(obsSourceName, false);
    }
}
