import { useImperativeHandle, useRef } from "react";
import styled from "@emotion/styled";

import type { TickerItemHandles } from "../ticker";

import { TickerItem } from "./item";
import { TickerTitle } from "./title";
import type { Prize } from "@asm-graphics/types/Prizes";

const TickerPrizesContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	z-index: 2;
	transform: translate(0, -64px);
`;

const PrizesScroller = styled.div`
	width: fit-content;
	display: flex;
	align-items: center;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	prizes: Prize[];
	ref?: React.Ref<TickerItemHandles>;
}

export function TickerPrizes(props: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const prizesRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 });

			tl.fromTo(prizesRef.current, { right: "-100%" }, { right: 0, ease: "slow(0.999, 0.05, false)", duration: 10 }, "+=5");

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	return (
		<TickerPrizesContainer ref={containerRef} className={props.className} style={props.style}>
			<TickerTitle style={{ display: "flex", flexDirection: "column", zIndex: 2 }}>
				<span>Prizes</span>
			</TickerTitle>
			<div style={{ width: "100%", position: "relative" }}>
				<PrizesScroller ref={prizesRef}>
					{props.prizes.map((prize) => (
						<TickerItem
							key={prize.id}
							title={prize.item}
							sub={`${prize.requirement}${prize.requirementSubheading ? ` - ${prize.requirementSubheading}` : ""}`}
						/>
					))}
				</PrizesScroller>
			</div>
		</TickerPrizesContainer>
	);
}
