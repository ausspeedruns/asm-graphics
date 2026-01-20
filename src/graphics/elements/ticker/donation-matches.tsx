import { type Ref, useImperativeHandle, useRef } from "react";
import styled from "@emotion/styled";

import type { DonationMatch } from "@asm-graphics/types/Donations";
import type { TickerItemHandles } from "../ticker";

import { TickerTitle } from "./title";
import { FitText } from "../fit-text";
import { formatDistanceToNow } from "date-fns";

const TickerGoalsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: var(--text-light);
	font-size: 37px;
	transform: translate(0, -64px);
	overflow: hidden;
	z-index: 2;
	font-family: var(--secondary-font);
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
`;

const GoalElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-right: 16px;
`;

const Name = styled(FitText)`
	font-size: 20px;
	max-width: 200px;
	font-weight: bold;
	font-family: var(--main-font);
`;

const Expiration = styled(FitText)`
	font-size: 20px;
	max-width: 200px;
`;

const IncentiveName = styled(FitText)`
	font-size: 27px;
	font-weight: bold;
	max-width: 200px;
`;

const IncentiveContainer = styled(GoalElement)`
	// position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
	margin: 0 4px 0 8px;
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	height: 54px;
	margin: 0 16px 0 5px;
	border: 1px solid #ffffff;
	position: relative;
	overflow: hidden;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	background: #ffffff;
	border-right: 5px solid var(--sec);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled.span`
	color: var(--text-dark);
	margin-right: 5px;
	font-weight: normal;
	width: 100px;
	text-align: right;
	font-size: 25px;
`;

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
		<TickerGoalsContainer ref={containerRef}>
			<TickerTitle>
				Donation
				<br />
				Matches
			</TickerTitle>
			<MultiGoalContainer>{allMatches}</MultiGoalContainer>
		</TickerGoalsContainer>
	);
}

const GoalBarContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transform: translate(0, -64px);
`;

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
		<GoalBarContainer ref={containerRef}>
			<IncentiveContainer>
				<Name text={props.donationMatch.name} />
				<Expiration text={`Ends in ${formatDistanceToNow(props.donationMatch.endsAt)}`} />
			</IncentiveContainer>
			<ProgressContainer>
				<ProgressBarContainer ref={progressBarRef}>
					<CurrentAmount style={textOnRightSide}>
						${Math.floor(props.donationMatch.amount).toLocaleString()}
					</CurrentAmount>
				</ProgressBarContainer>
			</ProgressContainer>
			<GoalElement>
				<IncentiveName text={`$${props.donationMatch.pledge}`}></IncentiveName>
			</GoalElement>
		</GoalBarContainer>
	);
}
