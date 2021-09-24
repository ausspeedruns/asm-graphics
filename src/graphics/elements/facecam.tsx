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
	teams: RunDataTeam[] | undefined;
	noCam?: boolean;
	height?: number;
	width?: number;
	maxNameWidth?: number;
	dontAlternatePronouns?: boolean;
	pronounStartSide?: 'left' | 'right';
	icons?: React.ReactNode[];
	className?: string;
	style?: React.CSSProperties;
}

export const Facecam: React.FC<FacecamProps> = (props: FacecamProps) => {
	if (!props.teams) return <></>;

	let allRunnerNames: JSX.Element[];
	if (props.teams.length > 1) {
		let alternatingPronounSides = props.pronounStartSide === 'left';
		allRunnerNames = [];
		props.teams.forEach((team, i) => {
			let id = 'a';
			if (team.name) {
				id = team.id;
				allRunnerNames.push(
					<Nameplate
						icon={props.icons ? props.icons[i] : undefined}
						maxWidth={props.maxNameWidth}
						player={{
							id: team.id,
							teamID: team.id,
							name: team.name,
							customData: {},
							social: {},
						}}
						nameplateLeft={alternatingPronounSides}
						style={{
							fontSize: 25,
						}}
						key={team.id}
					/>,
				);
			} else {
				team.players.forEach((player, i) => {
					id = player.id;
					alternatingPronounSides = !alternatingPronounSides;	
					if (props.dontAlternatePronouns) {
						alternatingPronounSides = props.pronounStartSide === 'left';
					}
					allRunnerNames.push(
						<Nameplate
							icon={props.icons ? props.icons[i] : undefined}
							maxWidth={props.maxNameWidth}
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
							key={id + '-divider'}
							style={{
								background: '#FFC629',
								minWidth: 2,
								height: 41,
							}}
						/>,
					);
				});
			}
		});

		allRunnerNames.pop();
	} else {
		let alternatingPronounSides = props.pronounStartSide === 'left';
		allRunnerNames = [];
		props.teams[0].players.forEach((player, i) => {
			alternatingPronounSides = !alternatingPronounSides;
			if (props.dontAlternatePronouns) {
				alternatingPronounSides = props.pronounStartSide === 'left';
			}
			allRunnerNames.push(
				<Nameplate
					icon={props.icons ? props.icons[i] : undefined}
					nameplateLeft={alternatingPronounSides}
					maxWidth={props.maxNameWidth}
					key={player.id}
					player={player}
				/>
			);
			allRunnerNames.push(
				<div
					key={player.id + '-divider'}
					style={{
						background: 'var(--pax-gold)',
						minWidth: 2,
						height: 41,
					}}
				/>,
			);
		});
		allRunnerNames.pop();
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
			<Logo
				src={
					'../shared/design/AusSpeedruns-ASM2021-Combined_NoPadding.svg'
				}
			/>
			<div style={{ minHeight: 41 }} /> {/* To even out */}
		</NoCamContainer>
	);
};
