import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { StaffMessage } from '../types/StaffMessages';

import { darkTheme } from './theme';
import { GreenButton, LightTextfield } from './elements/styled-ui';
import { ThemeProvider } from '@material-ui/core';

const StaffMessagesContainer = styled.div``;

export const StaffMessages: React.FC = () => {
	const [author, setAuthor] = useState('');
	const [message, setMessage] = useState('');

	const sendMessage = () => {
		const msg: StaffMessage = {
			date: new Date(),
			author: author,
			message: message,
		};

		nodecg.sendMessage('staff-sendMessage', msg);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<StaffMessagesContainer>
				<LightTextfield onChange={(e) => setAuthor(e.target.value)} value={author} label="Author" fullWidth />
				<LightTextfield
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					label="Message"
					fullWidth
					multiline
					rows={4}
				/>
				<GreenButton variant="contained" onClick={sendMessage} style={{marginTop: 8, float: 'right'}}>
					Send
				</GreenButton>
			</StaffMessagesContainer>
		</ThemeProvider>
	);
};

render(<StaffMessages />, document.getElementById('staff-messages'));
