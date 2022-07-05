import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { format } from 'date-fns';
import { useFetch } from 'use-http';

import { RunDataArray, RunDataActiveRun } from '../types/RunData';
import { Tweet as ITweet } from '../types/Twitter';
import { CouchInformation, CouchPerson } from '../types/OverlayProps';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import { InterNextRunItem, EndRunItem } from './elements/intermission/next-run-item';
import Mic from '@mui/icons-material/Mic';

// import { Sponsors } from './elements/sponsors';
import { Tweet } from './elements/tweet';

import MusicIconImg from './media/MusicIcon.svg';
import ASMLogo from './media/ASM2022 Logo.svg';
import IncentivesImg from './media/pixel/IncentivesBG.png';
import { Asset } from '../types/nodecg';
import { SponsorsBox } from './elements/sponsors';
import { Goal, War } from '../types/Incentives';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Noto Sans;
`;

const Half = styled.div`
	height: 100%;
	width: 955px;
	position: relative;
`;

const NextRuns = styled.div`
	color: var(--text-light);
	font-family: Noto Sans;
	width: 100%;
	height: 260px;
	background: var(--main);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 55px;
`;

const RunsList = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	gap: 15px;
`;

const IncentiveBlock = styled.div`
	color: var(--text-light);
	font-family: Noto Sans;
	width: 100%;
	margin-top: 46px;
	height: 220px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MiddleContent = styled.div`
	margin: 0 32px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
`;

const Music = styled.div`
	text-align: center;
`;

const BottomBlock = styled.div`
	position: absolute;
	bottom: 0;
	height: 268px;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const TweetBox = styled.div`
	opacity: 0;
	margin-top: -10px;
	position: absolute;
	height: 100%;
	width: 100%;
`;

const Time = styled.span`
	font-weight: bold;
	font-size: 33px;
	color: var(--text-light);
	margin-bottom: -20px;
`;

const HostName = styled.div`
	font-size: 28px;
	color: var(--text-light);
	display: flex;
	align-items: center;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-family: Noto Sans;
	font-weight: 400;
	color: var(--main);
	text-transform: uppercase;
	margin-left: 8px;
	background: #ffffff;
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
`;

const MusicLabel = styled.div`
	width: 320px;
	color: var(--text-light);
	font-size: 22px;
	white-space: nowrap;
	margin: 0 16px;
`;

const MusicIcon = styled.img`
	height: 34px;
	width: auto;
`;

const BottomColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	height: 100%;
	width: 50%;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
	flex-grow: 1;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<Asset[], Asset[]>('assets:sponsors', []);
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostName] = useReplicant<CouchInformation, CouchInformation>('couch-names', { current: [], preview: [] });
	const [donationRep] = useReplicant<number, number>('donationTotal', 100);

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor('showTweet', (newVal: ITweet) => {
		if (intermissionRef.current) intermissionRef.current.showTweet(newVal);
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
		/>
	);
};

interface IntermissionRef {
	showTweet: (newVal: ITweet) => void;
	showHyperX: () => void;
	showGoC: () => void;
}

interface IntermissionProps {
	activeRun: RunDataActiveRun;
	runArray: RunDataArray;
	host?: CouchPerson;
	donation: number;
	muted?: boolean;
	sponsors?: Asset[];
	incentives?: (Goal | War)[];
}

export const IntermissionElement = forwardRef<IntermissionRef, IntermissionProps>((props, ref) => {
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [currentSong, setCurrentSong] = useState('');
	const songEl = useRef<HTMLDivElement>(null);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);
	const tweetRef = useRef<HTMLDivElement>(null);
	const asLogoRef = useRef<HTMLImageElement>(null);
	const { get, cache } = useFetch('https://rainwave.cc/api4');

	async function getCurrentSong() {
		const song = await get('/info_all?sid=2');
		cache.clear();
		setCurrentSong(
			`${song.all_stations_info[2].title} – ${song.all_stations_info[2].artists} – ${song.all_stations_info[2].album}`,
		);
	}

	useEffect(() => {
		getCurrentSong();
		setCurrentTime(format(new Date(), 'E d h:mm:ss a'));

		const interval = setInterval(() => {
			setCurrentTime(format(new Date(), 'E d h:mm:ss a'));
		}, 500);
		const songInterval = setInterval(() => {
			getCurrentSong();
		}, 3000);

		return () => {
			clearInterval(interval);
			clearInterval(songInterval);
		};
	}, []);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			setTweet(newVal);
			const tl = gsap.timeline();
			tl.set(tweetRef.current, { opacity: 0 });
			tl.to(asLogoRef.current, { opacity: 0, duration: 1 });
			tl.to(tweetRef.current, { opacity: 1, duration: 1 });
			tl.to(tweetRef.current, { opacity: 0, duration: 1 }, '+=10');
			tl.to(asLogoRef.current, { opacity: 1, duration: 1 });
		},
		showGoC() {},
		showHyperX() {},
	}));

	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.activeRun?.id);
	const nextRuns = clone(props.runArray)
		.slice(currentRunIndex + 1)
		.slice(0, 3);

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
			<Half style={{ backgroundColor: 'var(--main)', borderRight: '10px solid var(--sec)' }}>
				<InterCTA donation={props.donation} style={{ zIndex: 1 }} />
				<NextRuns>
					<Time>{currentTime}</Time>
					<RunsList>
						{NextRun}
						{RunsArray}
					</RunsList>
				</NextRuns>

				<img src={IncentivesImg} style={{ position: 'absolute', left: -25, top: 424 }} />
				<MiddleContent>
					<IncentiveBlock>
						<InterIncentives incentives={props.incentives ?? []} />
					</IncentiveBlock>
				</MiddleContent>
				<BottomBlock>
					<BottomColumn>
						<SponsorBoxS sponsors={props.sponsors ?? []} sponsorStyle={SponsorsSize} />
					</BottomColumn>
					<BottomColumn>
						<img src={ASMLogo} style={{ height: 'auto', width: 360 }} />
						{props.host && (
							<HostName>
								<Mic />
								{props.host.name}{' '}
								{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
							</HostName>
						)}
						<Music>
							<audio id="intermission-music" autoPlay preload="auto" muted={props.muted}>
								<source
									type="audio/mp3"
									src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ"
								/>
							</audio>
							<div style={{ display: 'flex' }}>
								<MusicIcon src={MusicIconImg} />
								<MusicLabel ref={songEl}>
									{/* @ts-ignore */}
									<marquee>{currentSong}</marquee>
								</MusicLabel>
								<MusicIcon src={MusicIconImg} />
							</div>
						</Music>
					</BottomColumn>
				</BottomBlock>
			</Half>
			<Half></Half>
		</IntermissionContainer>
	);
});

createRoot(document.getElementById('root')!).render(<Intermission />);
