import { useState } from "react";
import { createRoot } from "react-dom/client";

import { Button, TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme.js";
import { useReplicant } from "@nodecg/react-hooks";
import styles from "./on-screen-warnings.module.css";

const MessageFlashingWarning = "This game contains flashing lights, viewer discretion is advised.";

export const OnScreenWarningsDash: React.FC = () => {
	const [showRep] = useReplicant("onScreenWarning:show");
	const [messageRep] = useReplicant("onScreenWarning:message");

	const [localMessage, setLocalMessage] = useState(messageRep ?? "");

	function handleMessageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setLocalMessage(e.target.value);
	}

	function showMessage() {
		void nodecg.sendMessage("onScreenWarning:setMessage", localMessage);
		void nodecg.sendMessage("onScreenWarning:setShow", true);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			Only Widescreen supports this. More to come?
			<p style={{ margin: "16px 0 0 0", fontSize: "80%" }}>Pre-made messages:</p>
			<div className={styles.row}>
				<Button variant="outlined" onClick={() => setLocalMessage(MessageFlashingWarning)}>
					Flashing Warning
				</Button>
			</div>
			<div className={styles.row}>
				<TextField
					multiline
					minRows={3}
					fullWidth
					label="Message"
					value={localMessage}
					onChange={handleMessageChange}
				/>
			</div>
			<div className={styles.row}>
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
			</div>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<OnScreenWarningsDash />);
