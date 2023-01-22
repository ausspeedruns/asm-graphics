import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { GameplayRouterParent } from './gameplay-overlay';
import { Stream as TwitchStream } from '@asm-graphics/types/Streams';

import { ASMStream } from './elements/individual-stream';

const PreviewStream = styled(ASMStream)`
	z-index: -1;
	position: absolute;
	height: 1080px;
	width: 1920px;
`;

const PreviewGameplayStream: React.FC = () => {
	const [twitchStreamsRep] = useReplicant<TwitchStream[], TwitchStream[]>('twitchStreams', []);

	// Preview twitch streams
	const previewStreamElements = twitchStreamsRep
		.filter((ogStream) => {
			if (ogStream.state === 'preview' || ogStream.state === 'both') {
				return ogStream;
			}

			return undefined;
		})
		.map((stream) => {
			return <PreviewStream channel={stream.channel} size={stream.size} key={stream.channel} />;
		});

	return (
		<>
			{previewStreamElements}
			<GameplayRouterParent preview />
		</>
	);
};

createRoot(document.getElementById('root')!).render(<PreviewGameplayStream />);
