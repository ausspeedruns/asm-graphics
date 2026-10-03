import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useShallow } from "zustand/react/shallow";

import { TickerRuns } from "./ticker/runs/runs.js";
import { TickerCTA } from "./ticker/cta.js";
import { TickerMilestones } from "./ticker/milestones.js";
import { TickerPrizes } from "./ticker/prizes.js";
import { TickerDonationMatches } from "./ticker/donation-matches.js";

import { useTickerStore } from "./stores/ticker-store.js";
import EventBug from "./overlays/backgrounds/ChannelBug.png";
import { TickerIncentives } from "./ticker/incentives.js";
import type { TickerSegment } from "@asm-graphics/types/Ticker.js";
import { TickerDonationTotal } from "./ticker/donation-area.js";
import { DonationMatchesFixture } from "./ticker/donation-matches-fixture.js";
import { CurrentTime } from "./ticker/current-time.js";
import { calculateTimeBasedColour, TimeStyleProvider } from "./elements/time-style-context.js";
import { useTimeStyleContext } from "./elements/use-time-style-context.js";
import styles from "./ticker.module.css";

const testDonationMatch = {
	desc: "Description of the donation match",
	id: "donation-match-1",
	read: false,
	time: Date.now(),
	name: "John AusSpeedruns",
	amount: 100,
	currencySymbol: "$",
	currencyCode: "USD",

	pledge: 200,
	endsAt: Date.now() + 1000000,
	completedAt: 0,
	active: true,
	updated: Date.now(),
};

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

	return (
		<>
			<div className={styles.tickerContainer}>
				<div className={styles.leftBlock}>
					<img src={EventBug} />
				</div>
				<div className={styles.contentArea} ref={contentRef}>
					<div
						className={styles.contentAreaBackground}
						style={{ "--ticker-bg-time-colour": backgroundColour } as React.CSSProperties}
					/>
					{/* <ContentAreaBackgroundTint /> */}

					<TickerRuns ref={runsRef} currentRun={runDataActive} runArray={runDataArray} />
					<TickerCTA ref={ctaRef} currentTotal={donationAmount} />
					<TickerMilestones currentTotal={donationAmount} ref={milestoneRef} />
					<TickerIncentives incentives={incentives ?? []} ref={incentivesRef} />
					<TickerPrizes ref={prizesRef} prizes={prizes} />
					<TickerDonationMatches donationMatches={donationMatches} ref={donationMatchesRef} />
				</div>
				<CurrentTime />
				<DonationMatchesFixture />
				<TickerDonationTotal />
			</div>

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
