import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import { Goal, War } from '@asm-graphics/types/Incentives';

import { WarGame } from './incent-wars';
import { GoalBar } from './incent-goal';
import { InterIncentASMM } from './incent-asmm';
// import { InterPrizes } from './prizes';

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;
`;

export interface TickerItemHandles {
	animation(tl: gsap.core.Timeline): gsap.core.Timeline;
	reset(tl: gsap.core.Timeline): gsap.core.Timeline;
}

interface IncentivesProps {
	incentives: (Goal | War)[];
	asmm?: number;
}

export const InterIncentives = (props: IncentivesProps) => {
	// const prizesRef = useRef<TickerItemHandles>(null);
	const incentivesRef = useRef<TickerItemHandles[]>([]);
	// const mainTl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true, repeat: -1 }));

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

	if (typeof props.asmm !== 'undefined' || props.asmm == 0)
	{
		allIncentives.push(<InterIncentASMM key={'InterIncentASMM'} ref={el => el ? incentivesRef.current[incentivesRef.current.length] = el : undefined} totalKM={props.asmm} />)
	}

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		const localTl = gsap.timeline({ onComplete: runLoop });

		incentivesRef.current.forEach(incentiveEl => {
			localTl.add(showContent(incentiveEl));
		});

		localTl.play();
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<InterIncentivesContainer>
			{allIncentives}
			{/* {props.incentives.length > 0 && <GoalBar goal={props.incentives[0] as Goal} />} */}
			
			{/* <InterPrizes ref={prizesRef} /> */}
		</InterIncentivesContainer>
	);
};
