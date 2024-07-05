import { useRef, useEffect, useState, memo } from "react";
import styled from "styled-components";
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
	background: white;
	color: var(--text-dark);
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
	incentives?: (Goal | War)[];
	donationAmount: number;
	asmm?: number;
	donationMatches: DonationMatch[];
	tickerOrder: ("cta" | "milestone" | "prizes" | "goals" | "wars" | "nextruns" | "asmm" | "donationMatches")[];
}

const Ticker = (props: TickerProps) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const [numberOfLoops, setNumberOfLoops] = useState(0);
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

	const showContent = (element: TickerItemHandles | null) => {
		const tl = gsap.timeline();

		if (!element) return tl;

		element.animation(tl);
		return tl;
	};

	useEffect(
		() => {
			const ctx = gsap.context(() => {
				timelineRef.current = gsap.timeline({ onComplete: () => setNumberOfLoops(numberOfLoops + 1) });
				// console.log("running anim!", numberOfLoops);
				// console.log(testMemo);

				// -=1.02 so that the animation "overlaps" and if it was just -1 there would be a 1px tall gap
				props.tickerOrder.forEach((type) => {
					switch (type) {
						case "cta":
							timelineRef.current?.add(showContent(ctaRef.current), "-=1.02");
							break;
						case "nextruns":
							timelineRef.current?.add(showContent(runsRef.current), "-=1.02");
							break;
						case "prizes":
							timelineRef.current?.add(showContent(prizesRef.current), "-=1.02");
							break;
						case "goals":
							timelineRef.current?.add(showContent(goalsRef.current), "-=1.02");
							break;
						case "wars":
							timelineRef.current?.add(showContent(warsRef.current), "-=1.02");
							break;
						case "milestone":
							timelineRef.current?.add(showContent(milestoneRef.current), "-=1.02");
							break;
						case "asmm":
							timelineRef.current?.add(showContent(asmmRef.current), "-=1.02");
							break;
						case "donationMatches":
							timelineRef.current?.add(showContent(donationMatchesRef.current), "-=1.02");
							break;
						default:
							break;
					}
				});

				timelineRef.current.play();
			}, contentRef);

			return () => ctx.revert();
		},
		[numberOfLoops]
	);

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
			<DonationArea>
				$<LerpNum value={props.donationAmount} />
				<CharityLogo src={GoCLogo} />
			</DonationArea>
		</TickerContainer>
	);
};

export const TickerMemo = memo(Ticker);
