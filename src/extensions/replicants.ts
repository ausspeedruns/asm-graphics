import * as nodecgApiContext from './nodecg-api-context';

import type { CouchPerson } from '@asm-graphics/types/OverlayProps';
import type { Donation } from '@asm-graphics/types/Donations';
import type { Goal, War } from '@asm-graphics/types/Incentives';
import type { Stream } from '@asm-graphics/types/Streams';
import type { CurrentOverlay } from '@asm-graphics/types/CurrentOverlay';
import type { StaffMessage } from '@asm-graphics/types/StaffMessages';
import type { Tweet } from '@asm-graphics/types/Twitter';
import type { OBSAudioIndicator } from '@asm-graphics/types/Audio';
import type { User as AusSpeedrunsUser } from '@asm-graphics/types/AusSpeedrunsWebsite';
import type { ConnectionStatus } from '@asm-graphics/types/Connections';

const nodecg = nodecgApiContext.get();

nodecg.log.info('Setting up replicants');

/* Couch */
nodecg.Replicant<CouchPerson[]>('couch-names', { defaultValue: [] });

/* Donations */
nodecg.Replicant<number>('donationTotal', { defaultValue: 0 });
nodecg.Replicant<Donation[]>('donations', { defaultValue: [] });
nodecg.Replicant<Donation[]>('manual-donations', { defaultValue: [] });
nodecg.Replicant<number>('manual-donation-total', { defaultValue: 0 });

/* Audio */
nodecg.Replicant<string>('audio-indicator', { defaultValue: '' });
nodecg.Replicant<OBSAudioIndicator[]>('obs-audio-indicator', { defaultValue: [], persistent: false });
nodecg.Replicant<number>('obs-audio-gate', { defaultValue: -10 });

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
nodecg.Replicant<ConnectionStatus>('obs:status', { defaultValue: "disconnected", persistent: false });

/* Credits */
nodecg.Replicant<{ name: string, title: string }>('credits-name', { defaultValue: { name: '', title: '' } });

/* Schedule Import */
nodecg.Replicant<AusSpeedrunsUser[]>('all-usernames', { defaultValue: [] });

/* X32 */
nodecg.Replicant<ConnectionStatus>('x32:status', { defaultValue: "disconnected", persistent: false });
