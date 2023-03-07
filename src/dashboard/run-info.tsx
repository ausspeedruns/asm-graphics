import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import useSurroundingRuns from '../hooks/useSurroundingRuns';

const DashRunInformationContainer = styled.div``;

const Header = styled.h1`
	margin: 8px;
`;

const RunContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const RunInfo = styled.span``;

export const DashRunInformation = () => {
	const [_, currentRun, nextRun] = useSurroundingRuns();

	return (
		<DashRunInformationContainer>
			<RunContainer>
				<Header>Current Run</Header>
				<RunInfo>{currentRun?.game}</RunInfo>
				<RunInfo>{currentRun?.category}</RunInfo>
				<RunInfo>{currentRun?.teams.flatMap((team) => team.players.map((player) => player.name)).join(', ')}</RunInfo>
				<RunInfo>{currentRun?.customData.techPlatform}</RunInfo>
				<RunInfo>{currentRun?.customData.specialRequirements}</RunInfo>
			</RunContainer>
			<RunContainer>
				<Header>Next Run</Header>
				<RunInfo>{nextRun?.game}</RunInfo>
				<RunInfo>{nextRun?.category}</RunInfo>
				<RunInfo>{nextRun?.teams.flatMap((team) => team.players.map((player) => player.name)).join(', ')}</RunInfo>
				<RunInfo>{nextRun?.customData.techPlatform}</RunInfo>
				<RunInfo>{nextRun?.customData.specialRequirements}</RunInfo>
			</RunContainer>
		</DashRunInformationContainer>
	);
};

createRoot(document.getElementById('root')!).render(<DashRunInformation />);
