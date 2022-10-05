import React from 'react';
import styled from 'styled-components';
import { OBSAudioIndicator } from '../../types/Audio';

import { RunDataTeam } from '../../types/RunData';

import { Nameplate } from './nameplate';

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
	audioIndicator?: OBSAudioIndicator[];
	className?: string;
	style?: React.CSSProperties;
	verticalCoop?: boolean;
}

const NAMEPLATE_HEIGHT = 41;
const NAMEPLATE_HEIGHT_VERTICAL = 61;

export const Facecam: React.FC<FacecamProps> = (props: FacecamProps) => {
	let allRunnerNames: JSX.Element[] = [];

	if (!props.teams) {
		// Fallback
		allRunnerNames.push(
			<Nameplate
				icon={props.icons ? props.icons[0] : undefined}
				nameplateLeft={false}
				maxWidth={props.maxNameWidth}
				key={'No Player'}
				player={{
					name: 'ASAP2022',
					social: { twitch: 'AusSpeedruns' },
					pronouns: 'They/Them',
					id: 'ASAP2022',
					teamID: 'ASAP2022',
					customData: {},
				}}
			/>,
		);
	} else if (props.teams.length > 1) {
		// Versus
		let alternatingPronounSides = props.pronounStartSide === 'left';
		props.teams.forEach((team, i) => {
			let id = 'a';
			if (team.name) {
				// Versus has a team name
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
						speaking={props.audioIndicator?.find((audio) => audio.id === team.id)?.active}
					/>,
				);
			} else {
				// Versus does not have a team name, display each name
				team.players.forEach((player) => {
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
							speaking={props.audioIndicator?.find((audio) => audio.id === player.id)?.active}
						/>,
					);
					allRunnerNames.push(
						<div
							key={id + '-divider'}
							style={{
								background: '#FFC629',
								minWidth: 2,
								height: NAMEPLATE_HEIGHT,
							}}
						/>,
					);
				});
			}
		});

		allRunnerNames.pop();
	} else {
		let alternatingPronounSides = props.pronounStartSide === 'right';
		// Single Player/Coop, display each player's name
		props.teams[0].players.forEach((player, i) => {
			alternatingPronounSides = !alternatingPronounSides;
			if (props.dontAlternatePronouns) {
				alternatingPronounSides = props.pronounStartSide === 'right';
			}
			allRunnerNames.push(
				<Nameplate
					icon={props.icons ? props.icons[i] : undefined}
					nameplateLeft={alternatingPronounSides}
					maxWidth={props.maxNameWidth}
					key={player.id}
					player={player}
					speaking={props.audioIndicator?.find((audio) => audio.id === player.id)?.active}
					vertical={props.teams![0].players.length > 1 ? props.verticalCoop : false}
				/>,
			);
			allRunnerNames.push(
				<div
					key={player.id + '-divider'}
					style={{
						background: 'var(--sec)',
						minWidth: 2,
						height: props.verticalCoop ? NAMEPLATE_HEIGHT_VERTICAL : NAMEPLATE_HEIGHT,
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
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	position: relative;
	font-family: Noto Sans;

	& canvas {
		width: 100%;
		height: 100%;
	}
`;

const SocialMedia = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 41px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	& > div {
		margin: 5px 0;
	}
`;

const SocialMediaItem = styled.div`
	display: flex;
	align-items: center;

	& > img {
		height: 40px;
		margin: 0 5px;
	}
`;

const SocialMediaLabel = styled.span`
	color: #f2dab2;
	font-size: 30px;
	margin: 0 5px;
`;

export const NoCam: React.FC = () => {
	return (
		<NoCamContainer>
			<SocialMedia>
				<SocialMediaItem>
					<img src={require('../media/twitter.svg')} />
					<SocialMediaLabel>@ AusSpeedruns</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaItem>
					<img src={require('../media/youtube.svg')} />
					<SocialMediaLabel>Australian Speedruns</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaItem>
					<img src={require('../media/discord.svg')} />
					<SocialMediaLabel>discord.ausspeedruns.com</SocialMediaLabel>
				</SocialMediaItem>
				<SocialMediaLabel
					style={{
						fontSize: 30,
						fontWeight: 'bold',
						color: '#F2DAB2',
					}}>
					#PAXxAusSpeedruns2021
				</SocialMediaLabel>
			</SocialMedia>
		</NoCamContainer>
	);
};
