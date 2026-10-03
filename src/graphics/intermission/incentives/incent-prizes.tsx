import { Fragment, type Ref, useImperativeHandle, useRef } from "react";

import type { TickerItemHandles } from "../incentives";
import { FitText } from "@asm-graphics/shared-browser/fit-text";

import type { Prize } from "@asm-graphics/types/Prizes";
import styles from "./incent-prizes.module.css";

const PRIZE_PAGE_LENGTH = 1;
const PRIZE_SPEED = 2;
const PRIZE_DURATION = 5;
const PRIZE_PAGE_STAGGER = 0.05;

interface PrizesProps {
	prizes: Prize[];
	ref: Ref<TickerItemHandles>;
}

export function Prizes(props: PrizesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const prizesRefs = useRef<TickerItemHandles[]>([]);

	const groupedPrizes: Prize[][] = [];
	for (let i = 0; i < props.prizes.length; i += PRIZE_PAGE_LENGTH) {
		groupedPrizes.push(props.prizes.slice(i, i + PRIZE_PAGE_LENGTH));
	}

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.addLabel("prizesStart");
			tl.fromTo(containerRef.current, { xPercent: -110 }, { xPercent: 0 });
			prizesRefs.current.reverse().forEach((prizeRef) => {
				tl.add(prizeRef.animation(tl));
			});
			return tl;
		},
	}));

	return (
		<div className={styles.prizesContainer} ref={containerRef}>
			{groupedPrizes.map((prizes, i) => (
				<div className={styles.prizesPage} key={i}>
					{prizes.map((prize, j) => (
						<Prize
							prize={prize}
							index={i * PRIZE_PAGE_LENGTH + j}
							key={prize.id}
							ref={(el) => {
								prizesRefs.current[i * PRIZE_PAGE_LENGTH + j] = el!;
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}

Prizes.displayName = "Prizes";

// const SubItem = styled.span`
// 	font-weight: normal;
// `;

const renderTextWithLineBreaks = (text: string) => {
	const lines = text.split("\n");
	return lines.map((line, index) => (
		<Fragment key={index}>
			{line}
			{index !== lines.length - 1 && <br />}
		</Fragment>
	));
};

interface PrizeProps {
	prize: Prize;
	index: number;
	ref: React.Ref<TickerItemHandles>;
}

const PRIZE_STAGGER_INVERSE = 1 / PRIZE_PAGE_STAGGER;

const Prize = (props: PrizeProps) => {
	const containerRef = useRef(null);

	const pageTimeOffset = Math.floor(props.index / PRIZE_PAGE_LENGTH) * (PRIZE_DURATION + 1.5);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: PRIZE_SPEED, ease: "power3.out" },
				`prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + pageTimeOffset}`,
			);

			// console.log(`${props.prize.item} | prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + pageTimeOffset}`, props.index, PRIZE_STAGGER_INVERSE, pageTimeOffset)

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: PRIZE_SPEED, ease: "power3.in" },
				`prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + PRIZE_DURATION + pageTimeOffset}`,
			);
			return tl;
		},
	}));

	return (
		<div className={styles.upcomingRunContainer} ref={containerRef}>
			<div className={styles.metaDataContainer}>
				<div className={styles.requirementsContainer}>
					<span className={styles.requirement} style={{ fontSize: props.prize.requirement.includes("\n") ? "70%" : undefined }}>
						{renderTextWithLineBreaks(props.prize.requirement)}
					</span>
					{props.prize.requirementSubheading && (
						<span className={styles.requirementSubheading}>{props.prize.requirementSubheading}</span>
					)}
				</div>
				<span className={styles.quantity}>
					{props.prize.quantity}
					<span style={{ fontSize: "75%" }}>x</span>
				</span>
			</div>
			<div className={styles.itemContainer}>
				{/* <Item>
					{props.prize.item} <SubItem>{props.prize.subItem}</SubItem>
				</Item> */}
				<FitText className={styles.item} text={props.prize.item} />
			</div>
		</div>
	);
};
