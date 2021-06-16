import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { CouchInformation } from '../types/OverlayProps';

import { Button, TextField, ThemeProvider } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import { darkTheme } from './theme';

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

export const DashHosts: React.FC = () => {
	const [localPreviewHostName, setLocalPreviewHostName] = useState('');
	const [localHostName, setLocalHostName] = useState('');
	const [couchNamesRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', {current: [], preview: []});
	console.log(couchNamesRep)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalHostName(event.target.value);
	};

	const handlePreviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalPreviewHostName(event.target.value);
	};

	const addHost = () => {
		let newNamesArray: string[];
		if (couchNamesRep.current.length > 0) {
			newNamesArray = [...couchNamesRep.current, localHostName];
		} else {
			newNamesArray = [localHostName];
		}

		nodecg.sendMessage('update-hostnames', newNamesArray);

		setLocalHostName('');
	};

	const addPreviewHost = () => {
		let newNamesArray: string[];
		if (couchNamesRep.preview.length > 0) {
			newNamesArray = [...couchNamesRep.preview, localPreviewHostName];
		} else {
			newNamesArray = [localPreviewHostName];
		}

		nodecg.sendMessage('update-preview-hostnames', newNamesArray);

		setLocalPreviewHostName('');
	};

	const allHostNames = couchNamesRep.current.map((name, index) => {
		return <HostComponent name={name} index={index} key={index} />;
	});

	const previewHostName = couchNamesRep.preview.map((name, index) => {
		return <HostComponent name={name} index={index} key={index} preview />;
	});

	return (
		<ThemeProvider theme={darkTheme}>
			Preview
			<TextfieldStyled
				fullWidth
				label="Preview Host"
				value={localPreviewHostName}
				onChange={handlePreviewChange}
			/>
			<GreenButton fullWidth startIcon={<Add />} onClick={addPreviewHost} disabled={localPreviewHostName === ''}>
				Add Host
			</GreenButton>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 5 }}>{previewHostName}</div>
			<hr />
			Live
			<TextfieldStyled fullWidth label="Live Host" value={localHostName} onChange={handleChange} />
			<div>
				<GreenButton fullWidth startIcon={<Add />} onClick={addHost} disabled={localHostName === ''}>
					Add Host
				</GreenButton>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 5 }}>{allHostNames}</div>
		</ThemeProvider>
	);
};

const HostComponentContainer = styled.div`
	background: #4d5e80;
	border-radius: 4px;
	padding: 4px 4px 4px 8px;
`;

const HostName = styled.span`
	font-size: 18px;
	line-height: 36px;
`;

interface HostComponentProps {
	name: string;
	index: number;
	preview?: boolean;
}

const HostComponent: React.FC<HostComponentProps> = (props: HostComponentProps) => {
	const removeName = () => {
		if (props.preview) {
			nodecg.sendMessage('remove-preview-hostname', props.index);
		} else {
			nodecg.sendMessage('remove-hostname', props.index);
		}
	};

	/* Removed as it causes a ux anti pattern */
	// This is a bit buggy but it kinda works, it sets the cursor back to the start after each change. So only minor edits
	// const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	nodecg.sendMessage('rename-hostnames', { name: event.target.value, index: props.index });
	// };

	return (
		<HostComponentContainer>
			{/* <TextfieldStyled value={props.name} onChange={updateName} /> */}
			<HostName>{props.name === ' ' ? <i style={{ fontWeight: 'lighter' }}>No Host</i> : props.name}</HostName>
			<RedButton style={{ float: 'right' }} onClick={removeName}>
				<Remove />
			</RedButton>
		</HostComponentContainer>
	);
};

render(<DashHosts />, document.getElementById('hosts'));
