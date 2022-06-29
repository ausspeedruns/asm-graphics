import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { RunDataTeam } from '../../types/RunData';

import { Nameplate } from './nameplate';
import ContourShader from './contour-shader';

// @ts-ignore
import GlslCanvas from 'glslCanvas/dist/GlslCanvas.min.js';

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
	let allRunnerNames: JSX.Element[] = [];

	if (!props.teams) {
		allRunnerNames.push(
			<Nameplate
				icon={props.icons ? props.icons[0] : undefined}
				nameplateLeft={false}
				maxWidth={props.maxNameWidth}
				key={'No Player'}
				player={{
					name: 'ASM2022',
					social: { twitch: 'AusSpeedruns' },
					pronouns: 'They/Them',
					id: 'ASM2022',
					teamID: 'ASM2022',
					customData: {},
				}}
			/>,
		);
	} else if (props.teams.length > 1) {
		let alternatingPronounSides = props.pronounStartSide === 'left';
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
		if (props.teams) {
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
					/>,
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
	font-family: National Park;

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
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;

			const sandbox = new GlslCanvas(canvasRef.current);
			sandbox.load(ContourShader);
		}
	}, []);

	return (
		<NoCamContainer>
			<canvas ref={canvasRef} className="glslCanvas" data-fragment={ContourShader}></canvas>
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
