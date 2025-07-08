import { useState } from "react";
import { createRoot } from "react-dom/client";
import TextField from "@mui/material/TextField";
import { Stack, Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

type TimerFormat = `${number}:${number}:${number}`;

function checkTimerFormat(value: string): value is TimerFormat {
	const regex = /^\d{2}:\d{2}:\d{2}$/;
	return regex.test(value);
}

export function CountdownDashboard() {
	const [time, setTime] = useState<string>("00:00:00");

	function startCountdown() {
		if (!checkTimerFormat(time)) {
			alert("Invalid time format. Please use HH:MM:SS.");
			return;
		}

		nodecg.sendMessage("countdown:start", time);
	}

	function stopCountdown() {
		nodecg.sendMessage("countdown:stop");
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<TextField
				fullWidth
				label="Countdown"
				value={time}
				onChange={(e) => {
					setTime(e.target.value);
				}}
				slotProps={{ htmlInput: { maxLength: 8, inputMode: "numeric", pattern: "\\d{2}:\\d{2}:\\d{2}" } }}
				helperText="Format: 00:00:00"
			/>

			<Stack direction="row" spacing={1}>
				<Button variant="contained" color="success" onClick={startCountdown} fullWidth>
					Start
				</Button>
				<Button variant="outlined" color="error" onClick={stopCountdown} fullWidth>
					Stop
				</Button>
			</Stack>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<CountdownDashboard />);
