import React, { useEffect } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { HashRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import { useReplicant } from 'use-nodecg';

import { CurrentOverlay } from '../types/CurrentOverlay';

import { Ticker } from './ticker';
import { Standard } from './overlays/standard';
import { Standard2 } from './overlays/standard-2';
import { Widescreen } from './overlays/widescreen';
import { Widescreen2 } from './overlays/widescreen-2';
import { Widescreen1610 } from './overlays/widescreen16-10';
import { DS } from './overlays/ds';
import { GBA } from './overlays/gba';
import { GBC } from './overlays/gbc';

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

const Overlays = [
	{
		component: <Standard />,
		name: '/',
		// Defualt as standard
	},
	{
		component: <Standard />,
		name: 'Standard',
	},
	{
		component: <Standard2 />,
		name: 'Standard-2',
	},
	{
		component: <Widescreen />,
		name: 'Widescreen',
	},
	{
		component: <Widescreen2 />,
		name: 'Widescreen-2',
	},
	{
		component: <Widescreen1610 />,
		name: 'Widescreen-1610',
	},
	{
		component: <DS />,
		name: 'DS',
	},
	{
		component: <GBA />,
		name: 'GBA',
	},
	{
		component: <GBC />,
		name: 'GBC',
	},
	{
		component: <div style={{height: 1016}}></div>,
		name: 'None',
	},
];

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
	const [currentOverlay] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const history = useHistory();

	useEffect(() => {
		if (!currentOverlay || !history) return;

		if (props.preview) {
			history.push(`/${currentOverlay?.preview}`);
		} else {
			history.push(`/${currentOverlay?.live}`);
		}
	}, [currentOverlay, history, props.preview]);

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
			</div>
		</GameplayOverlayCont>
	);
};

if (document.getElementById('GameplayOverlay')) {
	render(<GameplayRouterParent />, document.getElementById('GameplayOverlay'));
}
