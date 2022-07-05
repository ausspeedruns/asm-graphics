import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import { Goal, War } from '../../../types/Incentives';

import { InterIncentWars } from './incent-wars';
import { InterIncentGoal } from './incent-goal';
import { InterPrizes } from './prizes';

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;
`;

export interface TickerItemHandles {
	animation(tl: gsap.core.Timeline): gsap.core.Timeline;
}

interface IncentivesProps {
	incentives: (Goal | War)[];
}

export const InterIncentives: React.FC<IncentivesProps> = (props) => {
	const goalsRef = useRef<TickerItemHandles>(null);
	const warsRef = useRef<TickerItemHandles>(null);
	const prizesRef = useRef<TickerItemHandles>(null);

	let goalIncentives: Goal[] = [];
	let warIncentives: War[] = [];
	// let allIncentives:(Goal | War)[] = [];
	if (props.incentives) {
		goalIncentives = props.incentives
			.filter((incentive) => {
				if (incentive.active && incentive.type === 'Goal') {
					return incentive;
				}

				return undefined;
			}) as Goal[];

		warIncentives = props.incentives
			.filter((incentive) => {
				if (incentive.active && incentive.type === 'War') {
					return incentive;
				}

				return undefined;
			}) as War[];

		// allIncentives = incentivesRep.filter((incentive) => {
		// 	if (incentive.active) {
		// 		return incentive;
		// 	}

		// 	return undefined;
		// })
	}

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		const mainTl = gsap.timeline();

		mainTl.add(showContent(goalsRef.current!));
		mainTl.add(showContent(warsRef.current!));
		mainTl.add(showContent(prizesRef.current!));

		mainTl.eventCallback('onComplete', runLoop);
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<InterIncentivesContainer>
			<InterIncentWars wars={warIncentives} ref={warsRef} />
			<InterIncentGoal goals={goalIncentives} ref={goalsRef} />
			<InterPrizes ref={prizesRef} />
		</InterIncentivesContainer>
	);
};
