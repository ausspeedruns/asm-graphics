import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import gsap, { Power2 } from 'gsap';

// import { War } from '@asm-graphics/types/Incentives';
import { TickerItemHandles } from './incentives';
// import { FitText } from '../fit-text';

const InterIncentASMMContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	color: var(--text-light);
	font-size: 37px;
	transform: translate(-1000px, 0);
	overflow: hidden;
	padding: 10px 120px;
	box-sizing: border-box;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: relative;
	text-align: center;
`;

const Total = styled.div`
	font-size: 80px;
	font-weight: bold;
	line-height: 95px;
`;

const KM = styled.span`
	font-size: 60px;
	font-weight: normal;
`;

const LearnMore = styled.div`
	font-size: 20px;
	font-weight: light;
`;

const Website = styled.span`
	/* font-weight: bold; */
	font-family: var(--secondary-font);
`;

interface Props
{
	totalKM: number;
}

export const InterIncentASMM = React.forwardRef<TickerItemHandles, Props>((props, ref) => {
	const containerRef = useRef(null);
	const [displayValue, setDisplayValue] = useState(0);
	const dummyEl = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start

			tl.call(() => {
				setDisplayValue(0);
			})
			tl.set(dummyEl.current, { x: 0 });
			tl.addLabel('warStart');
			tl.set(containerRef.current, { x: -1000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });
			tl.to(dummyEl.current, {
				ease: Power2.easeOut,
				duration: 5,
				x: props.totalKM / 100,
				onUpdate: () => {
					const dummyElPos = gsap.getProperty(dummyEl.current, 'x') ?? 0;
					setDisplayValue(parseFloat(dummyElPos.toString()) * 100);
				},
			});

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '+20');
			tl.set(containerRef.current, { x: -1000, duration: 1 });

			return tl;
		},
		reset(tl) {
			return tl;
		},
	}));

	return (
		<InterIncentASMMContainer ref={containerRef}>
			<Header>The ASM2023 attendees have walked</Header>
			<Total>{displayValue.toFixed(0)}<KM>KM!</KM></Total>
			<LearnMore>Learn more about ASMM at <Website>AusSpeedruns.com/ASMM</Website></LearnMore>
			<div ref={dummyEl} />
		</InterIncentASMMContainer>
	);
});

InterIncentASMM.displayName = 'InterIncentASMM';
