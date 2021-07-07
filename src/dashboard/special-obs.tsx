import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { darkTheme } from './theme';
import { Checkbox, FormControlLabel, ThemeProvider } from '@material-ui/core';
import { useReplicant } from 'use-nodecg';

const SpecialOBSContainer = styled.div``;

export const SpecialOBS: React.FC = () => {
	const [discordGameplay, setDiscordGameplay] = useState(false);
	const [streamScaleRep, setStreamScaleRep] = useReplicant<boolean, boolean>('special-stream-scale', false);

	const discordGameplayHandler = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		nodecg.sendMessage('discord-gameplay', checked);
		setDiscordGameplay(checked);
	};

	const streamScaleHandler = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setStreamScaleRep(checked);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<SpecialOBSContainer>
				<FormControlLabel
					control={<Checkbox color="primary" value={discordGameplay} onChange={discordGameplayHandler} />}
					label="Turn on Host microphone for gameplay (Hollow Knight & RE7)"
					labelPlacement="start"
				/>
				<FormControlLabel
					control={<Checkbox color="primary" value={streamScaleRep} onChange={streamScaleHandler} />}
					label="Resize ASM_Station1 full stream to fit in Widescreen graphic (RE7)"
					labelPlacement="start"
				/>
			</SpecialOBSContainer>
		</ThemeProvider>
	);
};

render(<SpecialOBS />, document.getElementById('special-obs'));
