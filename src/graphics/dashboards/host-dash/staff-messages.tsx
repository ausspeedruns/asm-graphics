import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

import { StaffMessage } from "@asm-graphics/types/StaffMessages";

import { Box, Grid, Fab, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Close, Check } from "@mui/icons-material";
import { RedButton, GreenButton } from "../../../dashboard/elements/styled-ui";
import { Commentator } from "@asm-graphics/types/OverlayProps";

const StaffMessagesContainer = styled.div`
	height: calc(100% - 56px);
	overflow-x: hidden;
	overflow-y: auto;
`;

const OrangeFAB = styled(Fab)`
	position: fixed !important;
	right: 16px;
	bottom: 24px;

	&.MuiFab-root {
		background-color: var(--asm-orange);
		color: #ffffff;
	}

	&.MuiFab-root:hover {
		background-color: #bc6e20;
	}
`;

export const StaffMessages: React.FC = () => {
	const [staffMessagesRep] = useReplicant<StaffMessage[]>("staff-messages");
	const [host] = useReplicant<Commentator>("host");
	const [replyDialog, setReplyDialog] = useState(false);
	const [replyMsg, setReplyMsg] = useState("");

	const messageMap = staffMessagesRep
		?.map((msg) => {
			const date = new Date(msg.date);
			return (
				<Message
					key={date.getTime()}
					message={msg}
					style={{
						margin: msg.fromHost ? "0 0 0 32px" : "0 32px 0 0",
					}}
				/>
			);
		})
		.reverse() ?? [];

	const sendStaffMessage = () => {
		const msg: StaffMessage = {
			date: new Date(),
			author: host?.name ?? "Unknown",
			message: replyMsg,
			fromHost: true,
		};

		nodecg.sendMessage("staff-sendMessage", msg);
		setReplyMsg("");
		setReplyDialog(false);
	};

	return (
		<StaffMessagesContainer>
			<Grid container direction="column" style={{ padding: 8, gap: 4 }}>
				{messageMap}
			</Grid>
			<OrangeFAB variant="extended" onClick={() => setReplyDialog(true)}>
				Reply
			</OrangeFAB>
			<Dialog open={replyDialog} onClose={() => setReplyDialog(false)} fullWidth>
				<DialogTitle id="form-dialog-title">Reply</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Message"
						multiline
						rows={4}
						fullWidth
						value={replyMsg}
						onChange={(e) => setReplyMsg(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setReplyDialog(false)}>Cancel</Button>
					<Button onClick={sendStaffMessage}>Send</Button>
				</DialogActions>
			</Dialog>
		</StaffMessagesContainer>
	);
};

/* Single Message */

interface MessageProps {
	message: StaffMessage;
	style?: React.CSSProperties;
}

const NewFlash = keyframes`
	from { background-color: #c8ff00; }
	to { background-color: #FF0000; }
`;

const MessageContainer = styled(Box)<ReadProps>`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	animation-name: ${NewFlash};
	animation-duration: 3s;
	background-color: ${({ read }) => (read ? "var(--inset-background)" : "#FF0000")};
	color: ${({ read }) => (read ? "#000" : "#fff")};
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

interface ReadProps {
	read?: boolean;
}

const Message: React.FC<MessageProps> = (props: MessageProps) => {
	const [read, setRead] = useState(false);
	const date = new Date(props.message.date);

	const toggleRead = () => {
		setRead(!read);
	};

	return (
		<MessageContainer read={read || props.message.fromHost} boxShadow={2} style={props.style}>
			<Grid direction="column" container>
				<div>
					<DateText>{date.toLocaleTimeString()}</DateText>
					<Author>{props.message.author}</Author>
				</div>
				<span style={{ whiteSpace: "pre-wrap" }}>{props.message.message}</span>
			</Grid>
			{!props.message.fromHost &&
				(read ? (
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
				))}
		</MessageContainer>
	);
};
