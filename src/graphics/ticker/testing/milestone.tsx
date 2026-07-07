import { useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@mui/material";
import styles from "./testing.module.css";
import type { TickerItemHandles } from "../../ticker";
import gsap from "gsap";
import NumberField from "../../elements/number-field";
import { TickerMilestones } from "../milestones";

interface MilestoneProps {
	showcaseBackgroundColour: string;
}

export function Milestone(props: MilestoneProps) {
	const [total, setTotal] = useState(1000);

	const ref = useRef<TickerItemHandles>(null);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	return (
		<div className={styles.container}>
			<h2>Milestone</h2>
			<div
				className={clsx(styles.showcase, styles.fullWidth)}
				style={{ backgroundColor: props.showcaseBackgroundColour }}
			>
				<TickerMilestones currentTotal={total} ref={ref} />
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				<NumberField label="Total" value={total} onValueChange={(value) => setTotal(Number(value))} />
			</div>
		</div>
	);
}
