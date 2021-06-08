import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { StaffMessage } from '../../types/StaffMessages';

import { Box, Grid } from '@material-ui/core';
import { useReplicant } from 'use-nodecg';
import { Close, Check } from '@material-ui/icons';
import { RedButton, GreenButton } from '../../dashboard/elements/styled-ui';

const StaffMessagesContainer = styled.div`
	height: calc(100% - 56px);
	overflow-x: hidden;
	overflow-y: auto;
`;

export const StaffMessages: React.FC = () => {
	const [staffMessagesRep] = useReplicant<StaffMessage[], StaffMessage[]>('staff-messages', []);

	const messageMap = staffMessagesRep
		.map((msg) => {
			const date = new Date(msg.date);
			return <Message key={date.getTime()} message={msg} />;
		})
		.reverse();

	return (
		<StaffMessagesContainer>
			<Grid container direction="column" style={{ padding: 8 }}>
				{messageMap}
			</Grid>
		</StaffMessagesContainer>
	);
};

/* Single Message */

interface MessageProps {
	message: StaffMessage;
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
	background-color: #eee;
	position: relative;
`;

const DateText = styled.span`
	margin-right: 6px;
	color: #aaa;
`;

const Author = styled.span`
	font-weight: bold;
`;

const DisabledCover = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	top: 0px;
	left: 0px;
	border-radius: 7px;
`;

const Message: React.FC<MessageProps> = (props: MessageProps) => {
	const [read, setRead] = useState(false);
	const date = new Date(props.message.date);

	const toggleRead = () => {
		setRead(!read);
	};

	return (
		<MessageContainer boxShadow={2}>
			<Grid direction="column" container>
				<div>
					<DateText>{date.toLocaleTimeString()}</DateText>
					<Author>{props.message.author}</Author>
				</div>
				<span style={{ whiteSpace: 'pre-wrap' }}>{props.message.message}</span>
			</Grid>
			{read ? (
				<>
					<DisabledCover />
					<RedButton variant="contained" onClick={toggleRead}>
						<Close />
					</RedButton>
				</>
			) : (
				<GreenButton variant="contained" onClick={toggleRead}>
					<Check />
				</GreenButton>
			)}
		</MessageContainer>
	);
};
