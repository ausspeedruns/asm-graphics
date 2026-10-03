import { useImperativeHandle, useRef, useState } from "react";

import type { War } from "@asm-graphics/types/Incentives";
import type { TickerItemHandles } from "../incentives";
import { FitText } from "@asm-graphics/shared-browser/fit-text";
import styles from "./incent-wars.module.css";

interface GoalProps {
	war: War;
	ref: React.Ref<TickerItemHandles>;
}

const MAX_OPTIONS = 3;

export const WarGame = (props: GoalProps) => {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.war.index.toString() + "a");

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { xPercent: -100 }, { xPercent: 0, duration: 1 }, "-=0.5");

			tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0 });
			tl.addLabel("stagger");
			optionRefs.current.reverse().forEach((optionRef) => {
				tl.add(optionRef.animation(tl), "-=1");
			});
			tl.to(containerRef.current, { opacity: 0, duration: 0 });

			// End
			tl.to(
				containerRef.current,
				{ xPercent: 100, duration: 1 },
				props.war.options.length == 0 ? "+=1" : undefined,
			);

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	const sortedOptions = props.war.options.map((a) => ({ ...a }));
	sortedOptions.sort((a, b) => b.total - a.total);

	const shouldShowMaxOptionsWarning = sortedOptions.length > MAX_OPTIONS;

	const allOptions = [];
	for (let i = 0; i < Math.min(MAX_OPTIONS, sortedOptions.length); i++) {
		const option = sortedOptions[i];

		if (!option) continue;

		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				key={option.name}
				index={sortedOptions.length - i}
				numberOfItems={Math.min(MAX_OPTIONS, sortedOptions.length) + (shouldShowMaxOptionsWarning ? 1 : 0)}
				ref={(el) => {
					if (el) {
						optionRefs.current[i] = el;
					}
				}}
			/>,
		);
	}

	if (shouldShowMaxOptionsWarning) {
		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={{ name: "", total: 0 }}
				highest={highest}
				key={"More Options"}
				moreOptions
				index={1}
				numberOfItems={Math.min(MAX_OPTIONS, sortedOptions.length) + 1}
				ref={(el) => {
					if (el) {
						optionRefs.current[MAX_OPTIONS] = el;
					}
				}}
			/>,
		);
	}

	if (sortedOptions.length == 0) {
		allOptions.push(
			<NoChoicesMade
				ref={(el) => {
					if (el) {
						optionRefs.current[0] = el;
					}
				}}
			/>,
		);
	}

	return (
		<div className={styles.warChoiceContainer} ref={containerRef}>
			<div className={styles.allOptionContainer}>{allOptions}</div>
			{/* <IncentiveContainer>
				<Game text={props.war.game} />
				<IncentiveName text={props.war.incentive} />
			</IncentiveContainer> */}
		</div>
	);
};

const isColour = (strColor: string) => {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== "";
};

interface WarChoiceProps {
	option: War["options"][0];
	highest: number;
	animLabel: string;
	index: number;
	moreOptions?: boolean;
	numberOfItems: number;
	ref: React.Ref<TickerItemHandles>;
}

const WarChoice = (props: WarChoiceProps) => {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const totalRef = useRef<HTMLSpanElement>(null);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(
				containerRef.current,
				{ x: -950 },
				{ x: 0, duration: 1, ease: "power2.out" },
				`stagger+=${props.index / 8}`,
			);
			tl.fromTo(
				progressBarRef.current,
				{ height: 0 },
				{ height: `${percentage}%`, duration: 2, ease: "power4.out" },
				`stagger+=${props.index / 2 + 0.75}`,
			);

			if (percentage > 65) {
				tl.fromTo(
					totalRef.current,
					{ marginBottom: 0, color: "var(--text-light)" },
					{ marginBottom: -46, color: "var(--text-dark)", duration: 2, ease: "power4.out" },
					`stagger+=${props.index / 2 + 0.75}`,
				);
			}

			tl.to(containerRef.current, { x: 950, duration: 1, ease: "power2.in" }, `stagger+=${props.index / 8 + 10}`);
			return tl;
		},
	}));

	if (props.moreOptions) {
		return (
			<div
				className={styles.optionContainer}
				ref={containerRef}
				style={{ justifyContent: "center", maxWidth: `${100 / props.numberOfItems}%` }}
			>
				<div className={styles.textDiv}>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							width: "100%",
							fontSize: 25,
						}}
					>
						<FitText className={styles.optionName} text="More online!" />
					</div>
				</div>
			</div>
		);
	}

	const optionIsColour = isColour(props.option.name);

	return (
		<div className={styles.optionContainer} ref={containerRef} style={{ maxWidth: `${100 / props.numberOfItems}%` }}>
			<div className={styles.progressContainer}>
				<span className={styles.currentAmount} ref={totalRef}>${Math.floor(props.option.total).toLocaleString()}</span>
				<div className={styles.progressBarContainer}
					ref={progressBarRef}
					style={{
						background: optionIsColour ? props.option.name : undefined,
					}}
				/>
			</div>
			<div className={styles.textDiv}>
				<FitText className={styles.optionName} text={props.option.name} />
			</div>
		</div>
	);
};

interface NoChoicesMadeProps {
	ref: React.Ref<TickerItemHandles>;
}

const NoChoicesMade = (props: NoChoicesMadeProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { x: -950 }, { x: 0, duration: 1, ease: "power2.out" });

			tl.to(containerRef.current, { x: 950, duration: 1, ease: "power2.in" }, "+=10");
			return tl;
		},
	}));

	return (
		<div className={styles.noChoicesContainer} ref={containerRef}>
			<span className={styles.noChoiceHeading}>No names submitted</span>
			<span className={styles.noChoiceSubheading}>Donate and write a name!</span>
		</div>
	);
};
