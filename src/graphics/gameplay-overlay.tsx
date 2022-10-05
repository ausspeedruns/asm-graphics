import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useListenFor, useReplicant } from 'use-nodecg';
import _ from 'underscore';

// import { CurrentOverlay } from '../types/CurrentOverlay';
import { RunDataActiveRun, RunDataArray } from '../types/RunData';
import { Timer } from '../types/Timer';
import { CouchInformation, NoCam, OverlayRef } from '../types/OverlayProps';

// import { TickerOverlay } from './ticker';
import { Standard } from './overlays/standard';
import { Standard2 } from './overlays/standard-2';
import { Widescreen } from './overlays/widescreen';
import { Widescreen2 } from './overlays/widescreen-2';
import { Widescreen3 } from './overlays/widescreen-3';
import { Widescreen1610 } from './overlays/widescreen16-10';
import { DS } from './overlays/ds';
import { GBA } from './overlays/gba';
import { GBC } from './overlays/gbc';
import { DS2 } from './overlays/ds2';
import { WHG } from './overlays/whg11-8';
import { ThreeDS } from './overlays/3ds';
import { CreditsOverlay } from './overlays/credits';
import { Asset } from '../types/nodecg';
import { Tweet } from '../types/Twitter';
import { OBSAudioIndicator } from '../types/Audio';

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
	const [hostNamesRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', {
		current: [],
		preview: [],
	});
	// const [currentOverlayRep] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const [noCamRep] = useReplicant<NoCam, NoCam>('no-cam', { current: false, preview: false });
	const [sponsorsRep] = useReplicant<Asset[], Asset[]>('assets:sponsors', []);
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	const [obsAudioIndicatorRep] = useReplicant<OBSAudioIndicator[], OBSAudioIndicator[]>('obs-audio-indicator', []);
	const [displayingRun, setDisplayingRun] = useState<RunDataActiveRun>(undefined);
	const overlayRefs = useRef<OverlayRef[]>([]);

	console.log(audioIndicatorRep)

	const overlayArgs = {
		runData: displayingRun,
		timer: timerRep,
		couchInformation: hostNamesRep,
		preview: props.preview,
		noCam: noCamRep,
		sponsors: sponsorsRep,
		obsAudioIndicator: obsAudioIndicatorRep,
	};

	// console.log(displayingRun)

	const Overlays = [
		{
			component: <Standard {...overlayArgs} ref={(el: OverlayRef) => (overlayRefs.current[0] = el)} />,
			name: '',
			// Defualt as standard
		},
		{
			component: <Standard {...overlayArgs} ref={(el: OverlayRef) => (overlayRefs.current[1] = el)} />,
			name: 'Standard',
		},
		{
			component: <Standard2 {...overlayArgs} audioIndicator={audioIndicatorRep} ref={(el: OverlayRef) => (overlayRefs.current[2] = el)} />,
			name: 'Standard-2',
		},
		{
			component: <Widescreen {...overlayArgs} ref={(el: OverlayRef) => (overlayRefs.current[3] = el)} />,
			name: 'Widescreen',
		},
		{
			component: <Widescreen2 {...overlayArgs} audioIndicator={audioIndicatorRep} ref={(el: OverlayRef) => (overlayRefs.current[4] = el)} />,
			name: 'Widescreen-2',
		},
		{
			component: <Widescreen3 {...overlayArgs} audioIndicator={audioIndicatorRep} />,
			name: 'Widescreen-3',
		},
		{
			component: <Widescreen1610 {...overlayArgs} ref={(el: OverlayRef) => (overlayRefs.current[5] = el)} />,
			name: 'Widescreen-1610',
		},
		{
			component: <DS {...overlayArgs} />,
			name: 'DS',
		},
		{
			component: <DS2 {...overlayArgs} />,
			name: 'DS-2',
		},
		{
			component: <GBA {...overlayArgs} ref={(el: OverlayRef) => (overlayRefs.current[6] = el)} />,
			name: 'GBA',
		},
		{
			component: <GBC {...overlayArgs} />,
			name: 'GBC',
		},
		{
			component: <WHG {...overlayArgs} />,
			name: 'WHG',
		},
		{
			component: <ThreeDS {...overlayArgs} />,
			name: '3DS',
		},
		{
			component: <CreditsOverlay />,
			name: 'None',
		},
	];

	// Overlays.forEach((overlay, i) => {
	// 	// if (overlay.component.props.ref) {
	// 		overlay.component.props.ref = (el: OverlayRef) => (overlayRefs.current[i] = el);
	// 	// }
	// });

	useListenFor('showTweet', (newVal: Tweet) => {
		console.log(overlayRefs.current);
		overlayRefs.current.forEach((ref) => {
			if (ref) ref.showTweet?.(newVal);
		});
	});

	useEffect(() => {
		if (props.preview) {
			nodecg.readReplicant('runDataArray', 'nodecg-speedcontrol', (runData: RunDataArray) => {
				nodecg.readReplicant(
					'runDataActiveRunSurrounding',
					'nodecg-speedcontrol',
					(surrounding: { previous?: string; current?: string; next?: string }) => {
						setDisplayingRun(runData.find((run) => run.id === surrounding.next));
					},
				);
			});
		} else {
			setDisplayingRun(runDataActiveRep);
		}
	}, [runDataActiveRep]);

	const RouteData = Overlays.map((overlay) => {
		return <Route path={`/${overlay.name}`} key={overlay.name} element={overlay.component} />;
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
				<Routes>{RouteData}</Routes>
				{/* <TickerOverlay /> */}
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

createRoot(document.getElementById('root')!).render(<GameplayRouterParent />);
