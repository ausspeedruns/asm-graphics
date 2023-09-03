import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

import { TickerItemHandles } from "../ticker";

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
	color: var(--text-light);
	font-size: 27px;
	transform: translate(0px, -64px);
	z-index: 2;
`;

const CTALine = styled.div`
	position: absolute;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const EmphasisFont = styled.span`
	font-family: var(--secondary-font);
`;

interface CTAProps {
	currentTotal?: number;
}

export const TickerCTA = React.forwardRef<TickerItemHandles, CTAProps>((props, ref) => {
	const containerRef = useRef(null);
	const donateRef = useRef(null);
	const incentiveRef = useRef(null);
	const factRef = useRef(null);
	const [fact, setFact] = useState("");

	useEffect(() => {
		setFact(getFact());
	}, []);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.call(() => setFact(getFact()));
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 }, "+=1");

			tl.to(donateRef.current, { xPercent: -100, duration: 2 }, "+=5");
			tl.to(incentiveRef.current, { xPercent: -100, duration: 2 }, "-=2");
			tl.to(incentiveRef.current, { xPercent: -200, duration: 2 }, "+=5");
			tl.to(factRef.current, { xPercent: -100, duration: 2 }, "-=2");

			// End
			tl.to(containerRef.current, { y: 96, duration: 1 }, "+=5");
			tl.set(containerRef.current, { y: -64, duration: 1 });
			tl.set(donateRef.current, { xPercent: 0 });
			tl.set(incentiveRef.current, { xPercent: 100 });
			tl.set(factRef.current, { xPercent: 100 });

			return tl;
		},
	}));

	function getFact() {
		if (!props.currentTotal) return "Let's break our record!";
		let maxFacts = -1;
		if (props.currentTotal >= 75) maxFacts++;
		// if (props.currentTotal >= 150) maxFacts++;
		if (props.currentTotal >= 1000) maxFacts++;
		// if (props.currentTotal >= 10000) maxFacts++;

		const random = Math.round(Math.random() * maxFacts);

		if (maxFacts === -1) return "Let's break our record!";

		return [
			`We have funded <b>${~~(props.currentTotal / 75)}</b> hours of research!`,
			// `We have funded <b>${~~(props.currentTotal / 150)}</b> microscopy imaging sessions!`,
			`We have funded <b>${~~(props.currentTotal / 1000)}</b> small scale drug screening studies!`,
			// `We have funded <b>${~~(props.currentTotal / 10000)}</b> genomic analysis of cancer cells!`,
		][random];
	}

	return (
		<TickerCTAContainer ref={containerRef}>
			<CTALine ref={donateRef} style={{ fontSize: 37 }}>
				<span>Donate at&nbsp;</span>
				<EmphasisFont>ausspeedruns.com</EmphasisFont>
			</CTALine>
			<CTALine ref={incentiveRef} style={{ transform: "translate(100%, 0)" }}>
				<span>Check out challenges at&nbsp;</span>
				<EmphasisFont>challenges.ausspeedruns.com</EmphasisFont>
			</CTALine>
			<CTALine ref={factRef} style={{ transform: "translate(100%, 0)" }}>
				<span dangerouslySetInnerHTML={{ __html: fact }}></span>
			</CTALine>
		</TickerCTAContainer>
	);
});

TickerCTA.displayName = "TickerCTA";
