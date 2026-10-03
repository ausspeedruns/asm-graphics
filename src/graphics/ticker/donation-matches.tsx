import { type Ref, useImperativeHandle, useRef } from "react";
import clsx from "clsx";

import type { DonationMatch } from "@asm-graphics/types/Donations.js";
import type { TickerItemHandles } from "../ticker.js";

import { TickerTitle } from "./title.js";
import { FitText } from "@asm-graphics/shared-browser/fit-text.js";
import { formatDistanceToNow } from "date-fns";
import styles from "./donation-matches.module.css";

interface Props {
	donationMatches: DonationMatch[];
	ref?: Ref<TickerItemHandles>;
}

export function TickerDonationMatches(props: Props) {
	const containerRef = useRef(null);
	const matchesRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			if (
				props.donationMatches.length === 0 ||
				props.donationMatches.filter((donationMatch) => donationMatch.active).length === 0
			) {
				return tl;
			}

			// Start
			tl.addLabel("goalStart");
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 });

			for (let i = 0; i < matchesRefs.current.length; i++) {
				const matchRef = matchesRefs.current[i];

				if (!matchRef) continue;

				tl.add(matchRef.animation(tl));
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "-=1");

			return tl;
		},
	}));

	if (
		props.donationMatches.length === 0 ||
		props.donationMatches.filter((donationMatch) => donationMatch.active).length === 0
	) {
		return <></>;
	}

	const allMatches = props.donationMatches
		.filter((donationMatch) => donationMatch.active)
		.map((donationMatch, i) => {
			return (
				<MatchBar
					donationMatch={donationMatch}
					key={donationMatch.id}
					ref={(el) => {
						if (el) {
							matchesRefs.current[i] = el;
						}
					}}
				/>
			);
		});

	return (
		<div className={styles.tickerGoalsContainer} ref={containerRef}>
			<TickerTitle>
				Donation
				<br />
				Matches
			</TickerTitle>
			<div className={styles.multiGoalContainer}>{allMatches}</div>
		</div>
	);
}

interface GoalProps {
	donationMatch: DonationMatch;
	ref?: Ref<TickerItemHandles>;
}

function MatchBar(props: GoalProps) {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.donationMatch.amount / props.donationMatch.pledge) * 100;

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, "goalStart");
			tl.set(containerRef.current, { y: -64 }, "-=0.5");
			tl.to(containerRef.current, { y: 0, duration: 1 }, "-=0.5");

			tl.to(
				progressBarRef.current,
				{ width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				"+=0.1",
			);

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginRight: -110,
			color: "var(--text-light)",
			textAlign: "left",
		};
	}

	return (
		<div className={styles.goalBarContainer} ref={containerRef}>
			<div className={clsx(styles.goalElement, styles.incentiveContainer)}>
				<FitText className={styles.name} text={props.donationMatch.name} />
				<FitText className={styles.expiration} text={`Ends in ${formatDistanceToNow(props.donationMatch.endsAt)}`} />
			</div>
			<div className={styles.progressContainer}>
				<div className={styles.progressBarContainer} ref={progressBarRef}>
					<span className={styles.currentAmount} style={textOnRightSide}>
						${Math.floor(props.donationMatch.amount).toLocaleString()}
					</span>
				</div>
			</div>
			<div className={styles.goalElement}>
				<FitText className={styles.incentiveName} text={`$${props.donationMatch.pledge}`} />
			</div>
		</div>
	);
}
