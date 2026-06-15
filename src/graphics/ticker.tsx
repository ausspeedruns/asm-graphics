import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState, memo } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useShallow } from "zustand/react/shallow";

import { TickerRuns } from "./ticker/runs";
import { TickerCTA } from "./ticker/cta";
import { TickerMilestones } from "./ticker/milestones";
import { TickerPrizes } from "./ticker/prizes";
import { TickerDonationMatches } from "./ticker/donation-matches";

import { useTickerStore } from "./stores/ticker-store";
import EventBug from "./overlays/backgrounds/ChannelBug.png";
import ContentBackground from "./overlays/backgrounds/Ticker.png";
import { TickerIncentives } from "./ticker/incentives";
import type { TickerSegment } from "@asm-graphics/types/Ticker";
import { TickerDonationTotal } from "./ticker/donation-area";
import { DonationMatchesFixture } from "./ticker/donation-matches-fixture";
import { CurrentTime } from "./ticker/current-time";

const TickerContainer = styled.div`
	height: 64px;
	width: 1920px;
	background: var(--main);
	font-family: var(--main-font);
	display: flex;
	justify-content: space-between;
	overflow: hidden;

	--secondary-font: Poppins;
`;

const ContentArea = styled.div`
	height: 64px;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
	font-family: var(--main-font);

	background: #1c1c1c;
`;

const ContentAreaBackground = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
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

const LeftBlock = styled.div`
	display: flex;
`;

export interface TickerItemHandles {
	animation(tl: gsap.core.Timeline): gsap.core.Timeline;
}

export function Ticker() {
	const runDataArray = useTickerStore((state) => state.runDataArray);
	const runDataActive = useTickerStore((state) => state.runDataActive);
	const incentives = useTickerStore((state) => state.incentives);
	const donationAmount = useTickerStore((state) => state.donationTotal + state.manualDonationTotal);
	const donationMatches = useTickerStore((state) => state.donationMatches);
	const prizes = useTickerStore((state) => state.prizes);

	const tickerOrder = useTickerStore(
		useShallow((state) => state.tickerOrderRaw.filter((s) => s.enabled).map((s) => s.id)),
	);

	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const [segmentIndex, setSegmentIndex] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);
	const runsRef = useRef<TickerItemHandles>(null);
	const ctaRef = useRef<TickerItemHandles>(null);
	const milestoneRef = useRef<TickerItemHandles>(null);
	const incentivesRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);
	const donationMatchesRef = useRef<TickerItemHandles>(null);

	function onSegmentComplete() {
		const nextSegmentIndex = (segmentIndex + 1) % tickerOrder.length;
		console.log(`Next segment index: ${nextSegmentIndex}`, new Date().toLocaleTimeString());
		setSegmentIndex(nextSegmentIndex);
	}

	function startNextSegment(segment: TickerSegment) {
		console.log(`Running segment ${segment}`, new Date().toLocaleTimeString());
		if (timelineRef.current) {
			timelineRef.current.kill();
		}

		timelineRef.current = gsap.timeline({
			onComplete: onSegmentComplete,
		});

		function showContent(element: TickerItemHandles | null) {
			if (!element || !timelineRef.current) return;

			element.animation(timelineRef.current);
		}

		switch (segment) {
			case "cta":
				showContent(ctaRef.current);
				break;
			case "nextruns":
				showContent(runsRef.current);
				break;
			case "prizes":
				showContent(prizesRef.current);
				break;
			case "incentives":
				showContent(incentivesRef.current);
				break;
			case "milestone":
				showContent(milestoneRef.current);
				break;
			case "donationMatches":
				showContent(donationMatchesRef.current);
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		console.log("Current segment index:", segmentIndex, "Segment:", tickerOrder[segmentIndex]);
		const segment = tickerOrder[segmentIndex];

		if (!segment) return;

		startNextSegment(segment);
	}, [segmentIndex, tickerOrder]);

	return (
		<TickerContainer>
			<LeftBlock>
				<img src={EventBug} />
			</LeftBlock>
			<ContentArea ref={contentRef}>
				<ContentAreaBackground src={ContentBackground} />
				{/* <ContentAreaBackgroundTint /> */}

				<TickerRuns ref={runsRef} currentRun={runDataActive} runArray={runDataArray} />
				<TickerCTA ref={ctaRef} currentTotal={donationAmount} />
				<TickerMilestones currentTotal={donationAmount} ref={milestoneRef} />
				<TickerIncentives incentives={incentives ?? []} ref={incentivesRef} />
				<TickerPrizes ref={prizesRef} prizes={prizes} />
				<TickerDonationMatches donationMatches={donationMatches} ref={donationMatchesRef} />
			</ContentArea>
			<CurrentTime />
			<DonationMatchesFixture />
			<TickerDonationTotal />
		</TickerContainer>
	);
}


createRoot(document.getElementById("root")!).render(<Ticker />);
