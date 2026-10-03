import { useImperativeHandle, useRef } from "react";
import clsx from "clsx";

import type { TickerItemHandles } from "../ticker.js";

import { TickerItem } from "./item.js";
import { TickerTitle } from "./title.js";
import type { Prize } from "@asm-graphics/types/Prizes.js";
import styles from "./prizes.module.css";

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
		<div className={clsx(styles.tickerPrizesContainer, props.className)} ref={containerRef} style={props.style}>
			<TickerTitle style={{ display: "flex", flexDirection: "column", zIndex: 2 }}>
				<span>Prizes</span>
			</TickerTitle>
			<div style={{ width: "100%", position: "relative" }}>
				<div className={styles.prizesScroller} ref={prizesRef}>
					{props.prizes.map((prize) => (
						<TickerItem
							key={prize.id}
							title={prize.item}
							sub={`${prize.requirement}${prize.requirementSubheading ? ` - ${prize.requirementSubheading}` : ""}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
