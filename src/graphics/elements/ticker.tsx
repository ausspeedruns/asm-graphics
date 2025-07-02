import { useRef, useEffect, useState, memo } from "react";
import styled, { keyframes } from "styled-components";
import gsap from "gsap";
import { format } from "date-fns";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { DonationMatch } from "@asm-graphics/types/Donations";
import type { Prize } from "@asm-graphics/types/Prizes";

import { TickerRuns } from "./ticker/runs";
import { TickerCTA } from "./ticker/cta";
import { TickerMilestones } from "./ticker/milestones";
import { LerpNum } from "./ticker/lerp-num";
import { TickerPrizes } from "./ticker/prizes";
import { TickerDonationMatches } from "./ticker/donation-matches";

import ChannelBug from "../media/ASM-Gif.gif";
import GoCLogo from "../media/Sponsors/GoCWhite.svg";

// import EventBug from "./ticker/ChannelBug.png";
import ContentBackground from '../overlays/asm25/board-158973_1920 1.png';
import { TickerIncentives } from "./ticker/incentives";

const TickerContainer = styled.div`
	height: 64px;
	width: 1920px;
	background: var(--main);
	font-family: var(--main-font);
	display: flex;
	justify-content: space-between;
	overflow: hidden;
`;

const ASMLogo = styled.img`
	height: 64px;
	width: auto;
`;

const DonationArea = styled.div`
	height: 100%;
	width: fit-content;
	float: right;
	font-size: 37px;

	display: flex;
	align-items: center;
	padding: 0 10px;
	color: var(--text-light);
	font-weight: bold;
	font-family: var(--mono-font);

	background: var(--goc-gradient);
`;

const CurrentTimeArea = styled.div`
	height: 100%;
	width: fit-content;
	background: var(--sec);
	color: var(--text-light);
	font-weight: bold;
	/* border-left: 6px solid var(--accent); */
	padding: 0 16px;
	text-transform: uppercase;
	font-size: 22px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	line-height: 20px;
	font-family: var(--mono-font);
`;

const ContentArea = styled.div`
	height: 64px;
	// width: 1435px;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
	font-family: var(--main-font);

	background: #1C1C1C;
`;

const ContentAreaBackground = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.15;
`;

const ContentAreaBackgroundTint = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	
	background: #ffffff;
	mix-blend-mode: color;
`;

const CharityLogo = styled.img`
	height: 45px;
	width: auto;
	margin-left: 10px;
`;

const LeftBlock = styled.div`
	display: flex;
`;

export interface TickerItemHandles {
	animation(tl: gsap.core.Timeline): gsap.core.Timeline;
}

export interface TickerProps {
	runDataArray: RunDataArray;
	runDataActive: RunDataActiveRun;
	incentives?: Incentive[];
	donationAmount: number;
	donationMatches: DonationMatch[];
	tickerOrder: Segments[];
	prizes: Prize[];
}

type Segments = "cta" | "milestone" | "prizes" | "incentives" | "nextruns" | "asmm" | "donationMatches";

const Ticker = (props: TickerProps) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const [segmentIndex, setSegmentIndex] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);
	const runsRef = useRef<TickerItemHandles>(null);
	const ctaRef = useRef<TickerItemHandles>(null);
	const milestoneRef = useRef<TickerItemHandles>(null);
	const incentivesRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);
	const donationMatchesRef = useRef<TickerItemHandles>(null);

	const showContent = (timeline: gsap.core.Timeline, element: TickerItemHandles | null) => {
		if (!element) return;

		element.animation(timeline);
	};

	function startNextSegment(segment: Segments) {
		// console.log(`Running segment ${segment}`, new Date().toLocaleTimeString());
		if (timelineRef.current) {
			timelineRef.current.kill();
		}

		timelineRef.current = gsap.timeline({
			onComplete: () => {
				// console.log("Segment complete", new Date().toLocaleTimeString());
				setSegmentIndex((segmentIndex + 1) % props.tickerOrder.length);
			},
		});

		switch (segment) {
			case "cta":
				showContent(timelineRef.current, ctaRef.current);
				break;
			case "nextruns":
				showContent(timelineRef.current, runsRef.current);
				break;
			case "prizes":
				showContent(timelineRef.current, prizesRef.current);
				break;
			case "incentives":
				showContent(timelineRef.current, incentivesRef.current);
				break;
			case "milestone":
				showContent(timelineRef.current, milestoneRef.current);
				break;
			case "donationMatches":
				showContent(timelineRef.current, donationMatchesRef.current);
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		startNextSegment(props.tickerOrder[segmentIndex]);
	}, [segmentIndex]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<TickerContainer>
			<LeftBlock>
				<ASMLogo src={ChannelBug} />
				{/* <img src={EventBug} /> */}
			</LeftBlock>
			<ContentArea ref={contentRef}>
				<ContentAreaBackground src={ContentBackground} />
				<ContentAreaBackgroundTint />

				<TickerRuns ref={runsRef} currentRun={props.runDataActive} runArray={props.runDataArray} />
				<TickerCTA ref={ctaRef} currentTotal={props.donationAmount} />
				<TickerMilestones currentTotal={props.donationAmount} ref={milestoneRef} />
				<TickerIncentives incentives={props.incentives ?? []} ref={incentivesRef} />
				<TickerPrizes ref={prizesRef} prizes={props.prizes} />
				<TickerDonationMatches donationMatches={props.donationMatches} ref={donationMatchesRef} />
			</ContentArea>
			<CurrentTimeArea>
				<span>{format(currentTime, "h:mm a")}</span>
				<span>{format(currentTime, "E d")}</span>
			</CurrentTimeArea>
			<DonationMatches donationMatches={props.donationMatches} />
			<DonationArea>
				$<LerpNum value={props.donationAmount} />
				<CharityLogo src={GoCLogo} />
			</DonationArea>
		</TickerContainer>
	);
};

export const TickerMemo = memo(Ticker);

const DonationMatchContainer = styled.div`
	background: white;
	font-size: 45px;
	padding: 0 8px;
`;

const GradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const GradientText = styled.div`
	background: var(--goc-gradient);
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	animation: ${GradientAnimation} 5s ease infinite;
	background-size: 400% 400%;
`;

const MultiplierText = styled.div`
	font-weight: 900;
	height: 50px;
	margin-top: -6px;
`;

const DonationMatchLabel = styled.div`
	font-size: 30%;
	font-weight: bold;
`;

type DonationMatchProps = {
	donationMatches: DonationMatch[];
};

const DonationMatches = (props: DonationMatchProps) => {
	const multiplierAmount = props.donationMatches.filter((match) => match.active).length;

	if (multiplierAmount === 0) {
		return null;
	}

	return (
		<DonationMatchContainer>
			<GradientText>
				<MultiplierText>{multiplierAmount + 1}×</MultiplierText>
				<DonationMatchLabel>Donation Match</DonationMatchLabel>
			</GradientText>
		</DonationMatchContainer>
	);
};
