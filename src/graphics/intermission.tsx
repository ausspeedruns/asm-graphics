import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { useFetch } from 'use-http';

import { RunDataArray, RunDataActiveRun } from '../types/RunData';
import { Tweet as ITweet } from '../types/Twitter';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import {
	InterNextRunItem,
	EndRunItem,
} from './elements/intermission/next-run-item';

import { Sponsors } from './elements/sponsors';

import { Tweet } from './elements/tweet';
import { OrangeStripe } from './elements/orange-stripe';
import { CouchPerson } from '../types/OverlayProps';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Noto Sans;
`;

const NextRuns = styled.div`
	color: #ffffff;
	font-family: Noto Sans;
	width: 560px;
	height: 100%;
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	align-items: center;

	& > div {
		margin-top: 10px;
	}
`;

const RunsList = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	flex-grow: 1;
	padding-bottom: 10px;

	/* & > div {
		margin-top: 10px;
	} */
`;

const IncentiveBlock = styled.div`
	color: #ffffff;
	font-family: Noto Sans;
	width: 560px;
	height: 100%;
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MiddleContent = styled.div`
	margin: 0 32px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
`;

const SponsorHolder = styled.div`
	display: flex;
	justify-content: space-around;
	width: 400px;
	height: 200px;
`;

const SponsorImg = styled.img`
	object-fit: contain;
	height: 120px;
	width: 100%;
	z-index: 2;
`;

const Music = styled.div`
	text-align: center;
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 490px;
	height: 590px;
	width: 100%;
	background: rgba(43, 49, 92, 0.8);
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
	font-style: italic;
	color: #ffffff;
`;

const LocationBug = styled.div`
	position: absolute;
	background: #ffffff;
	border: 1px solid var(--asm-orange);
	width: 250px;
	height: 50px;
	font-size: 32px;
	text-align: center;
	line-height: 50px;
	color: var(--main-col);
`;

const HostName = styled.div`
	font-size: 28px;
	color: #ffffff;
	display: flex;
	align-items: center;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-family: Work Sans, serif;
	font-weight: 400;
	color: #ffffff;
	text-transform: uppercase;
	margin-left: 8px;
	background: var(--sec-col);
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
`;

const MusicLabel = styled.div`
	width: 410px;
	color: #ffffff;
	font-size: 22px;
	white-space: nowrap;
	margin: 0 16px;
`;

const MusicIcon = styled.img`
	height: 34px;
	width: auto;
`;

const BottomInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > * {
		margin: 4px 0;
	}
`;

interface IntermissionProps {
	muted?: boolean;
}

