import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useListenFor, useReplicant } from 'use-nodecg';
import { Goal, War } from '../types/Incentives';
import { Asset } from '../types/nodecg';
import { CouchInformation } from '../types/OverlayProps';
import { RunDataArray, RunDataActiveRun } from '../types/RunData';
import { Tweet } from '../types/Twitter';

import { IntermissionElement, IntermissionRef } from './intermission';

const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<Asset[], Asset[]>('assets:sponsors', []);
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostName] = useReplicant<CouchInformation, CouchInformation>('couch-names', { current: [], preview: [] });
	const [donationRep] = useReplicant<number, number>('donationTotal', 100);

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor('showTweet', (newVal: Tweet) => {
		if (intermissionRef.current) intermissionRef.current.showTweet(newVal);
	});

	useListenFor('playAd', (newVal: string) => {
		if (intermissionRef.current) intermissionRef.current.showAd(newVal);
	});


	return (
		<IntermissionElement
			ref={intermissionRef}
			activeRun={runDataActiveRep}
			runArray={runDataArrayRep}
			donation={donationRep}
			host={hostName.current.find((person) => person.host)}
			sponsors={sponsorsRep}
			incentives={incentivesRep}
			muted
		/>
	);
};

createRoot(document.getElementById('root')!).render(<Intermission />);