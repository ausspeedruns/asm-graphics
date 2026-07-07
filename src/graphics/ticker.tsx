import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState, memo } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useShallow } from "zustand/react/shallow";

import { TickerRuns } from "./ticker/runs/runs";
import { TickerCTA } from "./ticker/cta";
import { TickerMilestones } from "./ticker/milestones";
import { TickerPrizes } from "./ticker/prizes";
import { TickerDonationMatches } from "./ticker/donation-matches";

import { useTickerStore } from "./stores/ticker-store";
import EventBug from "./overlays/backgrounds/ChannelBug.png";
import ContentBackground from "./media/asm26/asm26-sweater.png";
import { TickerIncentives } from "./ticker/incentives";
import type { TickerSegment } from "@asm-graphics/types/Ticker";
import { TickerDonationTotal } from "./ticker/donation-area";
import { DonationMatchesFixture } from "./ticker/donation-matches-fixture";
import { CurrentTime } from "./ticker/current-time";
import { calculateTimeBasedColour, TimeStyleProvider } from "./elements/time-style-context";
import { useTimeStyleContext } from "./elements/use-time-style-context";
import { Colour } from "./colour";

const TickerContainer = styled.div`
	height: 64px;
	width: 1920px;
	// background: var(--main);
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

	// background: #1c1c1c;
`;

const ContentAreaBackground = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;

	background: #ffffff;

	&::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;

		background-image: url("${ContentBackground}");
		background-repeat: repeat;
		background-size: 60%;
		opacity: 0.5;
	}

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;

		background: var(--ticker-bg-time-colour);
		mix-blend-mode: multiply;
		pointer-events: none;
	}
`;

const LeftBlock = styled.div`
	display: flex;
`;

const dayColour = new Colour("#419ADF");
const nightColour = new Colour("#CC3622");

export interface TickerItemHandles {
	animation(tl: gsap.core.Timeline): gsap.core.Timeline;
}

export function Ticker() {
	const { normalizedTime, isManualControlEnabled, setManualNormalizedTime, clearManualNormalizedTime, daylightData } =
		useTimeStyleContext();

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

	const [backgroundColour, setBackgroundColour] = useState("#ffffff");

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

	useEffect(() => {
		const baseColour = calculateTimeBasedColour(normalizedTime, daylightData, {
			day: dayColour,
			night: nightColour,
		});

		if (!baseColour) return;

		setBackgroundColour(baseColour);
	}, [normalizedTime, daylightData]);

	return (
		<>
			<TickerContainer>
				<LeftBlock>
					<img src={EventBug} />
				</LeftBlock>
				<ContentArea ref={contentRef}>
					<ContentAreaBackground
						style={{ "--ticker-bg-time-colour": backgroundColour } as React.CSSProperties}
					/>
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

			<div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "8px" }}>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={normalizedTime}
					onChange={(e) => setManualNormalizedTime(parseFloat(e.target.value))}
					style={{ width: "600px" }}
				/>
				<span>{normalizedTime.toFixed(2)}</span>
				<span>{isManualControlEnabled ? "Manual" : "Live"}</span>
				<button onClick={clearManualNormalizedTime}>Reset</button>
			</div>
		</>
	);
}

createRoot(document.getElementById("root")!).render(
	<TimeStyleProvider>
		<Ticker />
	</TimeStyleProvider>,
);
