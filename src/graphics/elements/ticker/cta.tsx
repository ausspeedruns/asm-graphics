import React, { useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { TickerItemHandles } from '../../ticker';

const TickerCTAContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	text-transform: uppercase;
	color: #F2DAB2;
	font-family: kulturista-web, sans-serif;
	font-size: 37px;
	transform: translate(0px, -64px);
`;

const CTALine = styled.div`
	position: absolute;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const TickerCTA = React.forwardRef<TickerItemHandles>((_props, ref) => {
	const containerRef = useRef(null);
	const donateRef = useRef(null);
	const incentiveRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { y: 0, duration: 1 });

			tl.to(donateRef.current, {xPercent: -100, duration: 2}, '+=10');
			tl.to(incentiveRef.current, {xPercent: -100, duration: 2}, '-=2');

			// End
			tl.to(containerRef.current, { y: 96, duration: 1 }, '+=10');
			tl.set(containerRef.current, { y: -64, duration: 1 });
			tl.set(donateRef.current, {xPercent: 0});
			tl.set(incentiveRef.current, {xPercent: 100});


			return tl;
		},
	}));

	return (
		<TickerCTAContainer ref={containerRef}>
			<CTALine ref={donateRef}>
				<span>Donate at&nbsp;</span>
				<b>ausspeedruns.com</b>
			</CTALine>
			<CTALine ref={incentiveRef} style={{transform: 'translate(100%, 0)'}}>
				<span>Check out incentives at&nbsp;</span>
				<b>incentives.ausspeedruns.com</b>
			</CTALine>
		</TickerCTAContainer>
	);
});

TickerCTA.displayName = 'TickerCTA';
