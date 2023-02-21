import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled, { keyframes } from 'styled-components';
import { createRoot } from 'react-dom/client';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
// import gsap from 'gsap';
import { format } from 'date-fns';

import { RunDataArray, RunDataActiveRun } from '@asm-graphics/types/RunData';
import { Tweet as ITweet } from '@asm-graphics/types/Twitter';
import { CouchPerson } from '@asm-graphics/types/OverlayProps';
import type NodeCG from '@alvancamp/test-nodecg-types';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import { InterNextRunItem, EndRunItem } from './elements/intermission/next-run-item';
import Mic from '@mui/icons-material/Mic';

// import { SponsorsBox } from './elements/sponsors';
import { Goal, War } from '@asm-graphics/types/Incentives';

// @ts-ignore
import Twemoji from 'react-twemoji';
import _ from 'underscore';

// Assets
import MusicIconImg from './media/MusicIcon.svg';
import ASGXBorder from './media/ASGX23/border.webm';
import ASGXLogo from './media/ASGX23/ASGX23Logo.png';
import { Egg } from './elements/greeble/tgx/egg';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	/* clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 960 V 120 H 0'); */
`;

const ClippedBackground = styled.div`
	height: 1080px;
	width: 1920px;
	position: absolute;
	clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 945 V 120 H 0');
	background: var(--main);
`;

const Half = styled.div`
	height: 100%;
	width: 954px;
	position: relative;
	overflow: hidden;
`;

const NextRuns = styled.div`
	color: var(--text-light);
	width: 100%;
	height: 390px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 37px;
	z-index: 2;
`;

const RunsList = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	gap: 16px;
	z-index: 1;
	/* margin-top: 10px; */
	padding: 16px;
	box-sizing: border-box;
`;

const FutureRuns = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
	height: 100%;
	gap: 16px;
`;

const DirectNextRun = styled.div`
	flex-grow: 1;
	height: 100%;
	min-width: 454px;
`;

const IncentiveBlock = styled.div`
	color: var(--text-light);
	font-family: var(--main-font);
	width: 100%;
	margin-top: 46px;
	height: 220px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MiddleContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	z-index: 10;
	position: absolute;
	top: 690px;
	width: 100%;
`;

const Music = styled.div`
	text-align: center;
	margin-top: 20px;
`;

const BottomBlock = styled.div`
	position: absolute;
	bottom: 0;
	height: 113px;
	width: 100%;
	display: flex;
	justify-content: center;
	box-sizing: border-box;
`;

const Time = styled.span`
	font-weight: bold;
	font-size: 38px;
	color: var(--text-light);
	margin-bottom: 11px;
	z-index: 1;
	font-family: var(--mono-font);
`;

const HostName = styled.div`
	font-size: 28px;
	color: var(--text-light);
	display: flex;
	align-items: center;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-family: var(--secondary-font);
	font-weight: 400;
	color: #000000;
	text-transform: uppercase;
	margin-left: 8px;
	background: var(--sec);
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
`;

const MusicLabel = styled.div`
	width: 520px;
	color: var(--text-light);
	font-size: 28px;
	white-space: nowrap;
	margin: 0 16px;
	font-family: var(--secondary-font);
	position: relative;
`;

const StaticMusicText = styled.span`
	position: absolute;
	width: 520px;
	text-align: center;
	top: 0;
	left: 0;
`;

const MusicIcon = styled.img`
	height: 34px;
	width: auto;
`;

const MusicMarquee = styled.div`
	width: 520px;
	margin: 0 auto;
	overflow: hidden;
	box-sizing: border-box;
	color: var(--text-light);
`;

const MarqueeKeyframes = keyframes`
	0% { transform: translate(0, 0); }
	100% { transform: translate(-100%, 0); }
`;

const MarqueeText = styled.span`
	display: inline-block;
	width: max-content;

	padding-left: 100%;
	/* show the marquee just outside the paragraph */
	will-change: transform;
	animation: ${MarqueeKeyframes} linear infinite;
`;

const LocationBug = styled.div`
	color: var(--text-dark);
	background: var(--sec);
	width: fit-content;
	padding: 10px;
	font-size: 21px;
	font-weight: bold;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	width: 95.5%;
`;

// ASGX
const ASGXBorderVideo = styled.video`
	position: absolute;
	z-index: 100;
	transform: scale(0.66);
	left: -256px;
	top: -120px;
	pointer-events: none;
`;

const ASGXLogoContainer = styled.div`
	/* background: var(--main); */
	height: 135px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ASGXCameraBox = styled.div`
	height: 757px;
`;

const ASGXBottomBar = styled.div`
	/* background: var(--main); */
	height: 143px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const RedEgg = styled(Egg)`
	position: absolute;
	transform: rotate(-49deg);
	top: 887px;
	left: 1703px;
`;

const YellowEgg = styled(Egg)`
	position: absolute;
	transform: rotate(-148deg);
	top: -78px;
	left: 1771px;
`;

const BlueEgg = styled(Egg)`
	position: absolute;
	transform: rotate(130deg);
	top: -54px;
	left: -126px;
`;

const GreenEgg = styled(Egg)`
	position: absolute;
	transform: rotate(32deg);
	top: 972px;
	left: -71px;
