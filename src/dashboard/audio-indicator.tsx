import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { DashAudio } from './obs';

const DashboardAudioContainer = styled.div``;

export const DashboardAudio: React.FC = () => {

	return (
		<DashboardAudioContainer>
			<DashAudio />
		</DashboardAudioContainer>
	);
};

createRoot(document.getElementById('root')!).render(<DashboardAudio />);
