"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const obs_1 = tslib_1.__importDefault(require("./util/obs"));
const nodecg = nodecgApiContext.get();
const currentOverlayRep = nodecg.Replicant('currentOverlay');
const twitchStreamsRep = nodecg.Replicant('twitchStreams');
const currentSceneRep = nodecg.Replicant('obsCurrentScene');
const couchNamesRep = nodecg.Replicant('couch-names');
const noCamRep = nodecg.Replicant('no-cam');
// Manual obs connections
nodecg.listenFor('connectOBS', () => {
    try {
        obs_1.default.connect();
    }
    catch (error) {
        nodecg.log.error(`[Overlay] Failed to connect to OBS: ${error}`);
    }
});
nodecg.listenFor('disconnectOBS', () => {
    try {
        obs_1.default.disconnect();
    }
    catch (error) {
        nodecg.log.error(`[Overlay] Failed to disconnect to OBS: ${error}`);
    }
});
nodecg.listenFor('changeOverlayPreview', (newVal) => {
    currentOverlayRep.value.preview = newVal;
});
// This should only be used for developer testing purposes
nodecg.listenFor('changeOverlayLive', (newVal) => {
    currentOverlayRep.value.live = newVal;
});
// Twitch stream commands, could probably combine these to one since I am logging even hidden ones
nodecg.listenFor('newTwitchStream', (newVal) => {
    const index = twitchStreamsRep.value.findIndex(stream => stream.channel === newVal.channel);
    if (index === -1) {
        // Add new stream
        twitchStreamsRep.value.push(newVal);
    }
    else {
        // Update size
        twitchStreamsRep.value[index].size = newVal.size;
        if (twitchStreamsRep.value[index].state === 'live') {
            twitchStreamsRep.value[index].state = 'both';
        }
        else {
            twitchStreamsRep.value[index].state = 'preview';
        }
    }
    const clonedArray = twitchStreamsRep.value.slice();
    clonedArray.sort((a, b) => {
        if (a.channel < b.channel)
            return -1;
        if (a.channel > b.channel)
            return 1;
        return 0;
    });
    twitchStreamsRep.value = clonedArray;
});
nodecg.listenFor('removeTwitchStream', (newVal) => {
    const index = twitchStreamsRep.value.findIndex(stream => stream.channel === newVal);
    if (index === -1) {
        nodecg.log.warn(`[OBS] Tried removing Stream ${newVal} but it couldn't be found`);
    }
    else if (twitchStreamsRep.value[index].state === 'preview') {
        twitchStreamsRep.value[index].state = 'hidden';
    }
    else if (twitchStreamsRep.value[index].state === 'both') {
        twitchStreamsRep.value[index].state = 'live';
    }
});
nodecg.listenFor('transitionGameplay', () => {
    // Check if intermission is live
    obs_1.default.send('GetCurrentScene').then(val => {
        nodecg.sendMessage('runTransitionGraphic');
        if (val.name === 'Intermission') {
            transitionGameplay();
            obs_1.default.transition('Game Overlay');
        }
        else {
            // Wait for 1.5 seconds to switch gameplay router
            setTimeout(transitionGameplay, 1600);
        }
    });
});
function transitionGameplay() {
    // Change graphic
    currentOverlayRep.value = {
        live: currentOverlayRep.value.preview,
        preview: currentOverlayRep.value.live
    };
    // Change couch names
    couchNamesRep.value = {
        current: couchNamesRep.value.preview,
        preview: couchNamesRep.value.current
    };
    // Change no cam
    noCamRep.value = {
        current: noCamRep.value.preview,
        preview: noCamRep.value.current
    };
    // Change livestreams
    const liveStreams = twitchStreamsRep.value.map(stream => {
        const modifiedStream = stream;
        if (stream.state === 'preview') {
            modifiedStream.state = 'live';
        }
        else if (stream.state === 'live') {
            modifiedStream.state = 'preview';
        }
        else if (stream.state === 'both') {
            // Do Nothing
        }
        else {
            modifiedStream.state = 'hidden';
        }
        return modifiedStream;
    });
    twitchStreamsRep.value = liveStreams;
    // Change livestream sources
    liveStreams.forEach(stream => {
        // We're only changing the ASM Stations
        const obsSourceName = `ASM Station ${stream.channel.slice(-1)}`;
        if (stream.state === 'live' || stream.state === 'both') {
            obs_1.default.enableSource(obsSourceName, true, 'Game Overlay');
            switch (stream.size) {
                case 'left':
                    obs_1.default.setSceneItemProperties('Game Overlay', obsSourceName, { position: { x: 0 }, crop: { right: 960, left: 0 }, bounds: {}, scale: {} });
                    break;
                case 'right':
                    obs_1.default.setSceneItemProperties('Game Overlay', obsSourceName, { position: { x: 960 }, crop: { right: 0, left: 960 }, bounds: {}, scale: {} });
                    break;
                case 'whole':
                default:
                    obs_1.default.setSceneItemProperties('Game Overlay', obsSourceName, { position: { x: 0 }, crop: { right: 0, left: 0 }, bounds: {}, scale: {} });
                    break;
            }
        }
        else {
            // Reset source
            obs_1.default.enableSource(obsSourceName, false, 'Game Overlay');
            obs_1.default.setSceneItemProperties('Game Overlay', obsSourceName, { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, crop: { right: 0, left: 0 }, bounds: {} });
        }
    });
    nodecg.sendMessage('updateAudioMutes');
}
// Intermission
nodecg.listenFor('goToIntermission', () => {
    nodecg.sendMessage('runTransitionGraphic');
    obs_1.default.transition('Intermission');
});
// If a transition is done from OBS
obs_1.default.on('TransitionBegin', () => {
    nodecg.sendMessage('runTransitionGraphic');
});
// CURRENT SCENE
// Change current scene replicant on scene change
obs_1.default.on('SwitchScenes', () => {
    getCurrentScene();
});
// Set replicant value on connection
obs_1.default.on('ConnectionOpened', () => {
    getCurrentScene();
});
function getCurrentScene() {
    try {
        obs_1.default.send('GetCurrentScene').then((val) => {
            currentSceneRep.value = val.name;
        });
    }
    catch (error) {
        nodecg.log.error('Could not get the current scene from OBS:', error);
    }
}
nodecg.listenFor('discord-gameplay', (enable) => {
    obs_1.default.enableSource('Discord', enable, 'Game Overlay');
});
nodecg.listenFor('ps5-stream-scale', (enable) => {
    if (enable) {
        obs_1.default.setSceneItemProperties('Game Overlay', 'ASM Station 1', { position: { x: 391, y: 156 }, scale: { x: 0.79623, y: 0.79623 }, bounds: {}, crop: {} });
    }
    else {
        obs_1.default.setSceneItemProperties('Game Overlay', 'ASM Station 1', { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, bounds: {}, crop: {} });
    }
});