`;

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[], NodeCG.AssetFile[]>('assets:sponsors', []);
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostName] = useReplicant<CouchPerson[], CouchPerson[]>('couch-names', []);
	const [donationRep] = useReplicant<number, number>('donationTotal', 100);
	const [manualDonationRep] = useReplicant<number, number>('manual-donation-total', 0);

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor('showTweet', (newVal: ITweet) => {
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
			donation={donationRep + manualDonationRep}
			host={hostName.find((person) => person.host)}
			sponsors={sponsorsRep}
			incentives={incentivesRep}
		/>
	);
};

export interface IntermissionRef {
	showTweet: (newVal: ITweet) => void;
	showAd: (ad: string) => void;
}

interface IntermissionProps {
	activeRun: RunDataActiveRun;
	runArray: RunDataArray;
	host?: CouchPerson;
	donation: number;
	muted?: boolean;
	sponsors?: NodeCG.AssetFile[];
	incentives?: (Goal | War)[];
}

export const IntermissionElement = forwardRef<IntermissionRef, IntermissionProps>((props, ref) => {
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [currentSong, setCurrentSong] = useState('');
	const [showMarquee, setShowMarquee] = useState(false);
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const bottomBlockRef = useRef<HTMLDivElement>(null);

	async function getCurrentSong() {
		const song = await fetch('https://rainwave.cc/api4/info_all?sid=2', { method: 'GET' });
		const songJson = await song.json();
		setCurrentSong(
			`${songJson.all_stations_info[2].title} – ${songJson.all_stations_info[2].artists} – ${songJson.all_stations_info[2].album}`,
		);
	}

	useEffect(() => {
		getCurrentSong();
		setCurrentTime(format(new Date(), 'E do MMM - h:mm:ss a'));

		const interval = setInterval(() => {
			setCurrentTime(format(new Date(), 'E do MMM - h:mm:ss a'));
		}, 500);
		const songInterval = setInterval(() => {
			getCurrentSong();
		}, 3000);

		return () => {
			clearInterval(interval);
			clearInterval(songInterval);
		};
	}, []);

	useEffect(() => {
		if (!songEl.current) return;
		setShowMarquee(songEl.current.offsetWidth < songEl.current.scrollWidth);
	}, [currentSong, songEl]);

	useImperativeHandle(ref, () => ({
		showTweet(_newVal) {},
		showAd(_ad) {},
	}));

	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.activeRun?.id);
	const nextRuns = clone(props.runArray).slice(currentRunIndex).slice(0, 3);
	// .slice(currentRunIndex + 1)

	let NextRun;
	if (nextRuns.length !== 0) {
		NextRun = <InterNextRunItem nextRun run={nextRuns[0]} key={nextRuns[0].id} />;
	}

	nextRuns.shift();
	const RunsArray = nextRuns.map((run) => {
		return <InterNextRunItem run={run} key={run.id} />;
	});

	if (RunsArray.length < 2) {
		RunsArray.push(<EndRunItem key="end" />);
	}

	return (
		<IntermissionContainer>
			<ClippedBackground>
				<RedEgg colour="Red" />
				<YellowEgg colour="Yellow" />
				<BlueEgg colour="Blue" />
				<GreenEgg colour="Green" />
			</ClippedBackground>
			<Half>
				<ASGXLogoContainer>
					<img src={ASGXLogo} width="auto" height="77" style={{ marginTop: -23 }} />
				</ASGXLogoContainer>
				<ASGXCameraBox />
				<LocationBug>
					<span>The Game Expo 2023</span>
					<span>Melbourne Exhibition Centre</span>
				</LocationBug>
				<ASGXBottomBar>
					<Music>
						<audio
							style={{ transform: 'translate(100px, 0px)' }}
							id="intermission-music"
							autoPlay
							preload="auto"
							muted={props.muted}
							ref={audioRef}>
							<source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" />
						</audio>
						<div style={{ display: 'flex' }}>
							<MusicIcon src={MusicIconImg} />
							{/* <MusicLabel ref={songEl}>
								<marquee>{currentSong}</marquee>
							</MusicLabel> */}
							<MusicLabel>
								<MusicMarquee style={{opacity: showMarquee ? 1 : 0}}>
									<MarqueeText style={{animationDuration: `${currentSong.length * 0.35}s`}}>{currentSong}</MarqueeText>
								</MusicMarquee>
								<StaticMusicText ref={songEl} style={{opacity: showMarquee ? 0 : 1}}>{currentSong}</StaticMusicText>
							</MusicLabel>
							<MusicIcon src={MusicIconImg} />
						</div>
					</Music>
				</ASGXBottomBar>
			</Half>
			<Half style={{ width: 966 }}>
				<NextRuns>
					<Time>{currentTime}</Time>
					<RunsList>
						<DirectNextRun>{NextRun}</DirectNextRun>
						<FutureRuns>{RunsArray}</FutureRuns>
					</RunsList>
				</NextRuns>
				<InterCTA donation={props.donation} style={{ zIndex: 1 }} />
				<MiddleContent>
					<IncentiveBlock>
						<InterIncentives incentives={props.incentives ?? []} />
					</IncentiveBlock>
				</MiddleContent>
				<BottomBlock ref={bottomBlockRef}>
					{props.host && (
						<HostName>
							<Mic style={{ height: '2.5rem', width: '2.5rem' }} />
							{props.host.name}
							{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
						</HostName>
					)}
				</BottomBlock>
			</Half>
			<ASGXBorderVideo src={ASGXBorder} autoPlay loop muted />
		</IntermissionContainer>
	);
});

createRoot(document.getElementById('root')!).render(<Intermission />);
