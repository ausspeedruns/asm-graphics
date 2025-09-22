import React from "react";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

import { Box, Grid } from "@mui/material";

import type { Incentive } from "@asm-graphics/types/Incentives";
import { RunData } from "@asm-graphics/types/RunData";

const IncentivesContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	padding-right: 24px;
	gap: 8px;

	section {
		&,
		* {
			box-sizing: border-box;
		}

		width: 100%;
		border-radius: 8px;
		display: grid;
		gap: 6px;
		padding-bottom: 8px;

		& > div {
			width: calc(100% - 16px);
			margin: 0 8px;
		}
	}

	h1 {
		width: 100%;
		margin: 0;
		background: lightgrey;
		padding: 8px;
		padding-left: 16px;
		border-radius: 8px 8px 0 0;
		border-bottom: 2px solid black;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

function removeExtrasInName(name: string) {
	return name.trim().replace(/[:!]/, "").toLowerCase();
}

export const Incentives: React.FC<Props> = (props: Props) => {
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
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
		<IncentivesContainer className={props.className} style={props.style}>
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
		</IncentivesContainer>
	);
};

/* Incentive Item */

const IncentiveItemContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	width: 100%;
	background: var(--inset-background);
	position: relative;
`;

const GameTitle = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
`;

const IncentiveName = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
`;

const Notes = styled.span`
	font-size: 1.1rem;
`;

const WarContainer = styled.div`
	display: flex;
	flex-grow: 1;
	flex-wrap: wrap;
	margin: 1% 1% 1% 0;
	gap: 8px;
	justify-content: center;
`;

const WarItem = styled(Box)`
	background: var(--inset-background);
	/* font-weight: bold; */
	padding: 2%;
	font-size: 1.2rem;

	&:first-child {
		margin-left: 0;
	}
`;

const WarNoOptions = styled(Box)`
	width: 100%;
	text-align: center;
	font-weight: bold;
	padding: 1%;
	font-size: 1.3rem;
`;

const GoalContainer = styled(Box)`
	display: flex;
	flex-grow: 1;
	justify-content: space-evenly;
	font-size: 1.3rem;
	background: var(--inset-background);
	/* font-weight: bold; */
	padding: 1%;
	margin: 1% 1% 1% 0;
	border: 1px solid var(--text-color);
	border-radius: 4px;
`;

const DisabledCover = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	top: 0px;
	left: 0px;
	border-radius: 7px;
`;

interface ItemProps {
	incentive: Incentive;
}

const IncentiveItem: React.FC<ItemProps> = (props: ItemProps) => {
	let incentiveData = <></>;

	switch (props.incentive.type) {
		case "Goal": {
			const amountLeft = props.incentive.goal - props.incentive.total;

			incentiveData = (
				<GoalContainer boxShadow={1}>
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
				</GoalContainer>
			);
			break;
		}

		case "War": {
			let warData: React.ReactNode = <WarNoOptions boxShadow={1}>No names submitted</WarNoOptions>;

			if (props.incentive.options.length !== 0) {
				const mutableWarData = props.incentive.options.map((a) => ({ ...a }));
				mutableWarData.sort((a, b) => a.total - b.total);
				warData = mutableWarData
					.map((option) => {
						return (
							<WarItem boxShadow={1} key={option.name}>
								{option.name}: ${option.total.toLocaleString()}
							</WarItem>
						);
					})
					.reverse();
			}

			incentiveData = <WarContainer>{warData}</WarContainer>;
			break;
		}

		default:
			break;
	}

	return (
		<IncentiveItemContainer boxShadow={2}>
			<Grid container direction="column">
				<GameTitle>{props.incentive.game} - <i>{props.incentive.incentive}</i></GameTitle>
				<Notes>{props.incentive.notes}</Notes>
			</Grid>

			<Grid container>
				{incentiveData}
				{!props.incentive.active && <DisabledCover />}
			</Grid>
		</IncentiveItemContainer>
	);
};
