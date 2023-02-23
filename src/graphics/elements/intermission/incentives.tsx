import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import { Goal, War } from '@asm-graphics/types/Incentives';

import { WarGame } from './incent-wars';
import { GoalBar } from './incent-goal';
// import { InterPrizes } from './prizes';

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

export const InterIncentives = (props: IncentivesProps) => {
	// const prizesRef = useRef<TickerItemHandles>(null);
	const incentivesRef = useRef<TickerItemHandles[]>([]);
	const mainTl = useRef<gsap.core.Timeline>(gsap.timeline({paused:true, repeat: -1 }));

	let allIncentives:JSX.Element[] = [];
	if (props.incentives) {
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
		mainTl.current.play();
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<InterIncentivesContainer>
			{allIncentives}
			{/* <InterPrizes ref={prizesRef} /> */}
		</InterIncentivesContainer>
	);
};
