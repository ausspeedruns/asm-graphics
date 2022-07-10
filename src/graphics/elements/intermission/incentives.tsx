import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import { Goal, War } from '../../../types/Incentives';

import { InterIncentWars, WarGame } from './incent-wars';
import { GoalBar, InterIncentGoal } from './incent-goal';
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
	const incentivesRef = useRef<TickerItemHandles[]>([]);
	const mainTl = useRef<gsap.core.Timeline>(gsap.timeline({paused:true, repeat: -1 }));

	let goalIncentives: Goal[] = [];
	let warIncentives: War[] = [];
	let allIncentives:JSX.Element[] = [];
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

		allIncentives = props.incentives.filter((incentive) => incentive.active).map((incentive, i) => {
			switch (incentive.type) {
				case 'Goal':
					return (<GoalBar key={incentive.index} goal={incentive} ref={el => el ? incentivesRef.current[i] = el : undefined} />)

				case 'War':
					return (<WarGame key={incentive.index} war={incentive} ref={el => el ? incentivesRef.current[i] = el : undefined} />)
			}
		});
	}

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		if (!mainTl.current) return;
		incentivesRef.current.forEach(incentiveEl => {
			mainTl.current.add(showContent(incentiveEl));
		})
		// mainTl.add(showContent(goalsRef.current!));
		// mainTl.add(showContent(warsRef.current!));
		// mainTl.current.add(showContent(prizesRef.current!));

		// mainTl.current.eventCallback('onComplete', runLoop);
		mainTl.current.play();
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
		// runLoop();
	}, [runLoop]);

	return (
		<InterIncentivesContainer>
			{/* <InterIncentWars wars={warIncentives} ref={warsRef} />
			<InterIncentGoal goals={goalIncentives} ref={goalsRef} /> */}
			{allIncentives}
			<InterPrizes ref={prizesRef} />
		</InterIncentivesContainer>
	);
};
