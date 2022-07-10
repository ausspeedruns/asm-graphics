import * as nodecgApiContext from './nodecg-api-context';

import { CouchInformation, NoCam } from '../types/OverlayProps';
import { Donation } from '../types/Donations';
import { Goal, War } from '../types/Incentives';
import { Stream } from 'stream';
import { CurrentOverlay } from '../types/CurrentOverlay';
import { StaffMessage } from '../types/StaffMessages';
import { Tweet } from '../types/Twitter';
import { OBSAudioIndicator } from '../types/Audio';

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
nodecg.Replicant<OBSAudioIndicator[]>('obs-audio-indicator', { defaultValue: [], persistenceInterval: 10 * 1000 });
nodecg.Replicant<string[]>('obs-audio-inputs', { defaultValue: [] });
nodecg.Replicant<number>('obs-audio-gate', { defaultValue: 0.7 });

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

/* GraphQL */
nodecg.Replicant<(Goal | War)[]>('incentives', { defaultValue: [] });

/* OBS */
nodecg.Replicant<boolean>('obsConnection', { defaultValue: false, persistent: false });

/* Credits */
nodecg.Replicant<{ name: string, title: string }>('credits-name', { defaultValue: { name: '', title: '' } });
