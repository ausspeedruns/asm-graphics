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

import MusicIconImg from './media/MusicIcon.svg';
import ASMLogo from './media/ASM2022 Logo.svg';
import IncentivesImg from './media/pixel/IncentivesBG.png';
import { Asset } from '../types/nodecg';
import { SponsorsBox } from './elements/sponsors';
import { Goal, War } from '../types/Incentives';
import { IntermissionAds, IntermissionAdsRef } from './elements/intermission/ad';

// @ts-ignore
import Twemoji from 'react-twemoji';
import _ from 'underscore';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Noto Sans;
	display: flex;
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
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	z-index: 10;
	position: absolute;
	top: 500px;
	width: 100%;
`;

const Music = styled.div`
	text-align: center;
`;

const BottomBlock = styled.div`
	position: absolute;
	bottom: 0;
	height: 311px;
	width: 100%;
	display: flex;
	justify-content: center;
	background-color: var(--main-dark);
	box-sizing: border-box;
	padding-top: 43px;
`;

const Time = styled.span`
	font-weight: bold;
	font-size: 33px;
	color: var(--text-light);
	margin-bottom: -10px;
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

const RightHalfContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
`;

// const RightHalfBottomBar = styled.div`
// 	width: 100%;
// 	height: fit-content;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	gap: 20px;
// 	margin-bottom: 110px;
// `;

const LocationBug = styled.div`
	color: var(--text-light);
	background: var(--sec);
	width: fit-content;
	padding: 10px;
	font-size: 50px;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* margin-bottom: 110px; */
`;

const Tweet = styled.div`
	width: 500px;
	height: 200px;
	background: var(--main-dark);
	color: var(--text-light);
	margin: 20px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	opacity: 0;
`;

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

	useListenFor('playAd', (newVal: string) => {
		if (intermissionRef.current) intermissionRef.current.showAd(newVal);
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

const TwitterLogo = styled.img`
	height: 22px;
	width: auto;
	margin: 0 6px;
`;

const TweetText = styled.div`
	padding: 13px 20px;
	padding-top: 0;
	text-align: center;

	& .emoji {
		height: 1.2em;
		width: 1.2em;
		margin: 0 0.05em 0 0.1em;
		vertical-align: -0.1em;
	}
`;

const Username = styled.span`
	font-weight: bold;
	font-size: 16px;
	margin-right: 6px;
`;

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
	sponsors?: Asset[];
	incentives?: (Goal | War)[];
}

export const IntermissionElement = forwardRef<IntermissionRef, IntermissionProps>((props, ref) => {
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [currentSong, setCurrentSong] = useState('');
	const songEl = useRef<HTMLDivElement>(null);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);
	const tweetRef = useRef<HTMLDivElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
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

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			setTweet(newVal);
			const tl = gsap.timeline();
			tl.set(tweetRef.current, { opacity: 0 });
			tl.to(tweetRef.current, { opacity: 1, duration: 1 });
			tl.to(tweetRef.current, { opacity: 0, duration: 1 }, '+=20');
		},
		showAd(ad) {
			let adDuration = 0;
			switch (ad) {
				case 'HyperX':
					adDuration = 30;
					break;

				case 'GOC':
					adDuration = 43;
					break;
				default:
					return;
			}

			if (adsRef.current) {
				if (!audioRef.current) return;

				const tl = gsap.timeline();
				tl.set(audioRef.current, { x: 1 });
				tl.to(audioRef.current, {
					x: 0,
					duration: 5,
					onUpdate: () => {
						if (!audioRef.current) return;
						const dummyElPos = gsap.getProperty(audioRef.current, 'x') ?? 0;
						audioRef.current.volume = parseFloat(dummyElPos.toString());
					},
				});
				tl.call(() => adsRef.current?.showAd(ad));
				tl.to(
					audioRef.current,
					{
						x: 1,
						duration: 5,
						onUpdate: () => {
							if (!audioRef.current) return;
							const dummyElPos = gsap.getProperty(audioRef.current, 'x') ?? 0;
							audioRef.current.volume = parseFloat(dummyElPos.toString());
						},
					},
					`+=${adDuration + 10}`,
				);
			}
		},
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

	const dangerBold = () => {
		if (tweet) {
			const tweetText = tweet.data.text.replace('#ASM2022', '<b>#ASM2022</b>');
			return { __html: _.unescape(tweetText) };
		}

		return { __html: '' };
	};

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

				<img src={IncentivesImg} style={{ position: 'absolute', left: -25, top: 424, zIndex: 3 }} />
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
								{props.host.name}
								{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
							</HostName>
						)}
						<Music>
							<audio
								style={{ transform: 'translate(100px, 0px)' }}
								id="intermission-music"
								autoPlay
								preload="auto"
								muted={props.muted}
								ref={audioRef}>
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
			<Half>
				<RightHalfContainer>
					<LocationBug>
						<span style={{ fontSize: 30 }}>in. Studio Cafe + Studio</span>
						<span>Adelaide, SA</span>
					</LocationBug>
					<Tweet ref={tweetRef}>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 13 }}>
							<TwitterLogo src={'../shared/design/Twitter white.svg'} />
							<Username>@{tweet?.includes.users[0].username}</Username>
						</div>
						<Twemoji noWrapper={true}>
							<TweetText dangerouslySetInnerHTML={dangerBold()}></TweetText>
						</Twemoji>
					</Tweet>
				</RightHalfContainer>
			</Half>
			<IntermissionAds ref={adsRef} style={{ position: 'absolute', left: 0, top: 545, zIndex: 10 }} />
		</IntermissionContainer>
	);
});

createRoot(document.getElementById('root')!).render(<Intermission />);
