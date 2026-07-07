import { useRef, useState } from "react";
import clsx from "clsx";
import { Button, TextField } from "@mui/material";
import styles from "./testing.module.css";
import { GoalBar } from "../goal";
import type { TickerItemHandles } from "../../ticker";
import gsap from "gsap";
import type { Goal } from "@asm-graphics/types/Incentives";
import NumberField from "../../elements/number-field";

interface GoalsProps {
	showcaseBackgroundColour: string;
}

export function Goals(props: GoalsProps) {
	const [gameName, setGameName] = useState("Super Mario 64");
	const [incentiveName, setIncentiveName] = useState("Incentive Name");
	const [total, setTotal] = useState(1000);
	const [goalAmount, setGoalAmount] = useState(2000);

	const ref = useRef<TickerItemHandles>(null);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	const goal: Goal = {
		game: gameName,
		incentive: incentiveName,
		notes: "",
		active: true,
		index: 0,
		id: "test-goal",
		total: total,
		goal: goalAmount,
		type: "Goal",
	};

	return (
		<div className={styles.container}>
			<h2>Goals</h2>
			<div
				className={clsx(styles.showcase, styles.fullWidth)}
				style={{ backgroundColor: props.showcaseBackgroundColour }}
			>
				<GoalBar goal={goal} ref={ref} />
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				<TextField
					label="Game"
					variant="outlined"
					value={gameName}
					onChange={(e) => setGameName(e.target.value)}
				/>
				<TextField
					label="Incentive Name"
					variant="outlined"
					value={incentiveName}
					onChange={(e) => setIncentiveName(e.target.value)}
				/>
				<NumberField label="Total" value={total} onValueChange={(value) => setTotal(Number(value))} />
				<NumberField
					label="Goal Amount"
					value={goalAmount}
					onValueChange={(value) => setGoalAmount(Number(value))}
				/>
			</div>
		</div>
	);
}
