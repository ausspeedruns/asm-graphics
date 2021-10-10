import * as nodecgApiContext from './nodecg-api-context';

import { CouchInformation, CouchPerson, NoCam } from '../types/OverlayProps';
import { Donation } from '../types/Donations';
import { GoogleToken } from '../types/GoogleToken';
import { Goal, War } from '../types/Incentives';
import { Stream } from 'stream';
import { CurrentOverlay } from '../types/CurrentOverlay';
import { StaffMessage } from '../types/StaffMessages';
import { Tweet } from '../types/Twitter';

const nodecg = nodecgApiContext.get();

nodecg.log.info('Setting up replicants');

/* Couch */
nodecg.Replicant<CouchInformation>('couch-names', { defaultValue: { current: [], preview: [] } });
nodecg.Replicant<NoCam>('no-cam', { defaultValue: { current: false, preview: false } });

/* Donations */
nodecg.Replicant<number>('donationTotal', { defaultValue: 0 });
nodecg.Replicant<Donation[]>('donations', { defaultValue: [] });

/* Audio */
nodecg.Replicant<string>('audio-indicator', { defaultValue: '' });

/* Host */
nodecg.Replicant<CouchPerson>('host', { defaultValue: { name: '', pronouns: '' } });

/* Incentives */
nodecg.Replicant<(Goal | War)[]>('incentives', { defaultValue: [] });

/* Overlay */
nodecg.Replicant<CurrentOverlay>('currentOverlay', { defaultValue: { preview: 'widescreen', live: 'standard' } });
nodecg.Replicant<Stream[]>('twitchStreams', { defaultValue: [] });
nodecg.Replicant<string>('obsCurrentScene', { defaultValue: 'Intermission' });

/* Staff Messages */
nodecg.Replicant<StaffMessage[]>('staff-messages', { defaultValue: [] });

/* Twitter */
nodecg.Replicant<Tweet[]>('tweets', { persistent: false, defaultValue: [] });

/* Google */
nodecg.Replicant<GoogleToken>('googleToken');
nodecg.Replicant<(Goal | War)[]>('incentives', { defaultValue: [] });

/* OBS */
nodecg.Replicant<boolean>('obsConnection', { defaultValue: false, persistent: false });

/* Credits */
nodecg.Replicant<{name: string, title: string}>('credits-name', {defaultValue: {name: '', title: ''}});
