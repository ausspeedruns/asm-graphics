import React, { useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { TickerItemHandles } from '../../ticker';

import { TickerTitle } from './title';

const TickerMilestonesContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: #ffffff;
	font-size: 37px;
`;

const NextMilestone = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-right: 16px;
`;

const NextMilestoneEvent = styled.span`
	font-size: 20px;
	margin-bottom: -10px;
`;

const NextMilestoneTotal = styled.span`
	font-size: 27px;
	font-weight: bold;
`;

const PrevMilestone = styled(NextMilestone)`
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
	border: 1px solid white;
	position: relative;
	overflow: hidden;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	background: white;
	border-right: 5px solid var(--main-col);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled(NextMilestoneTotal)`
	color: black;
	margin-right: 5px;
	font-weight: normal;
	width: 100px;
	text-align: right;
`;

const MILESTONES = [
	{ event: 'Start', total: 0 },
	{ event: 'ASM2016', total: 3066.52 },
	{ event: 'PAX2017', total: 3200 },
	{ event: 'ASM2017', total: 3271 },
	{ event: 'ASM2018', total: 5091.84 },
	{ event: 'ASM2019', total: 7026.63 },
	{ event: 'PAX2019', total: 7181.73 },
	{ event: 'ASM2020', total: 13069.69 },
];

interface Props {
	currentTotal: number;
}

export const TickerMilestones = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			if (!percentage) {
				return tl;
			}

			// Start
			tl.set(progressBarRef.current, { width: 0 });
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 });

			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) }, '+=1');

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, '+=10');
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	const prevMilestoneArray = MILESTONES.filter((milestone) => props.currentTotal > milestone.total);
	const nextMilestone = MILESTONES.find((milestone) => props.currentTotal < milestone.total);

	if (!nextMilestone || prevMilestoneArray.length === 0) return <></>;

	const prevMilestone = prevMilestoneArray[prevMilestoneArray.length - 1];

	const moneyDifference = props.currentTotal - prevMilestone.total;
	const goalDifference = nextMilestone.total - prevMilestone.total;
	const percentage = (moneyDifference / goalDifference) * 100;

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginRight: -110,
			color: 'white',
			textAlign: 'left',
		};
	}

	return (
		<TickerMilestonesContainer ref={containerRef} style={{ transform: 'translate(0px, 64px)' }}>
			<TickerTitle>
				Milestone
				<br />
				Progress
			</TickerTitle>
			<PrevMilestone>
				<NextMilestoneEvent>{prevMilestone.event}</NextMilestoneEvent>
				<NextMilestoneTotal>${Math.floor(prevMilestone.total).toLocaleString()}</NextMilestoneTotal>
			</PrevMilestone>
			<ProgressContainer>
				<ProgressBarContainer ref={progressBarRef}>
					<CurrentAmount style={textOnRightSide}>
						${Math.floor(props.currentTotal).toLocaleString()}
					</CurrentAmount>
				</ProgressBarContainer>
			</ProgressContainer>
			<NextMilestone>
				<NextMilestoneEvent>{nextMilestone.event}</NextMilestoneEvent>
				<NextMilestoneTotal>${Math.floor(nextMilestone.total).toLocaleString()}</NextMilestoneTotal>
			</NextMilestone>
		</TickerMilestonesContainer>
	);
});

TickerMilestones.displayName = 'TickerMilestones';
