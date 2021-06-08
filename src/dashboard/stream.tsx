import React from 'react';
import { render } from 'react-dom';

import { Config } from '../types/ConfigSchema';

// @ts-ignore
import { TwitchPlayer } from 'react-twitch-embed';

const TWITCHPARENTS = (nodecg.bundleConfig as Config).twitch.parents;

const Stream: React.FC = () => {
	return (
		<TwitchPlayer channel="ausspeedruns" parents={TWITCHPARENTS} width={416} height={234} />
	);
};

render(<Stream />, document.getElementById('stream'));
