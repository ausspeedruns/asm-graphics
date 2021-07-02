import * as nodecgApiContext from './nodecg-api-context';

import { CouchInformation, CouchPerson } from '../types/OverlayProps';
import { Donation } from '../types/Donations';
import { GoogleToken } from '../types/GoogleToken';
import { Goal, War } from '../types/Incentives';
import { Stream } from 'stream';
import { CurrentOverlay } from '../types/CurrentOverlay';
import { StaffMessage } from '../types/StaffMessages';
import { Tweet } from '../types/Twitter';

const nodecg = nodecgApiContext.get();

/* Couch */
nodecg.Replicant<CouchInformation>('couch-names', { defaultValue: {current: [], preview: []} });

/* Donations */
nodecg.Replicant<number>('donationTotal', { persistent: true, defaultValue: 0 });
nodecg.Replicant<Donation[]>('donations', { persistent: true, defaultValue: [] });

/* Audio */
nodecg.Replicant<string>('audio-indicator', { defaultValue: '' });

/* Host */
nodecg.Replicant<CouchPerson>('host', { defaultValue: {name: '', pronouns: ''} });

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
nodecg.Replicant<GoogleToken>('googleToken', { persistent: true });
nodecg.Replicant<(Goal | War)[]>('incentives', { defaultValue: [] });

/* OBS */
nodecg.Replicant<boolean>('obsConnection', { defaultValue: false, persistent: false });
