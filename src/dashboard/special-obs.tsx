import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { darkTheme } from './theme';
import { Checkbox, FormControlLabel, ThemeProvider } from '@material-ui/core';

const SpecialOBSContainer = styled.div``;

export const SpecialOBS: React.FC = () => {
	const [discordGameplay, setDiscordGameplay] = useState(false);
	const [specialStreamScale, setSpecialStreamScale] = useState(false);

	const discordGameplayHandler = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		nodecg.sendMessage('discord-gameplay', checked);
		setDiscordGameplay(checked);
	};

	const streamScaleHandler = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		nodecg.sendMessage('ps5-stream-scale', checked);
		setSpecialStreamScale(checked);
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
					control={<Checkbox color="primary" value={specialStreamScale} onChange={streamScaleHandler} />}
					label="Resize ASM_Station1 full stream to fit in Widescreen graphic (RE7)"
					labelPlacement="start"
				/>
			</SpecialOBSContainer>
		</ThemeProvider>
	);
};

render(<SpecialOBS />, document.getElementById('special-obs'));
