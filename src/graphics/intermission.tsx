import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { format } from 'date-fns';
// import { useFetch } from 'use-http';

import { RunDataArray, RunDataActiveRun } from '@asm-graphics/types/RunData';
import { Tweet as ITweet } from '@asm-graphics/types/Twitter';
import { CouchInformation, CouchPerson } from '@asm-graphics/types/OverlayProps';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import { InterNextRunItem, EndRunItem } from './elements/intermission/next-run-item';
import Mic from '@mui/icons-material/Mic';

// import { Sponsors } from './elements/sponsors';

import MusicIconImg from './media/MusicIcon.svg';
import ASAP2022Vertical from './media/Sponsors/PAXVertical.svg';
import { SponsorsBox } from './elements/sponsors';
import { Goal, War } from '@asm-graphics/types/Incentives';
import { IntermissionAds, IntermissionAdsRef } from './elements/intermission/ad';
import { PaxCircles } from './elements/pax-circles';

// @ts-ignore
import Twemoji from 'react-twemoji';
import _ from 'underscore';
import type NodeCG from '@alvancamp/test-nodecg-types';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Nasalization;
	display: flex;
`;

const Half = styled.div`
	height: 100%;
	width: 955px;
	position: relative;
	overflow: hidden;
`;

const PAXGlow = styled.div`
	position: absolute;
	width: 955px;
	height: 890px;
	bottom: 0;
	background: radial-gradient(50% 50% at 50% 50%, #ffc629 0%, #000000 100%);
	z-index: 0;
`;

const PAXCircles = styled(PaxCircles)`
	position: absolute;
	width: 955px;
	height: 890px;
	bottom: 0;
`;

const NextRuns = styled.div`
	color: var(--text-light);
	width: 100%;
	height: 345px;
	background: #000000;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 16px;
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

const IncentiveBlock = styled.div`
	background: linear-gradient(90deg, #7f6314 0%, #000000 33.33%, #000000 66.67%, #7f6314 100%);
	border-top: 1px solid var(--sec);
	border-bottom: 1px solid var(--sec);
	color: var(--text-light);
	font-family: Nasalization;
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
	box-sizing: border-box;
`;

const Time = styled.span`
	font-weight: bold;
	font-size: 33px;
	color: var(--text-light);
	margin-bottom: -10px;
	z-index: 1;
	font-family: NasalizationMono;
`;

const HostName = styled.div`
	font-size: 28px;
	color: var(--text-light);
	display: flex;
	align-items: center;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-family: Orbitron;
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
	width: 320px;
	color: var(--text-light);
	font-size: 22px;
	white-space: nowrap;
	margin: 0 16px;
	font-family: Orbitron;
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
	height: 230,
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
	color: var(--text-dark);
	background: var(--sec);
	width: fit-content;
	padding: 10px;
	font-size: 50px;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* margin-bottom: 110px; */
	margin: 20px 0;
`;

const Tweet = styled.div`
	width: 500px;
	height: 200px;
	background: var(--main);
	border: 1px solid var(--sec);
	color: var(--text-light);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	opacity: 0;
`;

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[], NodeCG.AssetFile[]>('assets:sponsors', []);
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostName] = useReplicant<CouchInformation, CouchInformation>('couch-names', { current: [], preview: [] });
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
	sponsors?: NodeCG.AssetFile[];
	incentives?: (Goal | War)[];
}

export const IntermissionElement = forwardRef<IntermissionRef, IntermissionProps>((props, ref) => {
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [currentSong] = useState('');
	const songEl = useRef<HTMLDivElement>(null);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);
	const tweetRef = useRef<HTMLDivElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const bottomBlockRef = useRef<HTMLDivElement>(null);
	// const { get, cache } = useFetch('https://rainwave.cc/api4');

	// async function getCurrentSong() {
	// 	const song = await get('/info_all?sid=2');
	// 	cache.clear();
	// 	setCurrentSong(
	// 		`${song.all_stations_info[2].title} – ${song.all_stations_info[2].artists} – ${song.all_stations_info[2].album}`,
	// 	);
	// }

	useEffect(() => {
		// getCurrentSong();
		setCurrentTime(format(new Date(), 'E do MMM - h:mm:ss a'));

		const interval = setInterval(() => {
			setCurrentTime(format(new Date(), 'E do MMM - h:mm:ss a'));
		}, 500);
		const songInterval = setInterval(() => {
			// getCurrentSong();
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
				tl.set(bottomBlockRef.current, { opacity: 1 });
				tl.addLabel('fadeOut');
				tl.to(
					audioRef.current,
					{
						x: 0,
						duration: 5,
						onUpdate: () => {
							if (!audioRef.current) return;
							const dummyElPos = gsap.getProperty(audioRef.current, 'x') ?? 0;
							audioRef.current.volume = parseFloat(dummyElPos.toString());
						},
					},
					'fadeOut',
				);
				tl.to(
					bottomBlockRef.current,
					{
						opacity: 0,
						duration: 5
					},
					'fadeOut',
				);
				tl.call(() => adsRef.current?.showAd(ad));
				tl.addLabel('fadeIn', `+=${adDuration + 10}`);
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
					'fadeIn',
				);
				tl.to(
					bottomBlockRef.current,
					{
						opacity: 1,
						duration: 5
					},
					'fadeIn',
				);
			}
		},
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

	const dangerBold = () => {
		if (tweet) {
			let tweetText = tweet.data.text.replace('#ASAP2022', '<b>#ASAP2022</b>');
			tweetText = tweet.data.text.replace('#PAXAUS', '<b>#PAXAUS</b>');
			return { __html: _.unescape(tweetText) };
		}

		return { __html: '' };
	};

	return (
		<IntermissionContainer>
			<Half style={{ backgroundColor: 'var(--main)', borderRight: '10px solid var(--sec)' }}>
				<PAXGlow />
				<InterCTA donation={props.donation} style={{ zIndex: 1 }} />
				<PAXCircles />
				<NextRuns>
					<Time>{currentTime}</Time>
					<RunsList>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								flexGrow: 1,
								height: '100%',
								gap: 16,
							}}>
							{RunsArray}
						</div>
						<div style={{ flexGrow: 1, height: '100%', minWidth: 454 }}>{NextRun}</div>
					</RunsList>
				</NextRuns>
				<MiddleContent>
					<IncentiveBlock>
						<InterIncentives incentives={props.incentives ?? []} />
					</IncentiveBlock>
				</MiddleContent>
				<BottomBlock ref={bottomBlockRef}>
					<BottomColumn>
						<SponsorBoxS sponsors={props.sponsors ?? []} sponsorStyle={SponsorsSize} />
					</BottomColumn>
					<BottomColumn>
						<img src={ASAP2022Vertical} style={{ height: 'auto', width: 322, margin: '-18px 0' }} />
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
					<Tweet ref={tweetRef}>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 13 }}>
							<TwitterLogo src={'../shared/design/Twitter white.svg'} />
							<Username>@{tweet?.includes.users[0].username}</Username>
						</div>
						<Twemoji noWrapper={true}>
							<TweetText dangerouslySetInnerHTML={dangerBold()}></TweetText>
						</Twemoji>
					</Tweet>
					<LocationBug>
						<span style={{ fontSize: 30 }}>PAX Australia 2022</span>
						<span>Melbourne, VIC</span>
					</LocationBug>
				</RightHalfContainer>
			</Half>
			<IntermissionAds ref={adsRef} style={{ position: 'absolute', left: 0, top: 545, zIndex: 10 }} />
		</IntermissionContainer>
	);
});

createRoot(document.getElementById('root')!).render(<Intermission />);
