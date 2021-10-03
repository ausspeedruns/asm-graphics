import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import { useReplicant } from 'use-nodecg';
import gsap from 'gsap';

import { RunDataArray, RunDataActiveRun } from '../types/RunData';

import { TickerRuns } from './elements/ticker/runs';
import { TickerCTA } from './elements/ticker/cta';
import { TickerMilestones } from './elements/ticker/milestones';
import { TickerGoals } from './elements/ticker/goal';
import { TickerWar } from './elements/ticker/war';
import { LerpNum } from './elements/ticker/lerp-num';
import { Goal, War } from '../types/Incentives';
import { TickerPrizes } from './elements/ticker/prizes';

const TickerContainer = styled.div`
	height: 64px;
	width: 1920px;
	background: #251803;
	font-family: National Park;
	display: flex;
	justify-content: space-between;
	overflow: hidden;
`;

const ASMLogo = styled.img`
	height: 64px;
	width: auto;
	border-right: 6px solid #FFC629;
`;

const DonationArea = styled.div`
	height: 100%;
	width: fit-content;
	float: right;
	background: #F2DAB2;
	font-size: 37px;

	display: flex;
	align-items: center;
	padding: 0 10px;
	border-left: 6px solid #FFC629;
	color: #251803;
	font-weight: bold;
	font-family: Noto Sans;
`;

const ContentArea = styled.div`
	height: 64px;
	// width: 1435px;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
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

export const Ticker: React.FC = () => {
	const contentRef = useRef<HTMLDivElement>(null);
	const runsRef = useRef<TickerItemHandles>(null);
	const ctaRef = useRef<TickerItemHandles>(null);
	const milestoneRef = useRef<TickerItemHandles>(null);
	const goalsRef = useRef<TickerItemHandles>(null);
	const warsRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);
	const [runDataArrayRep] = useReplicant<RunDataArray, []>('runDataArray', [], { namespace: 'nodecg-speedcontrol' });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [donationRep] = useReplicant<number, number>('donationTotal', 0);
	// const [donationTester] = useState(14000);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setDonationTester(donationTester + Math.random() * 100);
	// 	}, 500);
	// 	return () => clearInterval(interval);
	// }, [donationTester]);

	let goalIncentives: Goal[] = [];
	let warIncentives: War[] = [];
	if (incentivesRep) {
		goalIncentives = incentivesRep
			.filter((incentive) => {
				if (incentive.active && incentive.type === 'Goal') {
					return incentive;
				}

				return undefined;
			})
			.slice(0, 3) as Goal[];

		warIncentives = incentivesRep
			.filter((incentive) => {
				if (incentive.active && incentive.type === 'War') {
					return incentive;
				}

				return undefined;
			})
			.slice(0, 3) as War[];
	}

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		const mainTl = gsap.timeline();

		mainTl.add(showContent(ctaRef.current!));
		
		// -=1.02 so that the animation "overlaps" and if it was just -1 there would be a 1px tall gap
		mainTl.add(showContent(runsRef.current!), '-=1.02');
		mainTl.add(showContent(prizesRef.current!));
		
		mainTl.add(showContent(goalsRef.current!), '-=1.02');
		mainTl.add(showContent(warsRef.current!), '-=1.02');
		mainTl.add(showContent(milestoneRef.current!), '-=1.02');

		mainTl.eventCallback('onComplete', runLoop);
	}, []);

	useEffect(() => {
		gsap.defaults({ease: 'power2.inOut'});
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<TickerContainer>
			<LeftBlock>
				<ASMLogo src={'/bundles/asm-graphics/shared/design/ASxPAX.svg'} />
			</LeftBlock>
			<ContentArea ref={contentRef}>
				<TickerRuns ref={runsRef} currentRun={runDataActiveRep} runArray={runDataArrayRep} />
				<TickerCTA ref={ctaRef} />
				<TickerMilestones currentTotal={donationRep} ref={milestoneRef} />
				<TickerGoals goals={goalIncentives} ref={goalsRef} />
				<TickerWar wars={warIncentives} ref={warsRef} />
				<TickerPrizes ref={prizesRef} />
			</ContentArea>
			<DonationArea>
				$<LerpNum value={donationRep} />
				<CharityLogo src={'../shared/design/CureCancer.svg'} />
			</DonationArea>
		</TickerContainer>
	);
};

if (document.getElementById('ticker')) {
	render(<Ticker />, document.getElementById('ticker'));
}
