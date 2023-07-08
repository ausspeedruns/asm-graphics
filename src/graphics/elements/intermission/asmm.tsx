import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import gsap, { Power2 } from 'gsap';

const ASMMContainer = styled.div`
	height: 359px;
	width: 640px;
	background: var(--asm-orange);
	color: var(--text-light);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Text = styled.div`
	font-size: 40px;
	text-align: center;
	text-wrap: balance;
`;

const Total = styled.div`
	font-size: 80px;
	font-weight: bold;
`;

const KM = styled.span`
	font-size: 60px;
	font-weight: normal;
`;

const LearnMore = styled.div`
	font-size: 20px;
	font-weight: light;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	totalKM: number;
}

export const ASMM = (props: Props) => {
	const [displayValue, setDisplayValue] = useState(0);
	const dummyEl = useRef<HTMLDivElement>(null);

	gsap.to(dummyEl.current, {
		ease: Power2.easeOut,
		duration: 5,
		x: props.totalKM / 100,
		onUpdate: () => {
			const dummyElPos = gsap.getProperty(dummyEl.current, 'x') ?? 0;
			setDisplayValue(parseFloat(dummyElPos.toString()) * 100);
		},
	});

	return (
		<ASMMContainer className={props.className} style={props.style}>
			<Text>The ASM2023 attendees have walked</Text>
			<Total>{displayValue}<KM>KM!</KM></Total>
			<LearnMore>Learn more at AusSpeedruns.com</LearnMore>
		</ASMMContainer>
	);
};
