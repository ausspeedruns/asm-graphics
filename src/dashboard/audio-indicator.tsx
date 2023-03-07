import { RunData } from '@asm-graphics/types/RunData';
import { ThemeProvider, FormControlLabel, RadioGroup, Radio, Checkbox, FormGroup } from '@mui/material';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { darkTheme } from './theme';

const RadioStyled = styled(Radio)`
	color: #fff !important;
	& .Mui-checked {
		color: #2d4e8a !important;
	}
`;

export const DashboardAudio: React.FC = () => {
	const [manualMode, setManualMode] = useState(false);
	const [audioIndicatorRep, DANGEROUS_setAudioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	const [runDataRep] = useReplicant<RunData, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});

	function updateAudioIndicator(_event: React.ChangeEvent<HTMLInputElement>, value: string) {
		if (manualMode) {
			DANGEROUS_setAudioIndicatorRep(value);
		} else {
			nodecg.sendMessage('x32:changeGameAudio', value);
		}
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox checked={manualMode} onChange={(e) => setManualMode(e.target.checked)} />}
					label="Manual Mode"
				/>
			</FormGroup>
			<hr />
			<RadioGroup value={audioIndicatorRep} onChange={updateAudioIndicator}>
				{runDataRep?.teams.map((team) => {
					return team.players.map((player) => {
						return (
							<FormControlLabel
								value={player.id}
								control={<RadioStyled />}
								label={player.name}
								key={player.id}
							/>
						);
					});
				})}
			</RadioGroup>
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root')!).render(<DashboardAudio />);
