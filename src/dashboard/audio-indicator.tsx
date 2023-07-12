import { RunData } from '@asm-graphics/types/RunData';
import { ThemeProvider, FormControlLabel, RadioGroup, Radio, Checkbox, FormGroup, TextField, Slider } from '@mui/material';
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

const marks = [
	{
		value: 1,
		label: '+10',
	},
	{
		value: 0.876,
		label: '5',
	},
	{
		value: 0.75,
		label: '0',
	},
	{
		value: 0.626,
		label: '-5',
	},
	{
		value: 0.5,
		label: '-10',
	},
	{
		value: 0.374,
		label: '-20',
	},
	{
		value: 0.253,
		label: '-30',
	},
	{
		value: 0.13,
		label: '-50',
	},
	{
		value: 0,
		label: '-∞',
	},
];

function isNumeric(str: string) {
	if (typeof str != 'string') return false; // we only process strings!
	return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export const DashboardAudio: React.FC = () => {
	const [manualMode, setManualMode] = useState(false);
	const [audioIndicatorRep, DANGEROUS_setAudioIndicatorRep] = useReplicant<string>('audio-indicator', '');
	const [runDataRep] = useReplicant<RunData | undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [audioGateRep, setAudioGateRep] = useReplicant<number>('audio-gate', -5);
	const [hostLevelRep, setHostLevelRep] = useReplicant<number>('x32:host-level', 0.75);

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
			<TextField
				value={audioGateRep}
				onChange={(e) => {
					if (isNumeric(e.target.value)) setAudioGateRep(parseFloat(e.target.value));
				}}
				label="Audio Gate"
				type="number"
			/>
			<Slider
				style={{ margin: 'auto' }}
				size="small"
				value={hostLevelRep ?? 0}
				onChange={(_, newVal) => {
					if (!Array.isArray(newVal)) {
						setHostLevelRep(newVal);
					}
				}}
				min={0}
				max={1}
				step={0.001}
				marks={marks}
			/>
			
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root')!).render(<DashboardAudio />);
