import { useEffect, useImperativeHandle, useRef, useState } from "react";
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
	font-family: var(--main-font);
`;

const CTALine = styled.div`
	position: absolute;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	/* margin-top: -8px; */
`;

const EmphasisFont = styled.span`
	/* font-family: var(--main-font); */
	font-family: var(--secondary-font);
	font-weight: bold;
	margin-bottom: -5px;
`;

interface CTAProps {
	currentTotal?: number;
	ref?: React.Ref<TickerItemHandles>;
}

function getFact(total?: number) {
	if (!total) return "Let's break our record!";
	let maxFacts = -1;
	if (total >= 75) maxFacts++;
	// if (total >= 150) maxFacts++;
	if (total >= 1000) maxFacts++;
	// if (total >= 10000) maxFacts++;

	const random = Math.round(Math.random() * maxFacts);

	if (maxFacts === -1) return "Let's break our record!";

	return [
		// `We have funded <b>${~~(total / 75)}</b> hours of research!`,
		// `We have funded <b>${~~(total / 150)}</b> microscopy imaging sessions!`,
		// `We have funded <b>${~~(total / 1000)}</b> small scale drug screening studies!`,
		// `We have funded <b>${~~(total / 10000)}</b> genomic analysis of cancer cells!`,
	][random];
}

export function TickerCTA(props: CTAProps) {
	const containerRef = useRef(null);
	const donateRef = useRef(null);
	const incentiveRef = useRef(null);
	// const factRef = useRef(null);
	// const [fact, setFact] = useState("");

	// useEffect(() => {
	// 	setFact(getFact(props.currentTotal));
	// }, [props.currentTotal]);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			// tl.call(() => setFact(getFact(props.currentTotal)));
			// tl.set(containerRef.current, { y: -64 });
			tl.set(incentiveRef.current, { xPercent: 100 });
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 }, "+=1");

			tl.fromTo(donateRef.current, { xPercent: 0 }, { xPercent: -100, duration: 2 }, "+=5");
			tl.to(incentiveRef.current, { xPercent: 0, duration: 2 }, "-=2");
			// tl.to(incentiveRef.current, { xPercent: -200, duration: 2 }, "+=5");
			// tl.to(factRef.current, { xPercent: -100, duration: 2 }, "-=2");

			// End
			tl.to(containerRef.current, { y: 96, duration: 1 }, "+=5");
			// tl.set(containerRef.current, { y: -64, duration: 1 });
			// tl.set(donateRef.current, { xPercent: 0 });
			// tl.set(incentiveRef.current, { xPercent: 100 });
			// tl.set(factRef.current, { xPercent: 100 });

			return tl;
		},
	}));

	return (
		<TickerCTAContainer ref={containerRef}>
			<CTALine ref={donateRef} style={{ fontSize: 37 }}>
				<span>Donate at&nbsp;</span>
				<EmphasisFont>ausspeedruns.com</EmphasisFont>
			</CTALine>
			<CTALine ref={incentiveRef}>
				<span>Check out incentives at&nbsp;</span>
				<EmphasisFont>ausspeedruns.com/incentives</EmphasisFont>
			</CTALine>
			{/* <CTALine ref={factRef} style={{ transform: "translate(100%, 0)" }}>
				<span dangerouslySetInnerHTML={{ __html: fact }}></span>
			</CTALine> */}
		</TickerCTAContainer>
	);
}
