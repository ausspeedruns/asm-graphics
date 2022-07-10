import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { CouchInformation, CouchPerson } from '../types/OverlayProps';

import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	ThemeProvider,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { darkTheme } from './theme';
import { OBSAudioIndicator } from '../types/Audio';

const GreenButton = styled(Button)`
	background-color: #4caf50 !important;
	color: #fff !important;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
		0px 1px 5px 0px rgba(0, 0, 0, 0.12);

	&:hover {
		background-color: #00e676 !important;
		box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	}

	&:disabled {
		color: rgba(255, 255, 255, 0.3) !important;
		box-shadow: none !important;
		background-color: rgba(255, 255, 255, 0.12) !important;
	}
`;

const RedButton = styled(Button)`
	background-color: #f44336 !important;
	min-width: 0px !important;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
		0px 1px 5px 0px rgba(0, 0, 0, 0.12);

	&:hover {
		background-color: #ff5252 !important;
		box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	}
`;

const TextfieldStyled = styled(TextField)`
	margin-bottom: 6px !important;

	& .Mui-focused {
		color: #a8bde3 !important;
	}

	& .MuiInput-underline:after {
		border-bottom: 2px solid #a8bde3 !important;
	}

	& .MuiInputBase-input {
		color: #ffffff !important;
	}
`;

export const DashCouch: React.FC = () => {
	const [localHostName, setLocalHostName] = useState('');
	const [localHostPronoun, setLocalHostPronoun] = useState('');
	const [localAudioGate, setLocalAudioGate] = useState(0.7);
	const [couchNamesRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', {
		current: [],
		preview: [],
	});
	const [obsInputsRep] = useReplicant<string[], string[]>('obs-audio-inputs', []);
	const [obsGateRep] = useReplicant<number, number>('obs-audio-gate', 0.7);
	const [obsAudioIndicatorRep] = useReplicant<OBSAudioIndicator[], OBSAudioIndicator[]>('obs-audio-indicator', []);

	useEffect(() => {
		setLocalAudioGate(obsGateRep);
	}, [obsGateRep]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalHostName(event.target.value);
	};

	const handlePronounChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalHostPronoun(event.target.value);
	};

	const addHost = () => {
		let newNamesArray: CouchPerson[];
		if (couchNamesRep.current.length > 0) {
			newNamesArray = [...couchNamesRep.current, { name: localHostName, pronouns: localHostPronoun }];
		} else {
			newNamesArray = [{ name: localHostName, pronouns: localHostPronoun }];
		}

		nodecg.sendMessage('update-hostnames', newNamesArray);

		setLocalHostName('');
		setLocalHostPronoun('');
	};

	const updateAudioGate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(event.target.value);
		setLocalAudioGate(value);
		nodecg.sendMessage('update-obs-gate', value);
	};

	const allHostNames = couchNamesRep.current.map((person, index) => {
		return (
			<HostComponent
				person={person}
				index={index}
				key={index}
				host={person.host}
				inputs={obsInputsRep}
				audioIndicator={obsAudioIndicatorRep.find((audio) => audio.id === person.name)}
			/>
		);
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ position: 'relative' }}>
				<div style={{ display: 'flex', gap: 8 }}>
					<TextfieldStyled fullWidth label="Name" value={localHostName} onChange={handleChange} />
				</div>
				<div style={{ display: 'flex' }}>
					<TextfieldStyled
						style={{ flexShrink: 1 }}
						label="Pronouns"
						value={localHostPronoun}
						onChange={handlePronounChange}
					/>
					<Button onClick={() => setLocalHostPronoun('He/Him')}>He/Him</Button>
					<Button onClick={() => setLocalHostPronoun('She/Her')}>She/Her</Button>
					<Button onClick={() => setLocalHostPronoun('They/Them')}>They/Them</Button>
				</div>
				<div>
					<GreenButton fullWidth startIcon={<Add />} onClick={addHost} disabled={localHostName === ''}>
						Add Host
					</GreenButton>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 5,
						marginTop: 5,
					}}>
					{allHostNames}
				</div>
				<div style={{ marginTop: 16 }}>
					<TextfieldStyled
						value={localAudioGate}
						onChange={updateAudioGate}
						type="number"
						label="Audio Activity Sensitivity / Gate (0-1)"
					/>
				</div>
			</div>
		</ThemeProvider>
	);
};

const HostComponentContainer = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: space-between;
	background: #4d5e80;
	border-radius: 4px;
	padding: 4px 4px 4px 8px;
`;

const IsHost = styled.span`
	font-size: 18px;
	line-height: 36px;
	margin-right: 8px;
	font-weight: bold;
`;

const HostName = styled.span`
	font-size: 18px;
	line-height: 36px;
	margin-right: 8px;
`;

const Pronoun = styled.span`
	font-size: 18px;
	font-weight: lighter;
	line-height: 36px;
`;

interface HostComponentProps {
	person: CouchPerson;
	index: number;
	preview?: boolean;
	host?: boolean;
	inputs?: string[];
	audioIndicator?: OBSAudioIndicator;
}

const HostComponent: React.FC<HostComponentProps> = (props: HostComponentProps) => {
	const [input, setInput] = useState('');

	useEffect(() => {
		if (props.audioIndicator) setInput(props.audioIndicator.inputName);
	}, [props.audioIndicator]);

	const removeName = () => {
		if (props.preview) {
			nodecg.sendMessage('remove-preview-hostname', props.index);
		} else {
			nodecg.sendMessage('remove-hostname', props.index);
			nodecg.sendMessage('remove-obs-audio', props.person);
		}
	};

	const updateObsIndicator = (event: SelectChangeEvent<string>) => {
		setInput(event.target.value);

		if (event.target.value === '') {
			nodecg.sendMessage('remove-obs-audio', props.person.name);
		} else {
			nodecg.sendMessage('update-obs-audio', { id: props.person.name, inputName: event.target.value });
		}
	};

	const AudioInputOptions =
		props?.inputs?.map((input) => (
			<MenuItem key={input} value={input}>
				{input}
			</MenuItem>
		)) ?? [];

	return (
		<HostComponentContainer>
			{props.host && <IsHost>HOST</IsHost>}
			<HostName>
				{props.person.name === '' ? <i style={{ fontWeight: 'lighter' }}>No Host</i> : props.person.name}
			</HostName>
			<Pronoun>{props.person.pronouns}</Pronoun>
			{props.inputs && (
				<FormControl fullWidth>
					<InputLabel id={`obs-input-${props.index}-id`}>Audio Input</InputLabel>
					<Select
						labelId={`obs-input-${props.index}-id`}
						id={`obs-input-${props.index}`}
						value={input}
						label="Audio Input"
						onChange={updateObsIndicator}>
						<MenuItem key={props.index} value={''}>
							<i>None</i>
						</MenuItem>
						{AudioInputOptions}
					</Select>
				</FormControl>
			)}

			{!props.host && (
				<RedButton style={{ alignSelf: 'flex-end' }} onClick={removeName}>
					<Remove />
				</RedButton>
			)}
		</HostComponentContainer>
	);
};

createRoot(document.getElementById('root')!).render(<DashCouch />);
