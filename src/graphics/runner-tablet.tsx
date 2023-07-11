import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useListenFor, useReplicant } from 'use-nodecg';

// import type { Timer } from '@asm-graphics/types/Timer';
import type { CouchPerson } from '@asm-graphics/types/OverlayProps';

import { RTAudio } from './dashboards/runner-tablet/audio';
import { RTNames } from './dashboards/runner-tablet/names';

const NavBar = styled.div`
	width: 100%;
	height: 10vh;
	background: var(--orange-500);
`;

interface NavBarButtonProps {
	active?: boolean;
}

const NavBarButton = styled.button`
	height: 100%;
	border: 0;
	border-right: 5px var(--orange-600) solid;
	font-size: 2rem;
	padding: 0 3rem;
	background: ${({ active }: NavBarButtonProps) => (active ? 'var(--orange-400)' : 'var(--orange-500)')};
	transition: 100ms;
`;

const RightSide = styled.div`
	float: right;
	height: 100%;
`;

const HostName = styled.div`
	display: inline-block;
	color: white;
	font-weight: bold;
	text-align: right;
	padding-right: 1rem;
	font-size: 1.25rem;

	span {
		font-weight: normal;
	}
`;

const ReadyButton = styled(NavBarButton)`
	color: #fff;
	float: right;
	border-right: 0;
`;

const Body = styled.div`
	height: 90vh;
`;

const TABS = {
	NAMES: 'names',
	AUDIO: 'audio',
} as const;

type ObjectValues<T> = T[keyof T];

type TabsValues = ObjectValues<typeof TABS>;

const RunnerTablet: React.FC = () => {
	const [tab, setTab] = useState<TabsValues>('audio');
	const [couchNames] = useReplicant<CouchPerson[]>('couch-names', []);
	// const [runnerReadyRep] = useReplicant<boolean>('runner:ready', false);

	const [live, setLive] = useState(false);

	const host = couchNames.find((person) => person.host);

	let currentTabBody = <></>;
	switch (tab) {
		case 'names':
			currentTabBody = <RTNames />;
			break;
		case 'audio':
			currentTabBody = <RTAudio />;
			break;
		default:
			break;
	}

	// function toggleReady() {
	// 	nodecg.sendMessage(runnerReadyRep ? 'runner:setNotReady' : 'runner:setReady');
	// }

	useListenFor('transition:toGame', () => {
		setLive(true);
	});

	useListenFor('transition:toIntermission', () => {
		setLive(false);
	});

let buttonText = 'ERROR';
	if (live) {
		buttonText = 'LIVE';
	} else {
		buttonText = 'INTERMISSION';
	}

	return (
		<div style={{ height: '100%', width: '100%', fontFamily: 'sans-serif' }}>
			<NavBar>
				<NavBarButton onClick={() => setTab('names')} active={tab === 'names'}>
					Names
				</NavBarButton>
				<NavBarButton onClick={() => setTab('audio')} active={tab === 'audio'}>
					Audio
				</NavBarButton>

				<RightSide>
					<HostName>
						<span>Host</span>
						<br />
						{host?.name}
						<br />
						{host?.pronouns}
					</HostName>
					{/* <ReadyButton
						style={{ background: live ? '#0066ff' : '#ff0000' }}>
						{buttonText}
					</ReadyButton> */}
				</RightSide>
			</NavBar>
			<Body>{currentTabBody}</Body>
		</div>
	);
};

createRoot(document.getElementById('root')!).render(<RunnerTablet />);
