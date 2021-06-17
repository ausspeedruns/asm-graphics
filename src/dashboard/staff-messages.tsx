import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { StaffMessage } from '../types/StaffMessages';

import { darkTheme } from './theme';
import { GreenButton, LightTextfield } from './elements/styled-ui';
import { Snackbar, ThemeProvider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const StaffMessagesContainer = styled.div``;

export const StaffMessages: React.FC = () => {
	const [author, setAuthor] = useState('');
	const [message, setMessage] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const sendMessage = () => {
		const msg: StaffMessage = {
			date: new Date(),
			author: author,
			message: message,
		};

		nodecg.sendMessage('staff-sendMessage', msg);
		setAuthor('');
		setMessage('');
		setSnackbarOpen(true);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<StaffMessagesContainer>
				<LightTextfield
					onChange={(e) => setAuthor(e.target.value)}
					value={author}
					label="Author"
					fullWidth
				/>
				<LightTextfield
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					label="Message"
					fullWidth
					multiline
					rows={4}
				/>
				<GreenButton
					variant="contained"
					onClick={sendMessage}
					style={{ marginTop: 8, float: 'right' }}>
					Send
				</GreenButton>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={5000}
					onClose={() => setSnackbarOpen(false)}>
					<Alert
						elevation={6}
						variant="filled"
						onClose={() => setSnackbarOpen(false)}
						severity="success">
						Message sent!
					</Alert>
				</Snackbar>
			</StaffMessagesContainer>
		</ThemeProvider>
	);
};

render(<StaffMessages />, document.getElementById('staff-messages'));
