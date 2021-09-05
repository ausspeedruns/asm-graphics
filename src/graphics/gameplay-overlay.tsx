import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { HashRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import { useReplicant } from 'use-nodecg';
import _ from 'underscore';

import { CurrentOverlay } from '../types/CurrentOverlay';
import { RunDataActiveRun, RunDataArray } from '../types/RunData';
import { Timer } from '../types/Timer';
import { CouchInformation, NoCam } from '../types/OverlayProps';

import { Ticker } from './ticker';
import { Standard } from './overlays/standard';
import { Standard2 } from './overlays/standard-2';
import { Widescreen } from './overlays/widescreen';
import { Widescreen2 } from './overlays/widescreen-2';
import { Widescreen1610 } from './overlays/widescreen16-10';
import { DS } from './overlays/ds';
import { GBA } from './overlays/gba';
import { GBC } from './overlays/gbc';
import { DS2 } from './overlays/ds2';
import { WHG } from './overlays/whg11-8';
import { Credits } from './elements/credits';
import { ThreeDS } from './overlays/3ds';
import { Fishing } from './overlays/fishing';

const GameplayOverlayCont = styled.div``;

const GameplayContainer = styled.div`
	height: 1080px;
	width: 1920px;
	border-right: 5px solid black;
	border-bottom: 5px solid black;
`;

const SpacedLinks = styled(Link)`
	margin: 16px 16px 0 16px;
	font-weight: bold;
	font-size: 20px;
	text-decoration: none;
	display: inline-block;
`;

interface GameplayOverlayProps {
	preview?: boolean;
}

// https://stackoverflow.com/questions/58220995/cannot-read-property-history-of-undefined-usehistory-hook-of-react-router-5
export const GameplayRouterParent: React.FC<GameplayOverlayProps> = (props: GameplayOverlayProps) => {
	return (
		<Router>
			<GameplayOverlay preview={props.preview} />
		</Router>
	);
};

const GameplayOverlay: React.FC<GameplayOverlayProps> = (props: GameplayOverlayProps) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [timerRep] = useReplicant<Timer, undefined>('timer', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostNamesRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', {current: [], preview: []});
	const [currentOverlayRep] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const [noCamRep] = useReplicant<NoCam, NoCam>('no-cam', {current: false, preview: false});
	const history = useHistory();
	const [displayingRun, setDisplayingRun] = useState<RunDataActiveRun>(undefined);
	
	console.log(displayingRun)

	const Overlays = [
		{
			component: <Standard runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: '/',
			// Defualt as standard
		},
		{
			component: <Standard runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Standard',
		},
		{
			component: <Standard2 runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Standard-2',
		},
		{
			component: <Widescreen runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Widescreen',
		},
		{
			component: <Widescreen2 runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Widescreen-2',
		},
		{
			component: <Widescreen1610 runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Widescreen-1610',
		},
		{
			component: <DS runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'DS',
		},
		{
			component: <DS2 runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'DS-2',
		},
		{
			component: <GBA runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'GBA',
		},
		{
			component: <GBC runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'GBC',
		},
		{
			component: <WHG runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'WHG',
		},
		{
			component: <ThreeDS runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: '3DS',
		},
		{
			component: <Fishing runData={displayingRun} timer={timerRep} couchInformation={hostNamesRep} preview={props.preview} noCam={noCamRep} />,
			name: 'Fishing',
		},
		{
			component: <div style={{height: 1016, position: 'relative'}}><Credits /></div>,
			name: 'None',
		},
	];

	useEffect(() => {
		if (props.preview) {
			nodecg.readReplicant('runDataArray', 'nodecg-speedcontrol', (runData: RunDataArray) => {
				nodecg.readReplicant('runDataActiveRunSurrounding', 'nodecg-speedcontrol', (surrounding: {
					previous?: string;
					current?: string;
					next?: string;
				}) => {
					setDisplayingRun(runData.find(run => run.id === surrounding.next));
				});
			});
		} else {
			setDisplayingRun(runDataActiveRep);
		}
	}, [runDataActiveRep]);

	useEffect(() => {
		if (!currentOverlayRep || !history) return;

		if (props.preview) {
			history.push(`/${currentOverlayRep?.preview}`);
		} else {
			history.push(`/${currentOverlayRep?.live}`);
		}
	}, [currentOverlayRep, history, props.preview]);

	const RouteData = Overlays.map((overlay) => {
		return (
			<Route path={`/${overlay.name}`} key={overlay.name}>
				{overlay.component}
			</Route>
		);
	});

	const DevLinks = Overlays.map((overlay) => {
		return (
			<SpacedLinks to={`/${overlay.name}`} key={overlay.name}>
				{overlay.name}
			</SpacedLinks>
		);
	});

	function changeBGColor(col: string) {
		document.body.style.background = col;
	}

	return (
		<GameplayOverlayCont>
			<GameplayContainer>
				<Switch>{RouteData}</Switch>
				<Ticker />
			</GameplayContainer>

			{DevLinks}
			<div>
				<button onClick={() => changeBGColor('#000')}>Black</button>
				<button onClick={() => changeBGColor('#f00')}>Red</button>
				<button onClick={() => changeBGColor('#0f0')}>Green</button>
				<button onClick={() => changeBGColor('#00f')}>Blue</button>
				<button onClick={() => changeBGColor('rgba(0, 0, 0, 0)')}>Transparent</button>
				<button onClick={() => nodecg.sendMessage('start-credits')}>Credits</button>
			</div>
		</GameplayOverlayCont>
	);
};

if (document.getElementById('GameplayOverlay')) {
	render(<GameplayRouterParent />, document.getElementById('GameplayOverlay'));
}
