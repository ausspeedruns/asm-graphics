import { useRef, useEffect, useState, memo } from "react";
import styled, { keyframes } from "styled-components";
import gsap from "gsap";
import { format } from "date-fns";
import _ from "lodash";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Goal, War } from "@asm-graphics/types/Incentives";
import type { DonationMatch } from "@asm-graphics/types/Donations";

import { TickerRuns } from "./ticker/runs";
import { TickerCTA } from "./ticker/cta";
import { TickerMilestones } from "./ticker/milestones";
import { TickerGoals } from "./ticker/goal";
import { TickerWar } from "./ticker/war";
import { LerpNum } from "./ticker/lerp-num";
import { TickerPrizes } from "./ticker/prizes";
import { TickerASMM } from "./ticker/asmm";
import { TickerDonationMatches } from "./ticker/donation-matches";

import ChannelBug from "../media/ASM-Gif.gif";
// import ChannelBugExtension from "../elements/event-specific/pax-23/ChannelBugExtension.png";
// import ChannelBug from "../elements/event-specific/tgx-24/tgx24-bug.png";
import GoCLogo from "../media/Sponsors/GoCWhite.svg";

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
	background: var(--time);
	color: var(--text-light);
	font-weight: bold;
	/* border-left: 6px solid var(--accent); */
	padding: 0 16px;
	text-transform: uppercase;
	font-size: 22px;
	text-align: center;
	display: flex;
	align-items: center;
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
	asmm?: number;
	donationMatches: DonationMatch[];
	tickerOrder: Segments[];
}

type Segments = "cta" | "milestone" | "prizes" | "goals" | "wars" | "nextruns" | "asmm" | "donationMatches";

const Ticker = (props: TickerProps) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const [segmentIndex, setSegmentIndex] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);
	const runsRef = useRef<TickerItemHandles>(null);
	const ctaRef = useRef<TickerItemHandles>(null);
	const milestoneRef = useRef<TickerItemHandles>(null);
	const goalsRef = useRef<TickerItemHandles>(null);
	const warsRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);
	const asmmRef = useRef<TickerItemHandles>(null);
	const donationMatchesRef = useRef<TickerItemHandles>(null);

	let goalIncentives: Goal[] = [];
	let warIncentives: War[] = [];
	if (props.incentives) {
		goalIncentives = props.incentives
			.filter((incentive) => {
				if (incentive.active && incentive.type === "Goal") {
					return incentive;
				}

				return undefined;
			})
			.slice(0, 3) as Goal[];

		warIncentives = props.incentives
			.filter((incentive) => {
				if (incentive.active && incentive.type === "War") {
					return incentive;
				}

				return undefined;
			})
			.slice(0, 3) as War[];
	}

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
			case "goals":
				showContent(timelineRef.current, goalsRef.current);
				break;
			case "wars":
				showContent(timelineRef.current, warsRef.current);
				break;
			case "milestone":
				showContent(timelineRef.current, milestoneRef.current);
				break;
			case "asmm":
				showContent(timelineRef.current, asmmRef.current);
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
				{/* <img src={ChannelBugExtension} /> */}
			</LeftBlock>
			<ContentArea ref={contentRef}>
				<TickerRuns ref={runsRef} currentRun={props.runDataActive} runArray={props.runDataArray} />
				<TickerCTA ref={ctaRef} currentTotal={props.donationAmount} />
				<TickerMilestones currentTotal={props.donationAmount} ref={milestoneRef} />
				<TickerGoals goals={goalIncentives} ref={goalsRef} />
				<TickerWar wars={warIncentives} ref={warsRef} />
				<TickerPrizes ref={prizesRef} />
				<TickerASMM ref={asmmRef} totalKM={props.asmm ?? 0} />
				<TickerDonationMatches donationMatches={props.donationMatches} ref={donationMatchesRef} />
			</ContentArea>
			{/* <div style={{ width: 8, height: "100%", background: "var(--tgx-rainbow-bar-vertical)" }} /> */}
			<CurrentTimeArea>
				{format(currentTime, "E d")}
				<br />
				{format(currentTime, "h:mm a")}
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
