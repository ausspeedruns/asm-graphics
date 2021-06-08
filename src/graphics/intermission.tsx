import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import clone from 'clone';
import { useListenFor, useReplicant } from 'use-nodecg';
import gsap from 'gsap';

import { RunDataArray, RunDataActiveRun } from '../types/RunData';
import { Tweet as ITweet } from '../types/Twitter';

import { InterCTA } from './elements/intermission/cta';
import { InterIncentives } from './elements/intermission/incentives';
import { InterNextRunItem, EndRunItem } from './elements/intermission/next-run-item';
// import { Sponsors } from './elements/sponsors';

import { Tweet } from './elements/tweet';

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Noto Sans;
`;

const NextRuns = styled.div`
	/* position: absolute;
	top: 235px;
	left: 1033px; */
	color: #ffffff;
	font-family: Noto Sans;
	width: 630px;
	height: 844px;
	background: linear-gradient(180deg, #0c94de 0%, #085d8b 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	//gap: 30px; OBS Chrome version isn't high enough

	& > div {
		margin-top: 30px;
	}
`;

const IncentiveBlock = styled.div`
	color: #ffffff;
	font-family: Noto Sans;
	width: 630px;
	height: 844px;
	background: linear-gradient(180deg, #0c94de 0%, #085d8b 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MiddleContent = styled.div`
	/* position: absolute;
	top: 235px; */
	/* width: 1033px; */
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
	width: 100%;
`;

const SponsorImg = styled.img`
	object-fit: contain;
	height: 275px;
	width: 265px;
	z-index: 2;
`;

const SocialMedia = styled.div`
	height: 120px;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	font-family: Noto Sans;
	background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
`;

const SocialMediaItem = styled.div`
	display: flex;
	align-items: center;
`;

const SocialMediaLabel = styled.span`
	color: #000000;
	font-size: 30px;
`;

const Music = styled.div`
	/* width: 100%; */
	text-align: center;
	/* margin-top: -2px; */
`;

// interface Asset {
// 	base: string;
// 	bundleName: string;
// 	category: string;
// 	ext: string;
// 	name: string;
// 	sum: string;
// 	url: string;
// }

const BottomBlock = styled.div`
	position: absolute;
	top: 235px;
	height: 836px;
	width: 100%;
	border-top: solid 9px #095e8c;
	background: linear-gradient(180deg, #df3422 0%, #7e1f15 100%);
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

interface IntermissionProps {
	muted?: boolean;
}

export const Intermission: React.FC<IntermissionProps> = (props: IntermissionProps) => {
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [currentTime, setCurrentTime] = useState('00:00:00');
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);
	const tweetRef = useRef<HTMLDivElement>(null);
	const asLogoRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString('en-GB'));
		}, 500);
		return () => clearInterval(interval);
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

	const currentRunIndex = runDataArrayRep.findIndex((run) => run.id === runDataActiveRep?.id);
	const nextFiveRuns = clone(runDataArrayRep)
		.slice(currentRunIndex + 1)
		.slice(0, 6);

	let NextRun;
	if (nextFiveRuns.length !== 0) {
		NextRun = <InterNextRunItem run={nextFiveRuns[0]} key={nextFiveRuns[0].id} />;
	}

	nextFiveRuns.shift();
	const RunsArray = nextFiveRuns.map((run) => {
		return <InterNextRunItem run={run} key={run.id} />;
	});

	if (RunsArray.length < 5) {
		RunsArray.push(<EndRunItem key="end" />);
	}

	return (
		<IntermissionContainer>
			<img style={{ position: 'absolute' }} src="../shared/design/IntermissionBanner.svg" />
			<SocialMedia>
				<SocialMediaItem>
					<img style={{ height: 70, filter: 'invert(1)' }} src={require('./media/twitter.png')} />
					<SocialMediaLabel>@AusSpeedruns</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaItem>
					<img
						style={{ height: 60, marginRight: 10, filter: 'invert(1)' }}
						src={require('./media/yt_icon_mono_dark.png')}
					/>
					<SocialMediaLabel>Australian Speedruns</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaItem>
					<img style={{ height: 70, filter: 'invert(1)' }} src={require('./media/discord.png')} />
					<SocialMediaLabel>discord.ausspeedruns.com</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaLabel style={{ fontSize: 40, zIndex: 2, color: '#ffffff', marginLeft: 100 }}>
					#ASM2021
				</SocialMediaLabel>
				<SocialMediaLabel style={{ fontSize: 40, zIndex: 2, color: '#ffffff' }}>{currentTime}</SocialMediaLabel>
			</SocialMedia>
			<InterCTA style={{ position: 'absolute', top: 120 }} />
			<BottomBlock>
				<IncentiveBlock>
					<b style={{ fontSize: 50, marginTop: 20 }}>Incentives</b>
					<InterIncentives />
				</IncentiveBlock>
				<MiddleContent>
					<SponsorHolder style={{ position: 'relative' }}>
						<SponsorImg ref={asLogoRef} src="../shared/design/AusSpeedrunsLogo.svg" />
						<TweetBox ref={tweetRef}>
							<Tweet style={{width: '100%', margin: 0, justifyContent: 'center'}} tweet={tweet} />
						</TweetBox>
					</SponsorHolder>
					<SponsorHolder>
						<SponsorImg src="../shared/design/RFDSWhite.png" />
					</SponsorHolder>
					<Music>
						<audio id="intermission-music" autoPlay preload="auto" muted={props.muted}>
							<source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" />
						</audio>
						<iframe
							src="https://rainwave.cc/widget/widget?sid=2&layout=art_left&text_align=right&anim_in=to_left&anim_out=to_left&art_size=100px&max_width=500px&box_shadow=none&np_header=no&ad=0&show_artist=true&text_stroke_size=0px&text_shadow=none&padding=0px&delay=3"
							scrolling="no"
							frameBorder={0}
							height={100}
							width={500}
						/>
					</Music>
				</MiddleContent>
				<NextRuns>
					<b style={{ fontSize: 50, marginTop: 20 }}>Next Run</b>
					{NextRun}
					<b style={{ fontSize: 36, marginTop: 20 }}>Soon</b>
					{RunsArray}
				</NextRuns>
			</BottomBlock>
		</IntermissionContainer>
	);
};

if (document.getElementById('intermission')) {
	render(<Intermission />, document.getElementById('intermission'));
}
