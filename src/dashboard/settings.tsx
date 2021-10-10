import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	ThemeProvider,
} from '@material-ui/core';
import { darkTheme } from './theme';
import { useReplicant } from 'use-nodecg';

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export const Settings: React.FC = () => {
	const [locked, setLock] = useState(true);
	const [warning, setWarning] = useState(false);
	const [googleCred, setGoogleCred] = useState('');
	const [creditsNameRep, setCreditsNameRep] = useReplicant<{name: string, title: string}, {name: string, title: string}>('credits-name', {name: '', title: ''});

	return (
		<ThemeProvider theme={darkTheme}>
			<Button variant="outlined" fullWidth onClick={() => (locked ? setWarning(true) : setLock(true))}>
				{locked ? 'Unlock' : 'Lock'}
			</Button>
			<Row>
				<TextField
					fullWidth
					disabled={locked}
					label="Google Credentials"
					value={googleCred}
					onChange={(e) => setGoogleCred(e.target.value)}
				/>
				<Button
					disabled={locked}
					variant="contained"
					onClick={() => nodecg.sendMessage('google-newcred', googleCred)}>
					Update
				</Button>
			</Row>
			<Button disabled={locked} variant="contained" fullWidth onClick={() => nodecg.sendMessage('start-credits')}>
				Run Credits
			</Button>
			<Row>
				<TextField
					fullWidth
					disabled={locked}
					label="Credits Name"
					value={creditsNameRep.name}
					onChange={(e) => setCreditsNameRep({...creditsNameRep, name: e.target.value})}
				/>
				<TextField
					fullWidth
					disabled={locked}
					label="Credits Title"
					value={creditsNameRep.title}
					onChange={(e) => setCreditsNameRep({...creditsNameRep, title: e.target.value})}
				/>
			</Row>
			<Dialog open={warning} onClose={() => setWarning(false)}>
				<DialogTitle>Are you sure?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Changing these settings will break the graphics. Only edit these if you have permission from
						Clubwho or nei_.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setWarning(false)} color="primary">
						Cancel
					</Button>
					<Button
						onClick={() => {
							setWarning(false);
							setLock(false);
						}}
						color="primary">
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
};

render(<Settings />, document.getElementById('settings'));