export const Intermission: React.FC<IntermissionProps> = (
	props: IntermissionProps,
) => {
	const [runDataArrayRep] = useReplicant<RunDataArray, []>(
		'runDataArray',
		[],
		{ namespace: 'nodecg-speedcontrol' },
	);
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>(
		'runDataActiveRun',
		undefined,
		{
			namespace: 'nodecg-speedcontrol',
		},
	);
	const [hostName] = useReplicant<CouchPerson, CouchPerson>('host', {
		name: '',
		pronouns: '',
	});
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [currentSong, setCurrentSong] = useState('');
	const songEl = useRef<HTMLDivElement>(null);
	const [songOverflowing, setSongOverflowing] = useState(false);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);
	const tweetRef = useRef<HTMLDivElement>(null);
	const asLogoRef = useRef<HTMLImageElement>(null);
	const { get } = useFetch('https://rainwave.cc/api4');

	async function getCurrentSong() {
		const song = await get('/info_all?sid=2');
		setCurrentSong(
			`${song.all_stations_info[2].title} – ${song.all_stations_info[2].artists} – ${song.all_stations_info[2].album}`,
		);
	}

	useEffect(() => {
		getCurrentSong();
		setCurrentTime(new Date().toLocaleTimeString('en-GB'));

		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString('en-GB'));
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
		setSongOverflowing(
			songEl.current.offsetWidth < songEl.current.scrollWidth,
		);
	}, [songEl, currentSong]);

	useListenFor('showTweet', (newVal: ITweet) => {
		setTweet(newVal);
		const tl = gsap.timeline();
		tl.set(tweetRef.current, { opacity: 0 });
		tl.to(asLogoRef.current, { opacity: 0, duration: 1 });
		tl.to(tweetRef.current, { opacity: 1, duration: 1 });
		tl.to(tweetRef.current, { opacity: 0, duration: 1 }, '+=10');
		tl.to(asLogoRef.current, { opacity: 1, duration: 1 });
	});

	const currentRunIndex = runDataArrayRep.findIndex(
		(run) => run.id === runDataActiveRep?.id,
	);
	const nextFiveRuns = clone(runDataArrayRep)
		.slice(currentRunIndex + 1)
		.slice(0, 5);

	let NextRun;
	if (nextFiveRuns.length !== 0) {
		NextRun = (
			<InterNextRunItem run={nextFiveRuns[0]} key={nextFiveRuns[0].id} />
		);
	}

	nextFiveRuns.shift();
	const RunsArray = nextFiveRuns.map((run) => {
		return <InterNextRunItem run={run} key={run.id} />;
	});

	if (RunsArray.length < 4) {
		RunsArray.push(<EndRunItem key="end" />);
	}

	return (
		<IntermissionContainer>
			<InterCTA style={{ position: 'absolute', top: 375 }} />
			<LocationBug style={{ top: 324, left: 54 }}>
				Adelaide, SA
			</LocationBug>
			<BottomBlock>
				<div style={{ display: 'flex' }}>
					<OrangeStripe side="right" />
					<IncentiveBlock>
						<b style={{ fontSize: 40 }}>Incentives</b>
						<InterIncentives />
					</IncentiveBlock>
					<OrangeStripe side="left" />
				</div>
				<MiddleContent>
					<SponsorHolder
						style={{ position: 'relative', alignItems: 'center' }}>
						<SponsorImg
							ref={asLogoRef}
							src="../shared/design/ASM-White.svg"
						/>
						<TweetBox ref={tweetRef}>
							<Tweet
								style={{
									width: '100%',
									margin: 0,
									justifyContent: 'center',
								}}
								tweet={tweet}
							/>
						</TweetBox>
					</SponsorHolder>
					<SponsorHolder>
						<Sponsors />
					</SponsorHolder>
					<BottomInfo>
						<Time>{currentTime}</Time>
						<HostName>
							{hostName.name}{' '}
							{hostName.pronouns && (
								<HostPronoun>{hostName.pronouns}</HostPronoun>
							)}
						</HostName>
						<Music>
							<audio
								id="intermission-music"
								autoPlay
								preload="auto"
								muted={props.muted}>
								<source
									type="audio/mp3"
									src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ"
								/>
							</audio>
							<div style={{ display: 'flex' }}>
								<MusicIcon src="../shared/design/MusicIcon.svg" />
								<MusicLabel ref={songEl}>
									{songOverflowing ? (
										// @ts-ignore
										<marquee>{currentSong}</marquee>
									) : (
										<span>{currentSong}</span>
									)}
								</MusicLabel>
								<MusicIcon src="../shared/design/MusicIcon.svg" />
							</div>
						</Music>
					</BottomInfo>
				</MiddleContent>
				<div style={{ display: 'flex' }}>
					<OrangeStripe side="right" />
					<NextRuns>
						<b style={{ fontSize: 40 }}>Next Run</b>
						{NextRun}
						<b style={{ fontSize: 30, marginTop: 5 }}>Soon</b>
						<RunsList>
							{RunsArray}
						</RunsList>
					</NextRuns>
					<OrangeStripe side="left" />
				</div>
			</BottomBlock>
		</IntermissionContainer>
	);
};

if (document.getElementById('intermission')) {
	render(<Intermission />, document.getElementById('intermission'));
}
