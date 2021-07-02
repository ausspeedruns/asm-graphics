"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
/* Couch */
nodecg.Replicant('couch-names', { defaultValue: { current: [], preview: [] } });
/* Donations */
nodecg.Replicant('donationTotal', { persistent: true, defaultValue: 0 });
nodecg.Replicant('donations', { persistent: true, defaultValue: [] });
/* Audio */
nodecg.Replicant('audio-indicator', { defaultValue: '' });
/* Host */
nodecg.Replicant('host', { defaultValue: { name: '', pronouns: '' } });
/* Incentives */
nodecg.Replicant('incentives', { defaultValue: [] });
/* Overlay */
nodecg.Replicant('currentOverlay', { defaultValue: { preview: 'widescreen', live: 'standard' } });
nodecg.Replicant('twitchStreams', { defaultValue: [] });
nodecg.Replicant('obsCurrentScene', { defaultValue: 'Intermission' });
/* Staff Messages */
nodecg.Replicant('staff-messages', { defaultValue: [] });
/* Twitter */
nodecg.Replicant('tweets', { persistent: false, defaultValue: [] });
/* Google */
nodecg.Replicant('googleToken', { persistent: true });
nodecg.Replicant('incentives', { defaultValue: [] });
/* OBS */
nodecg.Replicant('obsConnection', { defaultValue: false, persistent: false });
