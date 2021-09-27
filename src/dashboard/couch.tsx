import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { CouchInformation, CouchPerson, NoCam } from '../types/OverlayProps';

import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	ThemeProvider,
} from '@material-ui/core';
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

const LiveOverlay = styled.div`
	background: #000000a4;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 2;
	border-radius: 4px;
`;

export const DashCouch: React.FC = () => {
	const [localPreviewHostName, setLocalPreviewHostName] = useState('');
	const [localPreviewPronoun, setLocalPreviewPronoun] = useState('');
	const [localHostName, setLocalHostName] = useState('');
	const [localHostPronoun, setLocalHostPronoun] = useState('');
	const [couchNamesRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', {
		current: [],
		preview: [],
	});

	const [noCamsRep] = useReplicant<NoCam, NoCam>('no-cam', { current: false, preview: false });
	const [discordMembers] = useReplicant<DACBOTMember[], DACBOTMember[]>('memberList', [], {
		namespace: 'nodecg-dacbot',
	});

	const [editLive, setEditLive] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalHostName(event.target.value);
	};

	const handlePronounChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalHostPronoun(event.target.value);
	};

	const handlePreviewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalPreviewHostName(event.target.value);
	};

	const handlePreviewPronounChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalPreviewPronoun(event.target.value);
	};

	const addHost = () => {
		let newNamesArray: CouchPerson[];
		if (couchNamesRep.current.length > 0) {
			newNamesArray = [
				...couchNamesRep.current,
				{ name: localHostName, pronouns: localHostPronoun },
			];
		} else {
			newNamesArray = [{ name: localHostName, pronouns: localHostPronoun }];
		}

		nodecg.sendMessage('update-hostnames', newNamesArray);

		setLocalHostName('');
		setLocalHostPronoun('');
	};

	const addPreviewHost = () => {
		let newNamesArray: CouchPerson[];
		if (couchNamesRep.preview.length > 0) {
			newNamesArray = [
				...couchNamesRep.preview,
				{ name: localPreviewHostName, pronouns: localPreviewPronoun },
			];
		} else {
			newNamesArray = [{ name: localPreviewHostName, pronouns: localPreviewPronoun }];
		}

		nodecg.sendMessage('update-preview-hostnames', newNamesArray);

		setLocalPreviewHostName('');
		setLocalPreviewPronoun('');
	};

	const allHostNames = couchNamesRep.current.map((person, index) => {
		return <HostComponent person={person} index={index} key={index} discordUsers={discordMembers} />;
	});

	const previewHostName = couchNamesRep.preview.map((person, index) => {
		return <HostComponent person={person} index={index} key={index} discordUsers={discordMembers} preview />;
	});

	return (
		<ThemeProvider theme={darkTheme}>
			Next Run
			<div style={{ display: 'flex', gap: 8 }}>
				<TextfieldStyled
					fullWidth
					label="Preview Host"
					value={localPreviewHostName}
					onChange={handlePreviewNameChange}
				/>
			</div>
			<div style={{ display: 'flex' }}>
				<TextfieldStyled
					style={{ flexShrink: 1 }}
					label="Pronouns"
					value={localPreviewPronoun}
					onChange={handlePreviewPronounChange}
				/>
				<Button onClick={() => setLocalPreviewPronoun('He/Him')}>He/Him</Button>
				<Button onClick={() => setLocalPreviewPronoun('She/Her')}>She/Her</Button>
				<Button onClick={() => setLocalPreviewPronoun('They/Them')}>They/Them</Button>
			</div>
			<GreenButton fullWidth startIcon={<Add />} onClick={addPreviewHost} disabled={localPreviewHostName === ''}>
				Add Host
			</GreenButton>
			<FormControlLabel
				control={
					<Checkbox
						color="primary"
						value={noCamsRep.preview}
						onChange={(e) => nodecg.sendMessage('no-cam-preview', e.target.checked)}
					/>
				}
				label="No runner cam?"
				labelPlacement="start"
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 5,
					marginTop: 5,
				}}>
				{previewHostName}
			</div>
			<hr />
			<div style={{ position: 'relative' }}>
				{!editLive && <LiveOverlay />}
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					Live
					<Button
						variant="contained"
						style={{ zIndex: 3 }}
						onClick={() => {
							setEditLive(!editLive);
						}}>
						{editLive ? 'Finish' : 'Edit'}
					</Button>
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<TextfieldStyled
						fullWidth
						label="Live Host"
						value={localHostName}
						onChange={handleChange}
						disabled={!editLive}
					/>
				</div>
				<div style={{ display: 'flex' }}>
					<TextfieldStyled
						style={{ flexShrink: 1 }}
						label="Pronouns"
						value={localHostPronoun}
						onChange={handlePronounChange}
						disabled={!editLive}
					/>
					<Button onClick={() => setLocalHostPronoun('He/Him')} disabled={!editLive}>
						He/Him
					</Button>
					<Button onClick={() => setLocalHostPronoun('She/Her')} disabled={!editLive}>
						She/Her
					</Button>
					<Button onClick={() => setLocalHostPronoun('They/Them')} disabled={!editLive}>
						They/Them
					</Button>
				</div>
				<div>
					<GreenButton
						fullWidth
						startIcon={<Add />}
						onClick={addHost}
						disabled={localHostName === '' || !editLive}>
						Add Host
					</GreenButton>
				</div>
				<FormControlLabel
					control={
						<Checkbox
							color="primary"
							value={noCamsRep.current}
							onChange={(e) => nodecg.sendMessage('no-cam-current', e.target.checked)}
						/>
					}
					label="No runner cam?"
					labelPlacement="start"
					disabled={!editLive}
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 5,
						marginTop: 5,
					}}>
					{allHostNames}
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

interface DACBOTMember {
	avatar: string;
	id: string;
	muted: boolean;
	name: string;
}

interface HostComponentProps {
	person: CouchPerson;
	index: number;
	preview?: boolean;
	discordUsers: DACBOTMember[];
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
			<HostName>
				{props.person.name === ' ' ? <i style={{ fontWeight: 'lighter' }}>No Host</i> : props.person.name}
			</HostName>
			<Pronoun>{props.person.pronouns}</Pronoun>
			<FormControl style={{minWidth: 120}}>
				<InputLabel id="live-discord-user">Discord User</InputLabel>
				<Select
					labelId="live-discord-user"
					value={props.person.discordID}
					onChange={(e) => nodecg.sendMessage(props.preview ? 'set-discord-user-preview' : 'set-discord-user-live', {...props.person, discordID: e.target.value as string} as CouchPerson)}>
					<MenuItem value="">No user</MenuItem>
					{props.discordUsers.map((user) => {
						return (
							<MenuItem key={user.id} value={user.id}>
								<img
									style={{ borderRadius: '100%', height: 35, width: 'auto', marginRight: 6 }}
									src={user.avatar}
								/>
								{user.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<RedButton style={{ alignSelf: 'flex-end' }} onClick={removeName}>
				<Remove />
			</RedButton>
		</HostComponentContainer>
	);
};

render(<DashCouch />, document.getElementById('couch'));
