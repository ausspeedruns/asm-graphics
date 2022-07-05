import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { format } from 'date-fns';

import { RunDataArray, RunDataActiveRun } from '../../types/RunData';
import { Goal, War } from '../../types/Incentives';

import { TickerRuns } from './ticker/runs';
import { TickerCTA } from './ticker/cta';
import { TickerMilestones } from './ticker/milestones';
import { TickerGoals } from './ticker/goal';
import { TickerWar } from './ticker/war';
import { LerpNum } from './ticker/lerp-num';
import { TickerPrizes } from './ticker/prizes';

import ASMGif from '../media/ASM-Gif.gif';
import GoCLogo from '../media/Sponsors/GoCFullColour.svg';

const TickerContainer = styled.div`
	height: 64px;
	width: 1920px;
	background: var(--main-dark);
	font-family: Noto Sans;
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
	background: #ffffff;
	font-size: 37px;

	display: flex;
	align-items: center;
	padding: 0 10px;
	color: var(--main-dark);
	font-weight: bold;
	font-family: Noto Sans;
`;

const CurrentTimeArea = styled.div`
	height: 100%;
	width: fit-content;
	background: var(--sec);
	color: var(--text-light);
	font-weight: bold;
	border-left: 6px solid var(--accent);
	padding: 0 16px;
	text-transform: uppercase;
	font-size: 22px;
	text-align: center;
	display: flex;
	align-items: center;
	line-height: 20px;
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

export interface TickerProps {
	runDataArray: RunDataArray;
	runDataActive: RunDataActiveRun;
	incentives?: (Goal | War)[];
	donationAmount: number;
	tickerOrder: {
		type: 'cta' | 'milestone' | 'prizes' | 'goals' | 'wars' | 'nextruns';
		id?: number;
	}[];
}

export const Ticker: React.FC<TickerProps> = (props) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const contentRef = useRef<HTMLDivElement>(null);
	const runsRef = useRef<TickerItemHandles>(null);
	const ctaRef = useRef<TickerItemHandles>(null);
	const milestoneRef = useRef<TickerItemHandles>(null);
	const goalsRef = useRef<TickerItemHandles>(null);
	const warsRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);

	let goalIncentives: Goal[] = [];
	let warIncentives: War[] = [];
	if (props.incentives) {
		goalIncentives = props.incentives
			.filter((incentive) => {
				if (incentive.active && incentive.type === 'Goal') {
					return incentive;
				}

				return undefined;
			})
			.slice(0, 3) as Goal[];

		warIncentives = props.incentives
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

		if (!element) return tl;

		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		const mainTl = gsap.timeline();

		// -=1.02 so that the animation "overlaps" and if it was just -1 there would be a 1px tall gap
		props.tickerOrder.forEach((type) => {
			switch (type.type) {
				case 'cta':
					mainTl.add(showContent(ctaRef.current!));
					break;
				case 'nextruns':
					mainTl.add(showContent(runsRef.current!), '-=1.02');
					break;
				case 'prizes':
					mainTl.add(showContent(prizesRef.current!));
					break;
				case 'goals':
					mainTl.add(showContent(goalsRef.current!), '-=1.02');
					break;
				case 'wars':
					mainTl.add(showContent(warsRef.current!), '-=1.02');
					break;
				case 'milestone':
					mainTl.add(showContent(milestoneRef.current!), '-=1.02');
					break;
				default:
					break;
			}
		});

		mainTl.eventCallback('onComplete', runLoop);
	}, [props.tickerOrder]);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });

		if (props.tickerOrder.length === 0) return;

		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop, props.tickerOrder]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<TickerContainer>
			<LeftBlock>
				<ASMLogo src={ASMGif} />
			</LeftBlock>
			<ContentArea ref={contentRef}>
				<TickerRuns ref={runsRef} currentRun={props.runDataActive} runArray={props.runDataArray} />
				<TickerCTA ref={ctaRef} currentTotal={props.donationAmount} />
				<TickerMilestones currentTotal={props.donationAmount} ref={milestoneRef} />
				<TickerGoals goals={goalIncentives} ref={goalsRef} />
				<TickerWar wars={warIncentives} ref={warsRef} />
				<TickerPrizes ref={prizesRef} />
			</ContentArea>
			<CurrentTimeArea>
				{format(currentTime, 'E d')}
				<br />
				{format(currentTime, 'h:mm a')}
			</CurrentTimeArea>
			<DonationArea>
				$<LerpNum value={props.donationAmount} />
				<CharityLogo src={GoCLogo} />
			</DonationArea>
		</TickerContainer>
	);
};
