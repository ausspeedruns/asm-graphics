import React, { useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";

import { TickerItemHandles } from "../ticker";

const TickerASMMContainer = styled.div`
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
	font-size: 37px;
	transform: translate(0px, -64px);
	z-index: 2;
`;

const ASMMLine = styled.div`
	position: absolute;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
`;

const EmphasisFont = styled.span`
	font-family: var(--secondary-font);
	line-height: 64px;
`;

interface Props {
	totalKM?: number;
}

const FREQUENCY = 4;

export const TickerASMM = React.forwardRef<TickerItemHandles, Props>((props, ref) => {
	const containerRef = useRef(null);
	const updateRef = useRef(null);
	const totalRef = useRef(null);
	const learnRef = useRef(null);
	const [displayValue, setDisplayValue] = useState(0);
	const dummyEl = useRef<HTMLDivElement>(null);
	const [numOfLoops, setNumOfLoops] = useState(0);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			setNumOfLoops(numOfLoops + 1);

			if (props.totalKM === 0 || numOfLoops % FREQUENCY !== 0) return tl;

			// Start
			tl.call(() => {
				setDisplayValue(0);
			});
			tl.set(dummyEl.current, { x: 0 });
			tl.set([totalRef.current, learnRef.current], { opacity: 0 });
			tl.set(updateRef.current, { opacity: 1 });
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 }, "+=1");

			tl.set(totalRef.current, { opacity: 1 });
			tl.to(updateRef.current, { yPercent: -100, duration: 2 }, "+=5");
			tl.set(updateRef.current, { opacity: 0 });
			tl.to(totalRef.current, { yPercent: -100, duration: 2 }, "-=2");

			tl.to(dummyEl.current, {
				ease: "power2.easeOut",
				duration: 5,
				x: (props.totalKM ?? 100) / 100,
				onUpdate: () => {
					const dummyElPos = gsap.getProperty(dummyEl.current, "x") ?? 0;
					setDisplayValue(parseFloat(dummyElPos.toString()) * 100);
				},
			});

			tl.set(learnRef.current, { opacity: 1 });
			tl.to(totalRef.current, { yPercent: -200, duration: 2 }, "+=5");
			tl.to(learnRef.current, { yPercent: -100, duration: 2 }, "-=2");

			// End
			tl.set([totalRef.current, updateRef.current], { opacity: 0 });
			tl.to(containerRef.current, { y: 96, duration: 1 }, "+=5");
			tl.set(containerRef.current, { y: -64, duration: 1 });
			tl.set(updateRef.current, { opacity: 1 });
			tl.set(updateRef.current, { yPercent: 0 });
			tl.set(totalRef.current, { yPercent: 100 });
			tl.set(learnRef.current, { yPercent: 100 });

			return tl;
		},
	}));

	return (
		<TickerASMMContainer ref={containerRef}>
			<ASMMLine ref={updateRef}>
				<span>
					<EmphasisFont>Australian Speedrun Marathon Marathon</EmphasisFont> Update
				</span>
			</ASMMLine>
			<ASMMLine ref={totalRef} style={{ transform: "translate(0, 100%)" }}>
				<span>ASM2023 attendees have walked </span>
				<span
					style={{
						margin: "0 8px",
						fontWeight: "bold",
						width: (props.totalKM?.toFixed(0) ?? "").length * 22,
						textAlign: "center",
					}}
				>
					{displayValue.toFixed(0)}
				</span>
				<span>km!</span>
			</ASMMLine>
			<ASMMLine ref={learnRef} style={{ transform: "translate(0, 100%)" }}>
				<span>Learn more at</span>
				<EmphasisFont style={{ marginLeft: 10, marginBottom: -2 }}>AusSpeedruns.com/ASMM</EmphasisFont>
			</ASMMLine>
			<div ref={dummyEl} />
		</TickerASMMContainer>
	);
});

TickerASMM.displayName = "TickerASMM";
