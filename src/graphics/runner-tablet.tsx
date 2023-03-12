import { createRoot } from 'react-dom/client';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useListenFor, useReplicant } from 'use-nodecg';
import useCountdown from 'react-countdown-hook';

import type { Timer } from '@asm-graphics/types/Timer';
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

const TIME_TIL_TRANSITION = 30 * 1000;

const RunnerTablet: React.FC = () => {
	const [tab, setTab] = useState<TabsValues>('audio');
	const [couchNames] = useReplicant<CouchPerson[], CouchPerson[]>('couch-names', []);
	const [runnerReadyRep] = useReplicant<boolean, boolean>('runner:ready', false);
	const [timerRep] = useReplicant<Timer, undefined>('timer', undefined, { namespace: 'nodecg-speedcontrol' });

	const [live, setLive] = useState(false);
	const [timeLeft, { start }] = useCountdown(0, 100);

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

	function toggleReady() {
		nodecg.sendMessage(runnerReadyRep ? 'runner:setNotReady' : 'runner:setReady');
	}

	useEffect(() => {
		if (timerRep?.state === 'finished') {
			restart();
		}
	}, [timerRep?.state]);

	const restart = useCallback(() => {
		// you can start existing timer with an arbitrary value
		// if new value is not passed timer will start with initial value
		const newTime = TIME_TIL_TRANSITION;
		start(newTime);
	}, []);

	useListenFor('transition:toGame', () => {
		setLive(true);
	});

	useListenFor('transition:toIntermission', () => {
		setLive(false);
	});

	let buttonText = 'ERROR';
	if (timeLeft > 0) {
		buttonText = (timeLeft/1000).toFixed(1).toString();
	} else if (live) {
		buttonText = 'LIVE';
	} else if (runnerReadyRep) {
		buttonText = 'READY!';
	} else {
		buttonText = 'READY UP';
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
					<ReadyButton
						onClick={toggleReady}
						style={{ background: live ? '#0066ff' : runnerReadyRep ? '#5ab95a' : '#ff0000' }}>
						{buttonText}
					</ReadyButton>
				</RightSide>
			</NavBar>
			<Body>{currentTabBody}</Body>
		</div>
	);
};

createRoot(document.getElementById('root')!).render(<RunnerTablet />);
