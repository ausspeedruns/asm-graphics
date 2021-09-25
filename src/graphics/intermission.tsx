import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { useFetch } from 'use-http';

import { RunDataArray, RunDataActiveRun } from '../types/RunData';
import { Tweet as ITweet } from '../types/Twitter';
import { CouchPerson } from '../types/OverlayProps';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import {
	InterNextRunItem,
	EndRunItem,
} from './elements/intermission/next-run-item';

import { Sponsors } from './elements/sponsors';
import { Tweet } from './elements/tweet';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: National Park;
	/* background: var(--main-col); */
`;

const NextRuns = styled.div`
	color: #F2DAB2;
	font-family: National Park;
	width: 560px;
	height: 100%;
	background: #251803;
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
	padding-bottom: 50px;
	width: 100%;

	/* & > div {
		margin-top: 10px;
	} */
`;

const IncentiveBlock = styled.div`
	color: #F2DAB2;
	font-family: National Park;
	width: 560px;
	height: 100%;
	background: #251803;
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
	height: 200px;
	width: 100%;
	z-index: 2;
`;

const Music = styled.div`
	text-align: center;
`;

const BottomBlock = styled.div`
	position: absolute;
	bottom: 0;
	height: 710px;
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
	font-style: italic;
	color: #F2DAB2;
`;

// const LocationBug = styled.div`
// 	position: absolute;
// 	background: #ffffff;
// 	border: 1px solid var(--asm-orange);
// 	width: 250px;
// 	height: 50px;
// 	font-size: 32px;
// 	text-align: center;
// 	line-height: 50px;
// 	color: var(--main-col);
// `;

const HostName = styled.div`
	font-size: 28px;
	color: #F2DAB2;
	display: flex;
	align-items: center;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-family: National Park;
	font-weight: 400;
	color: #251803;
	text-transform: uppercase;
	margin-left: 8px;
	background: #FFC629;
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
`;

const MusicLabel = styled.div`
	width: 410px;
	color: #F2DAB2;
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

const SocialMedia = styled.div`
	height: 255px;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	font-family: National Park;
`;

const SocialMediaItem = styled.div`
	display: flex;
	align-items: center;
	width: 960px;
	z-index: 2;
	box-sizing: border-box;
	padding: 0 30px;
`;

const SocialMediaLabel = styled.span`
	color: #F2DAB2;
	font-size: 46px;
	margin: 0 10px;
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
			{/* <iframe width="1920" height="1080" frameBorder="0" src="https://www.shadertoy.com/embed/NdVGRw?gui=false&paused=false"></iframe> */}
			<SocialMedia>
				<div style={{display: 'flex', width: '100%'}}>
					<SocialMediaItem style={{justifyContent: 'flex-end'}}>
						<SocialMediaLabel>@ AusSpeedruns</SocialMediaLabel>
						<img
							style={{ height: 70 }}
							src={require('./media/twitter.svg')}
						/>
					</SocialMediaItem>
					<SocialMediaItem style={{justifyContent: 'flex-start'}}>
						<img
							style={{ height: 70 }}
							src={require('./media/youtube.svg')}
						/>
						<SocialMediaLabel>Australian Speedruns</SocialMediaLabel>
					</SocialMediaItem>
				</div>
				<div style={{display: 'flex', width: '100%'}}>
					<SocialMediaItem style={{justifyContent: 'flex-end'}}>
						<SocialMediaLabel>
							discord.ausspeedruns.com
						</SocialMediaLabel>
						<img
							style={{ height: 70 }}
							src={require('./media/discord.svg')}
						/>
					</SocialMediaItem>
					<SocialMediaLabel
						style={{
							fontSize: 60,
							fontWeight: 'bold',
							zIndex: 2,
							color: '#F2DAB2',
							textAlign: 'right',
							display: 'flex',
							width: 960,
							justifyContent: 'flex-start',
							margin: 0,
							paddingLeft: 30,
							boxSizing: 'border-box'
						}}>
						#PAXxAusSpeedruns2021
					</SocialMediaLabel>
				</div>
			</SocialMedia>
			<InterCTA style={{ position: 'absolute', top: 255 }} />
			<BottomBlock>
				<IncentiveBlock>
					<b style={{ fontSize: 40, marginTop: 5 }}>Incentives</b>
					<InterIncentives />
				</IncentiveBlock>
				<MiddleContent>
					<SponsorHolder
						style={{ position: 'relative', alignItems: 'center' }}>
						<SponsorImg
							ref={asLogoRef}
							src="../shared/design/ASxPAX_Intermission.svg"
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
									{/* @ts-ignore */}
									<marquee>{currentSong}</marquee>
								</MusicLabel>
								<MusicIcon src="../shared/design/MusicIcon.svg" />
							</div>
						</Music>
					</BottomInfo>
				</MiddleContent>
				<div style={{ display: 'flex' }}>
					<NextRuns>
						<b style={{ fontSize: 40, marginTop: 5 }}>Next Run</b>
						{NextRun}
						<b style={{ fontSize: 30, marginTop: 5 }}>Soon</b>
						<RunsList>{RunsArray}</RunsList>
					</NextRuns>
				</div>
			</BottomBlock>
		</IntermissionContainer>
	);
};

if (document.getElementById('intermission')) {
	render(<Intermission />, document.getElementById('intermission'));
}
