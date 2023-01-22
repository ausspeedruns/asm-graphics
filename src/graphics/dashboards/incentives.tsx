import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { Box, Grid } from '@mui/material';

import { Goal, War } from '@asm-graphics/types/Incentives';
import { RunData } from '@asm-graphics/types/RunData';

const IncentivesContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	padding-right: 24px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

function removeExtrasInName(name: string) {
	return name.trim().replace(/[:!]/, '').toLowerCase();
}

export const Incentives: React.FC<Props> = (props: Props) => {
	const [incentivesRep] = useReplicant<(Goal | War)[], (Goal | War)[]>('incentives', []);
	const [runDataActiveRep] = useReplicant<RunData, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});

	const removedDeadIncentives = incentivesRep.filter((incentive) => {
		if (
			incentive.active ||
			removeExtrasInName(incentive.game) === removeExtrasInName(runDataActiveRep?.game || '')
		) {
			return incentive;
		}

		return undefined;
	});

	return (
		<IncentivesContainer className={props.className} style={props.style}>
			{removedDeadIncentives.map((incentive) => {
				return <IncentiveItem key={incentive.index} incentive={incentive} />;
			})}
		</IncentivesContainer>
	);
};

/* Incentive Item */

const IncentiveItemContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	width: 100%;
	background: #eee;
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
	gap: 2%;
`;

const WarItem = styled(Box)`
	background: #ddd;
	font-weight: bold;
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
	background: #ddd;
	font-weight: bold;
	padding: 1%;
	margin: 1% 1% 1% 0;
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
	incentive: Goal | War;
}

const IncentiveItem: React.FC<ItemProps> = (props: ItemProps) => {
	let incentiveData = <></>;

	switch (props.incentive.type) {
		case 'Goal': {
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
						).toLocaleString()}{' '}
						/ ${props.incentive.goal.toLocaleString()}
					</span>
				</GoalContainer>
			);
			break;
		}

		case 'War': {
			let warData: JSX.Element | JSX.Element[] = <WarNoOptions boxShadow={1}>No names submitted</WarNoOptions>;

			if (props.incentive.options.length !== 0) {
				const mutableWarData = props.incentive.options.map((a) => ({ ...a }));
				mutableWarData.sort((a, b) => a.total - b.total);
				warData = mutableWarData.map((option) => {
					return (
						<WarItem boxShadow={1} key={option.name}>
							{option.name}: ${option.total.toLocaleString()}
						</WarItem>
					);
				}).reverse();
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
				<Grid item container justifyContent="space-between">
					<GameTitle>{props.incentive.game}</GameTitle>
					<IncentiveName>{props.incentive.incentive}</IncentiveName>
				</Grid>
				<Notes>{props.incentive.notes}</Notes>
			</Grid>

			<Grid container>
				{incentiveData}
				{!props.incentive.active && <DisabledCover />}
			</Grid>
		</IncentiveItemContainer>
	);
};
