import React from 'react';
import styled from 'styled-components';

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
	teams: RunDataTeam | undefined;
	height?: number;
	width?: number;
	className?: string;
	style?: React.CSSProperties;
}

export const Facecam: React.FC<FacecamProps> = (props: FacecamProps) => {
	if (!props.teams) return <></>;

	let allRunnerNames;
	if (props.teams.players.length > 1) {
		allRunnerNames = props.teams.players.map((player) => {
			return (
				<Nameplate
					name={player.name}
					twitch={player.social.twitch}
					style={{
						width: `${100 / props.teams!.players.length}%`,
					}}
					key={player.id}
				/>
			);
		});
	} else {
		allRunnerNames = (
			<Nameplate name={props.teams.players[0].name} />
		);
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
			<RunnerArea>{allRunnerNames}</RunnerArea>
		</FacecamContainer>
	);
};
