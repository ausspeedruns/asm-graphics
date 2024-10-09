import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { GreenButton, RedButton } from "./elements/styled-ui";

import { Button, TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

const MessageFlashingWarning = "This game contains flashing lights, viewer discretion is advised.";

export const OnScreenWarningsDash: React.FC = () => {
	const [showRep] = useReplicant<boolean>("onScreenWarning:show");
	const [messageRep] = useReplicant<string>("onScreenWarning:message");

	const [localMessage, setLocalMessage] = useState(messageRep ?? "");

	function handleMessageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setLocalMessage(e.target.value);
	}

	function showMessage() {
		nodecg.sendMessage("onScreenWarning:setMessage", localMessage);
		nodecg.sendMessage("onScreenWarning:setShow", true);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			Only Widescreen supports this. More to come?
			<Row>
				<Button variant="outlined" onClick={() => setLocalMessage(MessageFlashingWarning)}>
					Flashing Warning
				</Button>
			</Row>
			<Row>
				<TextField fullWidth label="Message" value={localMessage} onChange={handleMessageChange} />
			</Row>
			<Row>
				<GreenButton variant={showRep ? "outlined" : "contained"} fullWidth onClick={showMessage}>
					Show Warning
				</GreenButton>
				<RedButton
					variant={showRep ? "contained" : "outlined"}
					fullWidth
					onClick={() => nodecg.sendMessage("onScreenWarning:setShow", false)}>
					Hide Warning
				</RedButton>
			</Row>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<OnScreenWarningsDash />);
