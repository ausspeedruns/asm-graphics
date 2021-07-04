import React from 'react';
import styled from 'styled-components';

import { RunDataTeam } from '../../types/RunData';

import { Nameplate } from './nameplate';
import { OrangeStripe } from './orange-stripe';

const FacecamContainer = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
`;

const RunnerArea = styled.div`
	display: flex;
	width: 100%;
	position: absolute;
	bottom: 0;
`;

interface FacecamProps {
	teams: RunDataTeam | undefined;
	noCam?: boolean;
	height?: number;
	width?: number;
	className?: string;
	style?: React.CSSProperties;
}

export const Facecam: React.FC<FacecamProps> = (props: FacecamProps) => {
	if (!props.teams) return <></>;

	let allRunnerNames: JSX.Element[];
	if (props.teams.players.length > 1) {
		let alternatingPronounSides = false;
		allRunnerNames = [];
		props.teams.players.forEach((player) => {
			alternatingPronounSides = !alternatingPronounSides;
			allRunnerNames.push(
				<Nameplate
					player={player}
					nameplateLeft={alternatingPronounSides}
					style={{
						fontSize: 25,
					}}
					key={player.id}
				/>,
			);
			allRunnerNames.push(
				<div
					key={player.id + '-divider'}
					style={{
						background: 'var(--asm-orange)',
						minWidth: 2,
						height: 41,
					}}
				/>,
			);
		});

		allRunnerNames.pop();
	} else {
		allRunnerNames = [
			<Nameplate
				key={props.teams.players[0].id}
				player={props.teams.players[0]}
			/>,
		];
	}

	return (
		<FacecamContainer
			style={Object.assign(
				{
					height: props.height,
					width: props.width,
				},
				props.style,
			)}
			className={props.className}>
			{props.noCam && <NoCam />}
			<RunnerArea>{allRunnerNames}</RunnerArea>
		</FacecamContainer>
	);
};

const NoCamContainer = styled.div`
	height: 100%;
	width: 100%;
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const Logo = styled.img`
	object-fit: contain;
	height: 55%;
	width: 80%;
`;

export const NoCam: React.FC = () => {
	return (
		<NoCamContainer>
			<OrangeStripe side="top" />
			<Logo src={'../shared/design/AusSpeedruns-ASM2021-Combined_NoPadding.svg'} />
			<div style={{minHeight: 41}} />	{/* To even out */}
		</NoCamContainer>
	);
};
