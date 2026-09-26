import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";

import { Grid, Paper, Stack } from "@mui/material";

import type { Incentive } from "@asm-graphics/types/Incentives";
import type { RunData } from "@asm-graphics/types/RunData";
import styles from "./incentives.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

function removeExtrasInName(name: string) {
	return name.trim().replace(/[:!]/, "").toLowerCase();
}

export function Incentives(props: Props) {
	const [incentivesRep] = useReplicant("incentives");
	const [runDataActiveRep] = useReplicant<RunData>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});

	const removedDeadIncentives = (incentivesRep ?? []).filter((incentive) => {
		if (
			incentive.active ||
			removeExtrasInName(incentive.game) === removeExtrasInName(runDataActiveRep?.game || "")
		) {
			return incentive;
		}

		return undefined;
	});

	const currentRunIncentives = removedDeadIncentives.filter(
		(incentive) => removeExtrasInName(incentive.game) === removeExtrasInName(runDataActiveRep?.game || ""),
	);
	const otherIncentives = removedDeadIncentives.filter(
		(incentive) => removeExtrasInName(incentive.game) !== removeExtrasInName(runDataActiveRep?.game || ""),
	);

	return (
		<div className={clsx(styles.incentivesContainer, props.className)} style={props.style}>
			{currentRunIncentives.length > 0 ? (
				<>
					<section style={{ background: "var(--orange-600)" }}>
						<h1 style={{ background: "var(--orange-400)", color: "black" }}>Current Run:</h1>
						{currentRunIncentives.map((incentive) => {
							return <IncentiveItem key={incentive.index} incentive={incentive} />;
						})}
					</section>
					<section>
						<h1>Coming Up:</h1>
						{otherIncentives.map((incentive) => {
							return <IncentiveItem key={incentive.index} incentive={incentive} />;
						})}
					</section>
				</>
			) : (
				removedDeadIncentives.map((incentive) => {
					return <IncentiveItem key={incentive.index} incentive={incentive} />;
				})
			)}
		</div>
	);
}

/* Incentive Item */

interface ItemProps {
	incentive: Incentive;
}

function IncentiveItem(props: ItemProps) {
	let incentiveData = <></>;

	switch (props.incentive.type) {
		case "Goal": {
			const amountLeft = props.incentive.goal - props.incentive.total;

			incentiveData = (
				<Paper className={styles.goalContainer} elevation={1}>
					<span>${(amountLeft % 1 === 0 ? amountLeft : amountLeft.toFixed(2)).toLocaleString()} Left</span>
					<span>{Math.floor((props.incentive.total / props.incentive.goal) * 100)}%</span>
					<span>
						$
						{(props.incentive.total % 1 === 0
							? props.incentive.total
							: props.incentive.total.toFixed(2)
						).toLocaleString()}{" "}
						/ ${props.incentive.goal.toLocaleString()}
					</span>
				</Paper>
			);
			break;
		}

		case "War": {
			let warData: React.ReactNode = (
				<Paper className={styles.warNoOptions} elevation={1}>No names submitted</Paper>
			);

			if (props.incentive.options.length !== 0) {
				const mutableWarData = props.incentive.options.map((a) => ({ ...a }));
				mutableWarData.sort((a, b) => a.total - b.total);
				warData = mutableWarData
					.map((option) => {
						return (
							<Paper className={styles.warItem} elevation={1} key={option.name}>
								{option.name}: ${option.total.toLocaleString()}
							</Paper>
						);
					})
					.reverse();
			}

			incentiveData = <div className={styles.warContainer}>{warData}</div>;
			break;
		}

		default:
			break;
	}

	return (
		<Paper className={styles.incentiveItemContainer} elevation={2}>
			<Stack>
				<span className={styles.gameTitle}>
					{props.incentive.game} - <i>{props.incentive.incentive}</i>
				</span>
				<span className={styles.notes}>{props.incentive.notes}</span>
			</Stack>

			<Grid container>
				{incentiveData}
				{!props.incentive.active && <div className={styles.disabledCover} />}
			</Grid>
		</Paper>
	);
}
