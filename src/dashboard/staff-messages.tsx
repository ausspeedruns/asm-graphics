import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled, { keyframes } from 'styled-components';

import { StaffMessage } from '@asm-graphics/types/StaffMessages';

import { darkTheme } from './theme';
import { GreenButton, LightTextfield } from './elements/styled-ui';
import { Box, Grid, Snackbar, ThemeProvider, Alert } from '@mui/material';
import { useReplicant } from 'use-nodecg';

const StaffMessagesContainer = styled.div``;

const MessageList = styled.div`
	max-height: 300px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	overflow-y: scroll;
`;

export const StaffMessages: React.FC = () => {
	const [author, setAuthor] = useState('');
	const [message, setMessage] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [staffMessagesRep] = useReplicant<StaffMessage[], StaffMessage[]>(
		'staff-messages',
		[],
	);

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

	const messageMap = staffMessagesRep
		.map((msg) => {
			const date = new Date(msg.date);
			return (
				<Message
					key={date.getTime()}
					message={msg}
					style={{
						margin: msg.fromHost ? '0 32px 0 0' : '0 0 0 32px',
					}}
				/>
			);
		})
		.reverse();

	return (
		<ThemeProvider theme={darkTheme}>
			<MessageList>{messageMap}</MessageList>
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

/* Single Message */
interface MessageProps {
	message: StaffMessage;
	style?: React.CSSProperties;
}

const NewFlash = keyframes`
	from { background-color: #000000; }
	to { background-color: #c8ff00; }
`;

const MessageContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	animation-name: ${NewFlash};
	animation-duration: 0.5s;
	background-color: #4D5E80;
	position: relative;
`;

const DateText = styled.span`
	margin-right: 6px;
	color: #aaa;
`;

const Author = styled.span`
	font-weight: bold;
`;

const Message: React.FC<MessageProps> = (props: MessageProps) => {
	const date = new Date(props.message.date);

	return (
		<MessageContainer boxShadow={2} style={props.style}>
			<Grid direction="column" container>
				<div>
					<DateText>{date.toLocaleTimeString()}</DateText>
					<Author>{props.message.author}</Author>
				</div>
				<span style={{ whiteSpace: 'pre-wrap' }}>
					{props.message.message}
				</span>
			</Grid>
		</MessageContainer>
	);
};

createRoot(document.getElementById('root')!).render(<StaffMessages />);
