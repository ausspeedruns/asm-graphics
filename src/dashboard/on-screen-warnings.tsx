import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

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
			<p style={{ margin: "16px 0 0 0", fontSize: "80%" }}>Pre-made messages:</p>
			<Row>
				<Button variant="outlined" onClick={() => setLocalMessage(MessageFlashingWarning)}>
					Flashing Warning
				</Button>
			</Row>
			<Row>
				<TextField
					multiline
					minRows={3}
					fullWidth
					label="Message"
					value={localMessage}
					onChange={handleMessageChange}
				/>
			</Row>
			<Row>
				<Button color="success" variant={showRep ? "outlined" : "contained"} fullWidth onClick={showMessage}>
					Show Warning
				</Button>
				<Button
					color="error"
					variant={showRep ? "contained" : "outlined"}
					fullWidth
					onClick={() => nodecg.sendMessage("onScreenWarning:setShow", false)}
				>
					Hide Warning
				</Button>
			</Row>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<OnScreenWarningsDash />);
